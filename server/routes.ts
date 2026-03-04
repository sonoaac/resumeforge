import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { generateResumePDF } from "./pdf";
import { sampleResumeData, resumeDataSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

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

  // PDF Download endpoint (free, no watermark)
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

      const pdfBuffer = await generateResumePDF({
        resumeData: resume.resumeData,
        templateId: resume.templateId || "classic-one",
      });

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
