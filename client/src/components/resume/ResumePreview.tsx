import type { ResumeData } from "@shared/schema";
import { getTemplateById } from "@/lib/templates";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  templateId?: string;
}

const fmt = (d: string): string => {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[+m - 1] || ""} ${y}`;
};

const dr = (s: string, e: string, cur: boolean) => `${fmt(s)} – ${cur ? "Present" : fmt(e)}`;

type SHComp = (props: { title: string }) => JSX.Element;
type SkipSec = "skills" | "languages" | "education";

// ── Shared section body — used by all templates ───────────────────────────────
function Body({
  data, isCV, SH, accent,
  body = "#374151", muted = "#6B7280", bullet = "•",
  skillStyle = "pill", skip = [] as SkipSec[],
}: {
  data: ResumeData; isCV: boolean; SH: SHComp; accent: string;
  body?: string; muted?: string; bullet?: string;
  skillStyle?: "pill" | "inline" | "dot"; skip?: SkipSec[];
}) {
  return (
    <div className="space-y-4">
      {data.summary.text && (
        <section>
          <SH title={isCV ? "Academic Profile" : "Professional Summary"} />
          <p className="text-xs leading-relaxed" style={{ color: body }}>{data.summary.text}</p>
        </section>
      )}

      {!isCV && data.experience.length > 0 && (
        <section>
          <SH title="Experience" />
          <div className="space-y-2.5">
            {data.experience.map(e => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-xs" style={{ color: body }}>{e.jobTitle}</span>
                  <span className="text-xs shrink-0" style={{ color: muted }}>{dr(e.startDate, e.endDate, e.isCurrent)}</span>
                </div>
                <p className="text-xs" style={{ color: muted }}>{e.company}{e.location ? `, ${e.location}` : ""}</p>
                <div className="mt-1 space-y-0.5">
                  {e.bullets.filter(b => b.trim()).map((b, i) => (
                    <p key={i} className="text-xs pl-3" style={{ color: body }}>{bullet} {b}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isCV && (data.research ?? []).length > 0 && (
        <section>
          <SH title="Research Experience" />
          <div className="space-y-2.5">
            {(data.research ?? []).map(r => (
              <div key={r.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-xs" style={{ color: body }}>{r.title}</span>
                  <span className="text-xs shrink-0" style={{ color: muted }}>{dr(r.startDate, r.endDate, r.isCurrent)}</span>
                </div>
                <p className="text-xs" style={{ color: muted }}>{r.institution}{r.supervisor ? ` · ${r.supervisor}` : ""}</p>
                {r.description && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: body }}>{r.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {isCV && (data.teaching ?? []).length > 0 && (
        <section>
          <SH title="Teaching Experience" />
          <div className="space-y-2">
            {(data.teaching ?? []).map(t => (
              <div key={t.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-xs" style={{ color: body }}>{t.course}</span>
                  <span className="text-xs shrink-0" style={{ color: muted }}>{dr(t.startDate, t.endDate, t.isCurrent)}</span>
                </div>
                <p className="text-xs" style={{ color: muted }}>{t.role}{t.institution ? `, ${t.institution}` : ""}</p>
                {t.description && <p className="text-xs italic mt-0.5" style={{ color: muted }}>{t.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {isCV && (data.publications ?? []).length > 0 && (
        <section>
          <SH title="Publications" />
          <div className="space-y-1.5">
            {(data.publications ?? []).map((p, i) => (
              <p key={p.id} className="text-xs leading-snug" style={{ color: body, paddingLeft: "1.5em", textIndent: "-1.5em" }}>
                <span style={{ color: muted }}>[{i + 1}]</span>{" "}{p.authors} ({p.year}). {p.title}.{" "}
                <em style={{ color: muted }}>{p.journal}</em>{p.doi ? ` · ${p.doi}` : ""}
              </p>
            ))}
          </div>
        </section>
      )}

      {isCV && (data.presentations ?? []).length > 0 && (
        <section>
          <SH title="Presentations" />
          <div className="space-y-2">
            {(data.presentations ?? []).map(p => (
              <div key={p.id} className="flex justify-between items-baseline gap-2">
                <div>
                  <span className="font-semibold text-xs" style={{ color: body }}>{p.title}</span>
                  <p className="text-xs capitalize" style={{ color: muted }}>{p.type} · {p.event}{p.location ? `, ${p.location}` : ""}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: muted }}>{fmt(p.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {isCV && (data.grants ?? []).length > 0 && (
        <section>
          <SH title="Grants & Fellowships" />
          <div className="space-y-2">
            {(data.grants ?? []).map(g => (
              <div key={g.id} className="flex justify-between items-baseline gap-2">
                <div>
                  <span className="font-semibold text-xs" style={{ color: body }}>{g.title}</span>
                  <p className="text-xs" style={{ color: muted }}>{g.fundingBody}{g.role ? ` · ${g.role}` : ""}{g.amount ? ` · ${g.amount}` : ""}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: muted }}>{fmt(g.startDate)}{g.endDate ? ` – ${fmt(g.endDate)}` : ""}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {!skip.includes("education") && data.education.length > 0 && (
        <section>
          <SH title="Education" />
          <div className="space-y-2">
            {data.education.map(e => (
              <div key={e.id} className="flex justify-between items-baseline gap-2">
                <div>
                  <span className="font-semibold text-xs" style={{ color: body }}>{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}</span>
                  <p className="text-xs" style={{ color: muted }}>{e.school}{e.location ? `, ${e.location}` : ""}</p>
                  {e.honors && <p className="text-xs italic" style={{ color: muted }}>{e.honors}</p>}
                </div>
                <span className="text-xs shrink-0" style={{ color: muted }}>{dr(e.startDate, e.endDate, e.isCurrent)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {!skip.includes("skills") && data.skills.length > 0 && (
        <section>
          <SH title="Skills" />
          {skillStyle === "pill" && (
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map(s => (
                <span key={s.id} className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${accent}18`, color: accent }}>{s.name}</span>
              ))}
            </div>
          )}
          {skillStyle === "inline" && (
            <p className="text-xs" style={{ color: body }}>{data.skills.map(s => s.name).join(" · ")}</p>
          )}
          {skillStyle === "dot" && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {data.skills.map(s => (
                <span key={s.id} className="text-xs flex items-center gap-1" style={{ color: body }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: accent }} />{s.name}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {!isCV && data.projects.length > 0 && (
        <section>
          <SH title="Projects" />
          <div className="space-y-2">
            {data.projects.map(p => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-xs" style={{ color: body }}>{p.name}{p.role ? ` · ${p.role}` : ""}</span>
                  {(p.startDate || p.endDate) && (
                    <span className="text-xs shrink-0" style={{ color: muted }}>{fmt(p.startDate)}{p.endDate ? ` – ${fmt(p.endDate)}` : ""}</span>
                  )}
                </div>
                {p.description && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: body }}>{p.description}</p>}
                {p.tools && <p className="text-xs italic" style={{ color: muted }}>Tools: {p.tools}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.awards.length > 0 && (
        <section>
          <SH title="Awards & Honors" />
          <div className="space-y-1.5">
            {data.awards.map(a => (
              <div key={a.id} className="flex justify-between items-baseline gap-2">
                <div>
                  <span className="font-medium text-xs" style={{ color: body }}>{a.name}</span>
                  {a.awardingBody && <span className="text-xs" style={{ color: muted }}> · {a.awardingBody}</span>}
                  {a.description && <p className="text-xs" style={{ color: muted }}>{a.description}</p>}
                </div>
                {a.date && <span className="text-xs shrink-0" style={{ color: muted }}>{fmt(a.date)}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {!isCV && data.certifications.length > 0 && (
        <section>
          <SH title="Certifications" />
          <div className="space-y-1">
            {data.certifications.map(c => (
              <div key={c.id} className="flex justify-between items-baseline gap-2">
                <div>
                  <span className="font-medium text-xs" style={{ color: body }}>{c.name}</span>
                  {c.issuer && <span className="text-xs" style={{ color: muted }}> – {c.issuer}</span>}
                </div>
                {c.issueDate && <span className="text-xs shrink-0" style={{ color: muted }}>{fmt(c.issueDate)}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {!skip.includes("languages") && data.languages.length > 0 && (
        <section>
          <SH title="Languages" />
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {data.languages.map(l => (
              <span key={l.id} className="text-xs" style={{ color: body }}>{l.name} <span style={{ color: muted }}>({l.proficiency})</span></span>
            ))}
          </div>
        </section>
      )}

      {isCV && (data.references ?? []).length > 0 && (
        <section>
          <SH title="References" />
          <div className="grid grid-cols-2 gap-3">
            {(data.references ?? []).map(r => (
              <div key={r.id}>
                <p className="font-semibold text-xs" style={{ color: body }}>{r.name}</p>
                {r.title && <p className="text-xs" style={{ color: muted }}>{r.title}</p>}
                {r.institution && <p className="text-xs" style={{ color: muted }}>{r.institution}</p>}
                {r.email && <p className="text-xs" style={{ color: muted }}>{r.email}</p>}
                {r.relationship && <p className="text-xs italic" style={{ color: muted }}>{r.relationship}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── 1. CLASSIC ONE — Navy, left-border header, underlined caps sections ────────
function ClassicOne({ data }: { data: ResumeData }) {
  const accent = "#0A2540";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-0.5 border-b" style={{ color: accent, borderColor: `${accent}50` }}>{title}</h2>
  );
  const contact = [data.profile.email, data.profile.phone, [data.profile.city, data.profile.state].filter(Boolean).join(", "), data.profile.linkedIn, data.profile.portfolio].filter(Boolean);
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5 pb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: "10px" }}>
        <h1 className="font-bold leading-tight" style={{ color: accent, fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {isCV && <p className="font-medium mt-0.5" style={{ color: accent, fontSize: "9px" }}>CURRICULUM VITAE</p>}
        {contact.length > 0 && <p className="text-slate-500 mt-2" style={{ fontSize: "9px" }}>{contact.join("  |  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#1F2937" muted="#6B7280" skillStyle="inline" />
    </div>
  );
}

// ── 2. MODERN SLATE — Teal, two-column with icon sidebar ─────────────────────
function ModernSlate({ data }: { data: ResumeData }) {
  const accent = "#0D9488";
  const sidebarBg = "#F0FDFA";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: accent }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ backgroundColor: accent }} />{title}
    </h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5" style={{ color: accent, borderBottom: `1px solid ${accent}40` }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[33%] p-4 flex flex-col gap-4 shrink-0" style={{ backgroundColor: sidebarBg }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: accent, fontSize: "15px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-600 mt-0.5" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
          {isCV && <p className="mt-0.5 font-medium" style={{ color: accent, fontSize: "9px" }}>Curriculum Vitae</p>}
        </div>
        <div>
          <SSH title="Contact" />
          <div className="space-y-1">
            {data.profile.email && <div className="flex items-start gap-1.5"><Mail className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600 break-all" style={{ fontSize: "9px" }}>{data.profile.email}</span></div>}
            {data.profile.phone && <div className="flex items-start gap-1.5"><Phone className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600">{data.profile.phone}</span></div>}
            {(data.profile.city || data.profile.state) && <div className="flex items-start gap-1.5"><MapPin className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600">{[data.profile.city, data.profile.state].filter(Boolean).join(", ")}</span></div>}
            {data.profile.linkedIn && <div className="flex items-start gap-1.5"><Linkedin className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600 break-all" style={{ fontSize: "9px" }}>{data.profile.linkedIn}</span></div>}
            {data.profile.portfolio && <div className="flex items-start gap-1.5"><Globe className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600 break-all" style={{ fontSize: "9px" }}>{data.profile.portfolio}</span></div>}
          </div>
        </div>
        {data.skills.length > 0 && (
          <div>
            <SSH title="Skills" />
            <div className="flex flex-wrap gap-1">
              {data.skills.map(s => <span key={s.id} className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${accent}20`, color: accent, fontSize: "9px" }}>{s.name}</span>)}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <SSH title="Languages" />
            <div className="space-y-0.5">
              {data.languages.map(l => <p key={l.id} className="text-slate-600" style={{ fontSize: "9px" }}>{l.name} <span className="text-slate-400">({l.proficiency})</span></p>)}
            </div>
          </div>
        )}
        {isCV && data.education.length > 0 && (
          <div>
            <SSH title="Education" />
            <div className="space-y-2">
              {data.education.map(e => (
                <div key={e.id}>
                  <p className="font-semibold text-slate-700" style={{ fontSize: "9px" }}>{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}</p>
                  <p className="text-slate-500" style={{ fontSize: "9px" }}>{e.school}</p>
                  <p className="text-slate-400" style={{ fontSize: "9px" }}>{dr(e.startDate, e.endDate, e.isCurrent)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 p-4 border-l" style={{ borderColor: `${accent}20` }}>
        <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#334155" muted="#64748B" bullet="▸" skillStyle="pill" skip={["skills", "languages", ...(isCV ? ["education" as SkipSec] : [])]} />
      </div>
    </div>
  );
}

// ── 3. EXECUTIVE BOLD — Purple, centered header, thick left-border sections ───
function ExecutiveBold({ data }: { data: ResumeData }) {
  const accent = "#7C3AED";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-black uppercase tracking-widest mb-2 pl-2" style={{ color: accent, borderLeft: `3px solid ${accent}` }}>{title}</h2>
  );
  const contact = [data.profile.email, data.profile.phone, [data.profile.city, data.profile.state].filter(Boolean).join(", "), data.profile.linkedIn].filter(Boolean);
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="text-center mb-5 pb-4" style={{ borderBottom: `2px solid ${accent}` }}>
        <h1 className="font-black tracking-tight" style={{ color: "#1a1a2e", fontSize: "26px", letterSpacing: "-0.5px" }}>{data.profile.fullName || "YOUR NAME"}</h1>
        {data.profile.professionalTitle && (
          <p className="uppercase tracking-widest mt-1 font-semibold" style={{ color: accent, fontSize: "9px" }}>{data.profile.professionalTitle}</p>
        )}
        {isCV && <p className="uppercase tracking-widest mt-0.5 font-medium" style={{ color: "#64748B", fontSize: "8px" }}>Curriculum Vitae</p>}
        {contact.length > 0 && (
          <p className="text-slate-500 mt-2" style={{ fontSize: "9px" }}>{contact.join("  ·  ")}</p>
        )}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#1e1e2e" muted="#64748B" bullet="▪" skillStyle="inline" />
    </div>
  );
}

// ── 4. MINIMAL CLEAN — Dark gray, hairline dividers, maximum whitespace ────────
function MinimalClean({ data }: { data: ResumeData }) {
  const accent = "#374151";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs uppercase tracking-widest font-medium shrink-0" style={{ color: "#9CA3AF", fontSize: "8px" }}>{title}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
    </div>
  );
  const contact = [data.profile.email, data.profile.phone, [data.profile.city, data.profile.state].filter(Boolean).join(", "), data.profile.linkedIn, data.profile.portfolio].filter(Boolean);
  return (
    <div className="bg-white p-8 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-6">
        <h1 className="font-light tracking-tight text-slate-900" style={{ fontSize: "24px", letterSpacing: "-0.3px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-400 mt-0.5 font-light" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {isCV && <p className="text-slate-400 mt-0.5 font-light uppercase tracking-widest" style={{ fontSize: "8px" }}>Curriculum Vitae</p>}
        <div className="h-px bg-slate-200 my-3" />
        {contact.length > 0 && <p className="text-slate-400" style={{ fontSize: "9px" }}>{contact.join("  ·  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#374151" muted="#9CA3AF" bullet="–" skillStyle="inline" />
    </div>
  );
}

// ── 5. CREATIVE VIBRANT — Orange, colored sidebar with white text ──────────────
function CreativeVibrant({ data }: { data: ResumeData }) {
  const accent = "#EA580C";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="mb-2">
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>{title}</h2>
      <div className="h-0.5 mt-0.5 w-8" style={{ backgroundColor: accent }} />
    </div>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5 text-white/70">{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[32%] p-5 flex flex-col gap-4 shrink-0" style={{ backgroundColor: accent }}>
        <div>
          <h1 className="font-black text-white leading-tight" style={{ fontSize: "17px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-white/75 mt-0.5 font-light" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
          {isCV && <p className="text-white/60 mt-0.5 uppercase tracking-widest" style={{ fontSize: "8px" }}>Curriculum Vitae</p>}
        </div>
        <div className="h-px bg-white/25" />
        <div>
          <SSH title="Contact" />
          <div className="space-y-1">
            {data.profile.email && <div className="flex items-start gap-1.5"><Mail className="w-2.5 h-2.5 mt-0.5 shrink-0 text-white/70" /><span className="text-white/80 break-all" style={{ fontSize: "9px" }}>{data.profile.email}</span></div>}
            {data.profile.phone && <div className="flex items-start gap-1.5"><Phone className="w-2.5 h-2.5 mt-0.5 shrink-0 text-white/70" /><span className="text-white/80">{data.profile.phone}</span></div>}
            {(data.profile.city || data.profile.state) && <div className="flex items-start gap-1.5"><MapPin className="w-2.5 h-2.5 mt-0.5 shrink-0 text-white/70" /><span className="text-white/80">{[data.profile.city, data.profile.state].filter(Boolean).join(", ")}</span></div>}
            {data.profile.linkedIn && <div className="flex items-start gap-1.5"><Linkedin className="w-2.5 h-2.5 mt-0.5 shrink-0 text-white/70" /><span className="text-white/80 break-all" style={{ fontSize: "9px" }}>{data.profile.linkedIn}</span></div>}
            {data.profile.portfolio && <div className="flex items-start gap-1.5"><Globe className="w-2.5 h-2.5 mt-0.5 shrink-0 text-white/70" /><span className="text-white/80 break-all" style={{ fontSize: "9px" }}>{data.profile.portfolio}</span></div>}
          </div>
        </div>
        {data.skills.length > 0 && (
          <div>
            <div className="h-px bg-white/25 mb-3" />
            <SSH title="Skills" />
            <div className="space-y-0.5">
              {data.skills.map(s => <p key={s.id} className="text-white/80" style={{ fontSize: "9px" }}>● {s.name}</p>)}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <div className="h-px bg-white/25 mb-3" />
            <SSH title="Languages" />
            <div className="space-y-0.5">
              {data.languages.map(l => <p key={l.id} className="text-white/80" style={{ fontSize: "9px" }}>{l.name} <span className="text-white/50">({l.proficiency})</span></p>)}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 p-5">
        <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#374151" muted="#9CA3AF" bullet="•" skillStyle="pill" skip={["skills", "languages"]} />
      </div>
    </div>
  );
}

// ── 6. ACADEMIC FORMAL — Dark navy, centered, double-rule sections (CV) ────────
function AcademicFormal({ data }: { data: ResumeData }) {
  const accent = "#1E3A5F";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="text-center mb-2">
      <div className="h-0.5 mb-1" style={{ backgroundColor: accent, opacity: 0.3 }} />
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{title}</h2>
      <div className="h-px mt-1" style={{ backgroundColor: accent, opacity: 0.2 }} />
    </div>
  );
  const contact = [data.profile.email, data.profile.phone, [data.profile.city, data.profile.state].filter(Boolean).join(", "), data.profile.linkedIn, data.profile.portfolio, data.profile.website].filter(Boolean);
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="text-center mb-5">
        <h1 className="font-bold" style={{ color: accent, fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-600 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        <p className="font-medium mt-0.5 uppercase tracking-widest" style={{ color: accent, fontSize: "8px" }}>Curriculum Vitae</p>
        <div className="h-0.5 my-3 mx-auto w-16" style={{ backgroundColor: accent }} />
        {contact.length > 0 && <p className="text-slate-500" style={{ fontSize: "9px" }}>{contact.join("  ·  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#1F2937" muted="#6B7280" bullet="•" skillStyle="inline" />
    </div>
  );
}

// ── 7. RESEARCH FOCUSED — Blue, blue-underline headers, numbered pubs (CV) ────
function ResearchFocused({ data }: { data: ResumeData }) {
  const accent = "#0369A1";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="mb-2 pb-0.5" style={{ borderBottom: `2px solid ${accent}` }}>
      <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>{title}</h2>
    </div>
  );
  const contact = [data.profile.email, data.profile.phone, [data.profile.city, data.profile.state].filter(Boolean).join(", "), data.profile.linkedIn, data.profile.portfolio, data.profile.website].filter(Boolean);
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-bold leading-tight" style={{ color: "#0F172A", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
            {data.profile.professionalTitle && <p className="font-medium mt-0.5" style={{ color: accent, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
            <p className="text-slate-400 uppercase tracking-widest mt-0.5" style={{ fontSize: "8px" }}>Curriculum Vitae</p>
          </div>
        </div>
        <div className="h-px mt-3 mb-2" style={{ backgroundColor: `${accent}40` }} />
        {contact.length > 0 && <p className="text-slate-500" style={{ fontSize: "9px" }}>{contact.join("  |  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#1E293B" muted="#64748B" bullet="→" skillStyle="dot" />
    </div>
  );
}

// ── 8. SCHOLAR MODERN — Slate, two-column with education sidebar (CV) ─────────
function ScholarModern({ data }: { data: ResumeData }) {
  const accent = "#475569";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: accent }}>
      <span className="w-1.5 h-1.5 rounded-sm inline-block shrink-0" style={{ backgroundColor: accent }} />{title}
    </h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5" style={{ color: accent, borderBottom: `1px solid ${accent}30` }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[32%] p-4 flex flex-col gap-4 shrink-0" style={{ backgroundColor: "#F8FAFC" }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: "#0F172A", fontSize: "15px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
          <p className="font-medium mt-0.5 uppercase tracking-widest" style={{ color: accent, fontSize: "8px" }}>Curriculum Vitae</p>
        </div>
        <div>
          <SSH title="Contact" />
          <div className="space-y-1">
            {data.profile.email && <div className="flex items-start gap-1.5"><Mail className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600 break-all" style={{ fontSize: "9px" }}>{data.profile.email}</span></div>}
            {data.profile.phone && <div className="flex items-start gap-1.5"><Phone className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600">{data.profile.phone}</span></div>}
            {(data.profile.city || data.profile.state) && <div className="flex items-start gap-1.5"><MapPin className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600">{[data.profile.city, data.profile.state].filter(Boolean).join(", ")}</span></div>}
            {data.profile.website && <div className="flex items-start gap-1.5"><Globe className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: accent }} /><span className="text-slate-600 break-all" style={{ fontSize: "9px" }}>{data.profile.website}</span></div>}
          </div>
        </div>
        {data.education.length > 0 && (
          <div>
            <SSH title="Education" />
            <div className="space-y-2">
              {data.education.map(e => (
                <div key={e.id}>
                  <p className="font-semibold text-slate-700" style={{ fontSize: "9px" }}>{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}</p>
                  <p className="text-slate-500" style={{ fontSize: "9px" }}>{e.school}</p>
                  <p className="text-slate-400" style={{ fontSize: "9px" }}>{dr(e.startDate, e.endDate, e.isCurrent)}</p>
                  {e.honors && <p className="text-slate-400 italic" style={{ fontSize: "8px" }}>{e.honors}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <SSH title="Skills" />
            <div className="space-y-0.5">
              {data.skills.map(s => <p key={s.id} className="text-slate-600" style={{ fontSize: "9px" }}>▸ {s.name}</p>)}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <SSH title="Languages" />
            {data.languages.map(l => <p key={l.id} className="text-slate-600" style={{ fontSize: "9px" }}>{l.name} <span className="text-slate-400">({l.proficiency})</span></p>)}
          </div>
        )}
      </div>
      <div className="flex-1 p-4 border-l" style={{ borderColor: `${accent}20` }}>
        <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#334155" muted="#64748B" bullet="•" skillStyle="pill" skip={["skills", "languages", "education"]} />
      </div>
    </div>
  );
}

// ── 9. PROFESSOR ELEGANT — Green, em-dash section headers, centered (CV) ──────
function ProfessorElegant({ data }: { data: ResumeData }) {
  const accent = "#166534";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-slate-300 text-xs">—</span>
      <h2 className="text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: accent }}>{title}</h2>
      <div className="flex-1 h-px" style={{ backgroundColor: `${accent}30` }} />
    </div>
  );
  const contact = [data.profile.email, data.profile.phone, [data.profile.city, data.profile.state].filter(Boolean).join(", "), data.profile.website || data.profile.portfolio].filter(Boolean);
  return (
    <div className="bg-white px-8 py-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="text-center mb-6">
        <h1 className="font-semibold" style={{ color: "#0F172A", fontSize: "22px", letterSpacing: "-0.2px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5 italic" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        <p className="uppercase tracking-widest mt-0.5 font-medium" style={{ color: accent, fontSize: "8px" }}>Curriculum Vitae</p>
        <div className="h-px my-3 mx-auto" style={{ backgroundColor: `${accent}40`, maxWidth: "80px" }} />
        {contact.length > 0 && <p className="text-slate-500" style={{ fontSize: "9px" }}>{contact.join("  ·  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#1F2937" muted="#6B7280" bullet="•" skillStyle="inline" />
    </div>
  );
}

// ── 10. PHD DYNAMIC — Purple, split header, triangle-prefix sections (CV) ─────
function PhdDynamic({ data }: { data: ResumeData }) {
  const accent = "#5B21B6";
  const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: accent }}>
      <span style={{ color: accent }}>▶</span>{title}
    </h2>
  );
  const contact = [data.profile.email, data.profile.phone, [data.profile.city, data.profile.state].filter(Boolean).join(", "), data.profile.website || data.profile.portfolio].filter(Boolean);
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex justify-between items-start gap-4 mb-5 pb-3" style={{ borderBottom: `2px solid ${accent}` }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: "#0F172A", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="font-medium mt-0.5" style={{ color: accent, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
          <p className="text-slate-400 uppercase tracking-widest mt-0.5" style={{ fontSize: "8px" }}>Curriculum Vitae</p>
        </div>
        {contact.length > 0 && (
          <div className="text-right shrink-0 space-y-0.5">
            {contact.map((c, i) => <p key={i} className="text-slate-500" style={{ fontSize: "9px" }}>{c}</p>)}
          </div>
        )}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={accent} body="#1E1B4B" muted="#64748B" bullet="◆" skillStyle="dot" />
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
export function ResumePreview({ data, templateId = "classic-one" }: ResumePreviewProps) {
  const template = getTemplateById(templateId);
  const id = template?.id ?? "classic-one";

  const wrapperClass = "bg-white shadow-lg rounded-lg overflow-hidden";

  switch (id) {
    case "modern-slate":    return <div className={wrapperClass}><ModernSlate data={data} /></div>;
    case "executive-bold":  return <div className={wrapperClass}><ExecutiveBold data={data} /></div>;
    case "minimal-clean":   return <div className={wrapperClass}><MinimalClean data={data} /></div>;
    case "creative-vibrant":return <div className={wrapperClass}><CreativeVibrant data={data} /></div>;
    case "academic-formal": return <div className={wrapperClass}><AcademicFormal data={data} /></div>;
    case "research-focused":return <div className={wrapperClass}><ResearchFocused data={data} /></div>;
    case "scholar-modern":  return <div className={wrapperClass}><ScholarModern data={data} /></div>;
    case "professor-elegant":return <div className={wrapperClass}><ProfessorElegant data={data} /></div>;
    case "phd-dynamic":     return <div className={wrapperClass}><PhdDynamic data={data} /></div>;
    default:                return <div className={wrapperClass}><ClassicOne data={data} /></div>;
  }
}
