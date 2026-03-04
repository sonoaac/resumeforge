import PDFDocument from "pdfkit";
import type { ResumeData } from "@shared/schema";

interface GeneratePDFOptions {
  resumeData: ResumeData;
  templateId: string;
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month) - 1] || ""} ${year}`;
};

export function generateResumePDF({ resumeData, templateId }: GeneratePDFOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const isCV = resumeData.documentType === "cv";
      const docTitle = isCV ? "Curriculum Vitae" : "Resume";

      const doc = new PDFDocument({
        size: "LETTER",
        margin: 50,
        info: {
          Title: `${resumeData.profile.fullName || "Document"} - ${docTitle}`,
          Author: resumeData.profile.fullName || "ResumeForge User",
          Subject: `Professional ${docTitle}`,
          Creator: "ResumeForge",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const primaryColor = "#14B8A6";
      const textColor = "#1F2937";
      const mutedColor = "#6B7280";

      // ── Header ──────────────────────────────────────────────
      doc.fontSize(24).fillColor(primaryColor).text(resumeData.profile.fullName || "Your Name", { align: "left" });

      if (resumeData.profile.professionalTitle) {
        doc.fontSize(12).fillColor(mutedColor).text(resumeData.profile.professionalTitle);
      }

      if (isCV) {
        doc.fontSize(10).fillColor(primaryColor).text("Curriculum Vitae");
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
        doc.fontSize(10).fillColor(mutedColor).text(contactItems.join("  |  "));
      }

      doc.moveDown(1);

      // ── Helper: section heading ────────────────────────────
      const sectionHeading = (title: string) => {
        doc.fontSize(12).fillColor(primaryColor).text(title.toUpperCase(), { underline: true });
        doc.moveDown(0.3);
      };

      // ── Summary / Academic Profile ─────────────────────────
      if (resumeData.summary.text) {
        sectionHeading(isCV ? "Academic Profile" : "Professional Summary");
        doc.fontSize(10).fillColor(textColor).text(resumeData.summary.text, { lineGap: 2 });
        doc.moveDown(1);
      }

      // ── RESUME-ONLY: Experience ────────────────────────────
      if (!isCV && resumeData.experience.length > 0) {
        sectionHeading("Experience");

        resumeData.experience.forEach((exp, index) => {
          doc.fontSize(11).fillColor(textColor).text(exp.jobTitle, { continued: true });
          doc.fillColor(mutedColor).text(` at ${exp.company}${exp.location ? ` - ${exp.location}` : ""}`);

          const dateStr = `${formatDate(exp.startDate)} – ${exp.isCurrent ? "Present" : formatDate(exp.endDate)}`;
          doc.fontSize(9).fillColor(mutedColor).text(dateStr);

          if (exp.bullets.length > 0) {
            doc.moveDown(0.2);
            exp.bullets.filter(b => b.trim()).forEach((bullet) => {
              doc.fontSize(10).fillColor(textColor).text(`• ${bullet}`, { indent: 15, lineGap: 1 });
            });
          }

          if (index < resumeData.experience.length - 1) doc.moveDown(0.5);
        });
        doc.moveDown(1);
      }

      // ── CV-ONLY: Research Experience ──────────────────────
      if (isCV && (resumeData.research ?? []).length > 0) {
        sectionHeading("Research Experience");

        (resumeData.research ?? []).forEach((res, index) => {
          doc.fontSize(11).fillColor(textColor).text(res.title);
          doc.fontSize(10).fillColor(mutedColor).text(
            `${res.institution}${res.supervisor ? ` · Supervisor: ${res.supervisor}` : ""}`
          );
          const dateStr = `${formatDate(res.startDate)} – ${res.isCurrent ? "Present" : formatDate(res.endDate)}`;
          doc.fontSize(9).fillColor(mutedColor).text(dateStr);
          if (res.description) {
            doc.moveDown(0.2);
            doc.fontSize(10).fillColor(textColor).text(res.description, { lineGap: 1 });
          }
          if (index < (resumeData.research ?? []).length - 1) doc.moveDown(0.5);
        });
        doc.moveDown(1);
      }

      // ── CV-ONLY: Teaching Experience ──────────────────────
      if (isCV && (resumeData.teaching ?? []).length > 0) {
        sectionHeading("Teaching Experience");

        (resumeData.teaching ?? []).forEach((t, index) => {
          doc.fontSize(11).fillColor(textColor).text(t.course, { continued: true });
          doc.fillColor(mutedColor).text(` · ${t.role}`);
          doc.fontSize(10).fillColor(mutedColor).text(t.institution);
          const dateStr = `${formatDate(t.startDate)} – ${t.isCurrent ? "Present" : formatDate(t.endDate)}`;
          doc.fontSize(9).fillColor(mutedColor).text(dateStr);
          if (t.description) {
            doc.fontSize(9).fillColor(mutedColor).text(t.description, { oblique: true });
          }
          if (index < (resumeData.teaching ?? []).length - 1) doc.moveDown(0.4);
        });
        doc.moveDown(1);
      }

      // ── CV-ONLY: Publications ──────────────────────────────
      if (isCV && (resumeData.publications ?? []).length > 0) {
        sectionHeading("Publications");

        (resumeData.publications ?? []).forEach((pub, index) => {
          const line = [
            pub.authors,
            pub.year ? `(${pub.year})` : "",
            pub.title ? `${pub.title}.` : "",
            pub.journal ? pub.journal : "",
            pub.doi ? pub.doi : "",
          ].filter(Boolean).join(" ");
          doc.fontSize(10).fillColor(textColor).text(line, { lineGap: 1 });
          if (index < (resumeData.publications ?? []).length - 1) doc.moveDown(0.3);
        });
        doc.moveDown(1);
      }

      // ── CV-ONLY: Presentations ────────────────────────────
      if (isCV && (resumeData.presentations ?? []).length > 0) {
        sectionHeading("Presentations");

        (resumeData.presentations ?? []).forEach((pres, index) => {
          doc.fontSize(11).fillColor(textColor).text(pres.title);
          const detail = [pres.type?.charAt(0).toUpperCase() + pres.type?.slice(1), pres.event, pres.location, formatDate(pres.date)].filter(Boolean).join(" · ");
          doc.fontSize(10).fillColor(mutedColor).text(detail);
          if (index < (resumeData.presentations ?? []).length - 1) doc.moveDown(0.3);
        });
        doc.moveDown(1);
      }

      // ── CV-ONLY: Grants & Fellowships ─────────────────────
      if (isCV && (resumeData.grants ?? []).length > 0) {
        sectionHeading("Grants & Fellowships");

        (resumeData.grants ?? []).forEach((grant, index) => {
          doc.fontSize(11).fillColor(textColor).text(grant.title);
          const meta = [grant.fundingBody, grant.role, grant.amount].filter(Boolean).join(" · ");
          if (meta) doc.fontSize(10).fillColor(mutedColor).text(meta);
          const dateStr = [formatDate(grant.startDate), formatDate(grant.endDate)].filter(Boolean).join(" – ");
          if (dateStr) doc.fontSize(9).fillColor(mutedColor).text(dateStr);
          if (grant.description) doc.fontSize(9).fillColor(mutedColor).text(grant.description, { oblique: true });
          if (index < (resumeData.grants ?? []).length - 1) doc.moveDown(0.4);
        });
        doc.moveDown(1);
      }

      // ── Education (both) ─────────────────────────────────
      if (resumeData.education.length > 0) {
        sectionHeading("Education");

        resumeData.education.forEach((edu, index) => {
          const degreeStr = `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`;
          doc.fontSize(11).fillColor(textColor).text(degreeStr);
          doc.fontSize(10).fillColor(mutedColor).text(`${edu.school}${edu.location ? `, ${edu.location}` : ""}`);
          const dateStr = `${formatDate(edu.startDate)} – ${edu.isCurrent ? "Present" : formatDate(edu.endDate)}`;
          doc.fontSize(9).fillColor(mutedColor).text(dateStr);
          if (edu.honors) doc.fontSize(9).fillColor(mutedColor).text(edu.honors, { oblique: true });
          if (index < resumeData.education.length - 1) doc.moveDown(0.3);
        });
        doc.moveDown(1);
      }

      // ── Skills (both) ─────────────────────────────────────
      if (resumeData.skills.length > 0) {
        sectionHeading("Skills");
        const skillNames = resumeData.skills.map(s => s.name).join("  •  ");
        doc.fontSize(10).fillColor(textColor).text(skillNames);
        doc.moveDown(1);
      }

      // ── RESUME-ONLY: Projects ─────────────────────────────
      if (!isCV && resumeData.projects.length > 0) {
        sectionHeading("Projects");

        resumeData.projects.forEach((project, index) => {
          doc.fontSize(11).fillColor(textColor).text(project.name, { continued: project.role ? true : false });
          if (project.role) doc.fillColor(mutedColor).text(` - ${project.role}`);
          if (project.description) doc.fontSize(10).fillColor(textColor).text(project.description);
          if (project.tools) doc.fontSize(9).fillColor(mutedColor).text(`Tools: ${project.tools}`);
          if (index < resumeData.projects.length - 1) doc.moveDown(0.3);
        });
        doc.moveDown(1);
      }

      // ── Awards (both) ────────────────────────────────────
      if (resumeData.awards.length > 0) {
        sectionHeading("Awards & Honors");
        resumeData.awards.forEach((award) => {
          const line = [award.name, award.awardingBody, formatDate(award.date)].filter(Boolean).join(" · ");
          doc.fontSize(10).fillColor(textColor).text(`• ${line}`);
          if (award.description) doc.fontSize(9).fillColor(mutedColor).text(`  ${award.description}`, { oblique: true });
        });
        doc.moveDown(1);
      }

      // ── Certifications (resume only) ──────────────────────
      if (!isCV && resumeData.certifications.length > 0) {
        sectionHeading("Certifications");
        resumeData.certifications.forEach((cert) => {
          doc.fontSize(10).fillColor(textColor)
             .text(`• ${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ""}${cert.issueDate ? ` (${formatDate(cert.issueDate)})` : ""}`);
        });
        doc.moveDown(1);
      }

      // ── Languages (both) ─────────────────────────────────
      if (resumeData.languages.length > 0) {
        sectionHeading("Languages");
        const langStr = resumeData.languages.map(l => `${l.name} (${l.proficiency})`).join("  •  ");
        doc.fontSize(10).fillColor(textColor).text(langStr);
        doc.moveDown(1);
      }

      // ── CV-ONLY: References ───────────────────────────────
      if (isCV && (resumeData.references ?? []).length > 0) {
        sectionHeading("References");

        (resumeData.references ?? []).forEach((ref, index) => {
          doc.fontSize(11).fillColor(textColor).text(ref.name);
          if (ref.title) doc.fontSize(10).fillColor(mutedColor).text(ref.title);
          if (ref.institution) doc.fontSize(10).fillColor(mutedColor).text(ref.institution);
          if (ref.email) doc.fontSize(9).fillColor(mutedColor).text(ref.email);
          if (ref.relationship) doc.fontSize(9).fillColor(mutedColor).text(ref.relationship, { oblique: true });
          if (index < (resumeData.references ?? []).length - 1) doc.moveDown(0.5);
        });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
