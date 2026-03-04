import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault, verifyPaypalOrder } from "./paypal";
import { generateResumePDF } from "./pdf";
import { sampleResumeData, resumeDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // PayPal routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Seed templates on startup
  await storage.seedTemplates();

  // Public PDF generation endpoint (no auth required - for guest mode)
  app.post("/api/pdf/generate", async (req, res) => {
    try {
      const { resumeData, templateId } = req.body;

      const parsed = resumeDataSchema.safeParse(resumeData);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid resume data" });
      }

      const pdfBuffer = await generateResumePDF({
        resumeData: parsed.data,
        templateId: templateId || "classic-one",
        showWatermark: true,
      });

      const filename = `${parsed.data.profile.fullName || "resume"}.pdf`.replace(/[^a-zA-Z0-9.-]/g, "_");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // Templates API
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Resumes API (protected)
  app.get("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumes = await storage.getResumesByUser(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  app.get("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      if (resume.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ error: "Failed to fetch resume" });
    }
  });

  app.post("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { resumeData, templateId, title } = req.body;

      // Validate resume data if provided
      let validatedData = sampleResumeData;
      if (resumeData) {
        const parsed = resumeDataSchema.safeParse(resumeData);
        if (parsed.success) {
          validatedData = parsed.data;
        }
      }

      const resume = await storage.createResume({
        userId,
        title: title || "My Resume",
        templateId: templateId || "classic-one",
        resumeData: validatedData,
      });

      res.status(201).json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(500).json({ error: "Failed to create resume" });
    }
  });

  app.patch("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      if (resume.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const { resumeData, templateId, title, isPublic } = req.body;
      const updates: any = {};

      if (resumeData) {
        const parsed = resumeDataSchema.safeParse(resumeData);
        if (parsed.success) {
          updates.resumeData = parsed.data;
        }
      }

      if (templateId) updates.templateId = templateId;
      if (title) updates.title = title;
      if (typeof isPublic === "boolean") updates.isPublic = isPublic;

      const updated = await storage.updateResume(req.params.id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ error: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      if (resume.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await storage.deleteResume(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ error: "Failed to delete resume" });
    }
  });

  app.post("/api/resumes/:id/duplicate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      if (resume.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const duplicate = await storage.duplicateResume(req.params.id);
      res.status(201).json(duplicate);
    } catch (error) {
      console.error("Error duplicating resume:", error);
      res.status(500).json({ error: "Failed to duplicate resume" });
    }
  });

  // Subscription API (protected)
  app.get("/api/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let subscription = await storage.getSubscription(userId);
      
      // Create default free subscription if none exists
      if (!subscription) {
        subscription = await storage.createOrUpdateSubscription({
          userId,
          status: "free",
        });
      }
      
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Payments API (protected)
  app.get("/api/payments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getPaymentsByUser(userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // Pricing tier definitions - must match frontend pricing page
  const PRICING_TIERS = {
    onetime: { amount: "14.99", currency: "USD" },
    subscription: { amount: "9.99", currency: "USD" },
  } as const;

  app.post("/api/payments/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { paypalOrderId, type, resumeId } = req.body;

      if (!paypalOrderId) {
        return res.status(400).json({ error: "PayPal order ID required" });
      }

      const paymentType = type === "subscription" ? "subscription" : "onetime";

      // Server-side verification of PayPal order
      const verification = await verifyPaypalOrder(paypalOrderId);
      
      if (!verification.verified) {
        console.error("PayPal order verification failed:", verification);
        return res.status(400).json({ 
          error: "Payment verification failed. Please try again or contact support." 
        });
      }

      // Validate amount matches expected pricing tier
      const expectedPricing = PRICING_TIERS[paymentType as keyof typeof PRICING_TIERS];
      const verifiedAmount = parseFloat(verification.amount || "0");
      const expectedAmount = parseFloat(expectedPricing.amount);

      if (verifiedAmount < expectedAmount) {
        console.error(`Payment amount mismatch: received ${verifiedAmount}, expected ${expectedAmount}`);
        return res.status(400).json({ 
          error: "Payment amount does not match expected price. Please contact support." 
        });
      }

      if (verification.currency !== expectedPricing.currency) {
        console.error(`Payment currency mismatch: received ${verification.currency}, expected ${expectedPricing.currency}`);
        return res.status(400).json({ 
          error: "Invalid payment currency. Please contact support." 
        });
      }

      // Create payment record with verified data
      const payment = await storage.createPayment({
        userId,
        resumeId,
        paypalOrderId,
        amount: verification.amount || expectedPricing.amount,
        type: paymentType,
        status: "completed",
      });

      // Update subscription based on verified payment
      if (paymentType === "subscription") {
        await storage.createOrUpdateSubscription({
          userId,
          status: "pro",
          paypalSubscriptionId: paypalOrderId,
        });
      } else if (paymentType === "onetime") {
        const currentSub = await storage.getSubscription(userId);
        if (!currentSub || currentSub.status === "free") {
          await storage.createOrUpdateSubscription({
            userId,
            status: "onetime",
            exportsRemaining: 5,
          });
        }
      }

      res.json({ success: true, payment });
    } catch (error) {
      console.error("Error completing payment:", error);
      res.status(500).json({ error: "Failed to complete payment" });
    }
  });

  // Exports API (protected)
  app.get("/api/exports", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const exports = await storage.getExportsByUser(userId);
      res.json(exports);
    } catch (error) {
      console.error("Error fetching exports:", error);
      res.status(500).json({ error: "Failed to fetch exports" });
    }
  });

  app.post("/api/exports", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { resumeId, exportType } = req.body;

      // Check subscription status
      const subscription = await storage.getSubscription(userId);
      const hasWatermark = !subscription || subscription.status === "free";

      // For DOCX, require Pro
      if (exportType === "docx" && subscription?.status !== "pro") {
        return res.status(403).json({ error: "DOCX export requires Pro subscription" });
      }

      // Create export record
      const exportRecord = await storage.createExport({
        userId,
        resumeId,
        exportType,
        hasWatermark,
      });

      // Decrease exports remaining for onetime users
      if (subscription?.status === "onetime" && subscription.exportsRemaining) {
        await storage.createOrUpdateSubscription({
          userId,
          status: subscription.exportsRemaining > 1 ? "onetime" : "free",
          exportsRemaining: Math.max(0, subscription.exportsRemaining - 1),
        });
      }

      res.json({ success: true, export: exportRecord, hasWatermark });
    } catch (error) {
      console.error("Error creating export:", error);
      res.status(500).json({ error: "Failed to create export" });
    }
  });

  // PDF Download endpoint
  app.get("/api/resumes/:id/download", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      if (resume.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Check subscription status for watermark
      const subscription = await storage.getSubscription(userId);
      const showWatermark = !subscription || subscription.status === "free";

      // Check if onetime user has exports remaining
      if (subscription?.status === "onetime" && (subscription.exportsRemaining || 0) <= 0) {
        return res.status(403).json({ 
          error: "No exports remaining. Please upgrade to Pro for unlimited exports." 
        });
      }

      // Generate PDF
      const pdfBuffer = await generateResumePDF({
        resumeData: resume.resumeData,
        templateId: resume.templateId || "classic-one",
        showWatermark,
      });

      // Record the export
      await storage.createExport({
        userId,
        resumeId: resume.id,
        exportType: "pdf",
        hasWatermark: showWatermark,
      });

      // Decrease exports remaining for onetime users
      if (subscription?.status === "onetime" && subscription.exportsRemaining) {
        await storage.createOrUpdateSubscription({
          userId,
          status: subscription.exportsRemaining > 1 ? "onetime" : "free",
          exportsRemaining: Math.max(0, subscription.exportsRemaining - 1),
        });
      }

      // Send the PDF
      const filename = `${resume.resumeData.profile.fullName || "resume"}.pdf`.replace(/[^a-zA-Z0-9.-]/g, "_");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  return httpServer;
}
