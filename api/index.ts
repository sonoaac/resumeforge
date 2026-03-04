// Vercel serverless entry point
// Handles API routes for the guest-mode app (no DB required)
import express from "express";
import { generateResumePDF } from "../server/pdf";
import { resumeDataSchema } from "../shared/schema";
import { MemStorage } from "../server/storage";

const app = express();
app.use(express.json({ limit: "10mb" }));

const storage = new MemStorage();
// Seed templates synchronously on cold start
storage.seedTemplates();

// Templates API (public)
app.get("/api/templates", async (_req, res) => {
  try {
    const tmpl = await storage.getAllTemplates();
    res.json(tmpl);
  } catch {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Public PDF generation (guest mode — watermark always shown)
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

    const filename = `${parsed.data.profile.fullName || "resume"}.pdf`.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// Auth status — always unauthenticated without Replit env
app.get("/api/auth/user", (_req, res) => {
  res.status(401).json({ message: "Unauthorized" });
});

// All other API routes require auth / DB
app.all("*", (_req, res) => {
  res.status(401).json({ message: "Unauthorized" });
});

export default app;
