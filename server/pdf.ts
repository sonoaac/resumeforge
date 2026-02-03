import PDFDocument from "pdfkit";
import type { ResumeData } from "@shared/schema";

interface GeneratePDFOptions {
  resumeData: ResumeData;
  templateId: string;
  showWatermark: boolean;
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month) - 1] || ""} ${year}`;
};

export function generateResumePDF({ resumeData, templateId, showWatermark }: GeneratePDFOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margin: 50,
        info: {
          Title: `${resumeData.profile.fullName || "Resume"} - Resume`,
          Author: resumeData.profile.fullName || "ResumeForge User",
          Subject: "Professional Resume",
          Creator: "ResumeForge",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const primaryColor = "#14B8A6"; // Teal accent
      const textColor = "#1F2937";
      const mutedColor = "#6B7280";

      // Header section
      doc.fontSize(24)
         .fillColor(primaryColor)
         .text(resumeData.profile.fullName || "Your Name", { align: "left" });

      if (resumeData.profile.professionalTitle) {
        doc.fontSize(12)
           .fillColor(mutedColor)
           .text(resumeData.profile.professionalTitle);
      }

      doc.moveDown(0.5);

      // Contact info
      const contactItems: string[] = [];
      if (resumeData.profile.email) contactItems.push(resumeData.profile.email);
      if (resumeData.profile.phone) contactItems.push(resumeData.profile.phone);
      if (resumeData.profile.city || resumeData.profile.state) {
        contactItems.push([resumeData.profile.city, resumeData.profile.state].filter(Boolean).join(", "));
      }
      if (resumeData.profile.linkedIn) contactItems.push(resumeData.profile.linkedIn);
      if (resumeData.profile.portfolio) contactItems.push(resumeData.profile.portfolio);

      if (contactItems.length > 0) {
        doc.fontSize(10)
           .fillColor(mutedColor)
           .text(contactItems.join("  |  "));
      }

      doc.moveDown(1);

      // Summary section
      if (resumeData.summary.text) {
        doc.fontSize(12)
           .fillColor(primaryColor)
           .text("PROFESSIONAL SUMMARY", { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(10)
           .fillColor(textColor)
           .text(resumeData.summary.text, { lineGap: 2 });
        doc.moveDown(1);
      }

      // Experience section
      if (resumeData.experience.length > 0) {
        doc.fontSize(12)
           .fillColor(primaryColor)
           .text("EXPERIENCE", { underline: true });
        doc.moveDown(0.3);

        resumeData.experience.forEach((exp, index) => {
          doc.fontSize(11)
             .fillColor(textColor)
             .text(exp.jobTitle, { continued: true });
          doc.fillColor(mutedColor)
             .text(` at ${exp.company}${exp.location ? ` - ${exp.location}` : ""}`);

          const dateStr = `${formatDate(exp.startDate)} - ${exp.isCurrent ? "Present" : formatDate(exp.endDate)}`;
          doc.fontSize(9)
             .fillColor(mutedColor)
             .text(dateStr);

          if (exp.bullets.length > 0) {
            doc.moveDown(0.2);
            exp.bullets.filter(b => b.trim()).forEach((bullet) => {
              doc.fontSize(10)
                 .fillColor(textColor)
                 .text(`• ${bullet}`, { indent: 15, lineGap: 1 });
            });
          }

          if (index < resumeData.experience.length - 1) {
            doc.moveDown(0.5);
          }
        });
        doc.moveDown(1);
      }

      // Education section
      if (resumeData.education.length > 0) {
        doc.fontSize(12)
           .fillColor(primaryColor)
           .text("EDUCATION", { underline: true });
        doc.moveDown(0.3);

        resumeData.education.forEach((edu, index) => {
          const degreeStr = `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`;
          doc.fontSize(11)
             .fillColor(textColor)
             .text(degreeStr);
          doc.fontSize(10)
             .fillColor(mutedColor)
             .text(`${edu.school}${edu.location ? `, ${edu.location}` : ""}`);

          const dateStr = `${formatDate(edu.startDate)} - ${edu.isCurrent ? "Present" : formatDate(edu.endDate)}`;
          doc.fontSize(9)
             .fillColor(mutedColor)
             .text(dateStr);

          if (edu.honors) {
            doc.fontSize(9)
               .fillColor(mutedColor)
               .text(edu.honors, { oblique: true });
          }

          if (index < resumeData.education.length - 1) {
            doc.moveDown(0.3);
          }
        });
        doc.moveDown(1);
      }

      // Skills section
      if (resumeData.skills.length > 0) {
        doc.fontSize(12)
           .fillColor(primaryColor)
           .text("SKILLS", { underline: true });
        doc.moveDown(0.3);

        const skillNames = resumeData.skills.map(s => s.name).join("  •  ");
        doc.fontSize(10)
           .fillColor(textColor)
           .text(skillNames);
        doc.moveDown(1);
      }

      // Projects section
      if (resumeData.projects.length > 0) {
        doc.fontSize(12)
           .fillColor(primaryColor)
           .text("PROJECTS", { underline: true });
        doc.moveDown(0.3);

        resumeData.projects.forEach((project, index) => {
          doc.fontSize(11)
             .fillColor(textColor)
             .text(project.name, { continued: project.role ? true : false });
          if (project.role) {
            doc.fillColor(mutedColor)
               .text(` - ${project.role}`);
          }

          if (project.description) {
            doc.fontSize(10)
               .fillColor(textColor)
               .text(project.description);
          }

          if (project.tools) {
            doc.fontSize(9)
               .fillColor(mutedColor)
               .text(`Tools: ${project.tools}`);
          }

          if (index < resumeData.projects.length - 1) {
            doc.moveDown(0.3);
          }
        });
        doc.moveDown(1);
      }

      // Certifications section
      if (resumeData.certifications.length > 0) {
        doc.fontSize(12)
           .fillColor(primaryColor)
           .text("CERTIFICATIONS", { underline: true });
        doc.moveDown(0.3);

        resumeData.certifications.forEach((cert) => {
          doc.fontSize(10)
             .fillColor(textColor)
             .text(`• ${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ""}${cert.issueDate ? ` (${formatDate(cert.issueDate)})` : ""}`);
        });
        doc.moveDown(1);
      }

      // Languages section
      if (resumeData.languages.length > 0) {
        doc.fontSize(12)
           .fillColor(primaryColor)
           .text("LANGUAGES", { underline: true });
        doc.moveDown(0.3);

        const langStr = resumeData.languages.map(l => `${l.name} (${l.proficiency})`).join("  •  ");
        doc.fontSize(10)
           .fillColor(textColor)
           .text(langStr);
      }

      // Watermark
      if (showWatermark) {
        doc.save();
        doc.rotate(-45, { origin: [306, 396] });
        doc.fontSize(60)
           .fillOpacity(0.08)
           .fillColor("#000000")
           .text("ResumeForge", 100, 400);
        doc.restore();
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
