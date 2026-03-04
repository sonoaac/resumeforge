import { useEffect, useState } from "react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import type { ResumeData } from "@shared/schema";
import { sampleResumeData } from "@shared/schema";
import { Printer, X } from "lucide-react";

export default function ResumePrintPage() {
  const [data, setData] = useState<ResumeData>(sampleResumeData);
  const [templateId, setTemplateId] = useState("classic-clean");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("resumeforge_print_job");
    if (stored) {
      try {
        const { resumeData, templateId: tid } = JSON.parse(stored);
        if (resumeData) setData(resumeData);
        if (tid) setTemplateId(tid);
      } catch {}
    }
    setReady(true);
  }, []);

  // Auto-print after styles + fonts are loaded
  useEffect(() => {
    if (!ready) return;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setTimeout(() => window.print(), 400));
    } else {
      setTimeout(() => window.print(), 1000);
    }
  }, [ready]);

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      {/* Print-specific CSS */}
      <style>{`
        @page { size: letter portrait; margin: 0; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        @media print {
          html, body { margin: 0; padding: 0; background: white !important; }
          #print-toolbar { display: none !important; }
          #print-wrapper { background: none !important; padding: 0 !important; min-height: unset !important; }
          #resume-content { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div id="print-toolbar" style={{ position: "sticky", top: 0, zIndex: 50, background: "#0f172a", color: "white", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}>Print / Save as PDF</p>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: 2 }}>
            In the print dialog → <strong style={{ color: "#e2e8f0" }}>Destination: Save as PDF</strong> · <strong style={{ color: "#e2e8f0" }}>Margins: None</strong> · enable <strong style={{ color: "#e2e8f0" }}>Background graphics</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => window.print()}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#14B8A6", color: "white", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Printer style={{ width: 15, height: 15 }} />
            Print / Save PDF
          </button>
          <button
            onClick={() => window.close()}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#334155", color: "white", border: "none", padding: "8px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}
            title="Close"
          >
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>

      {/* Resume preview */}
      <div id="print-wrapper" style={{ padding: "32px 0", display: "flex", justifyContent: "center" }}>
        <div
          id="resume-content"
          style={{ width: 816, background: "white", boxShadow: "0 4px 32px rgba(0,0,0,0.18)", borderRadius: 4, overflow: "hidden" }}
        >
          {ready && <ResumePreview data={data} templateId={templateId} />}
        </div>
      </div>
    </div>
  );
}
