import type { ResumeData } from "@shared/schema";
import { getTemplateById } from "@/lib/templates";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface ResumePreviewProps { data: ResumeData; templateId?: string; }

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d: string) => {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${mo[+m - 1] ?? ""} ${y}`.trim();
};
const dr  = (s: string, e: string, cur: boolean) => `${fmt(s)}${fmt(s) ? " – " : ""}${cur ? "Present" : fmt(e)}`;
const loc = (d: ResumeData) => [d.profile.city, d.profile.state].filter(Boolean).join(", ");
const cnt = (d: ResumeData) => [d.profile.email, d.profile.phone, loc(d), d.profile.linkedIn, d.profile.portfolio].filter(Boolean);
const lvl: Record<string, number> = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };

type SHComp   = (p: { title: string }) => JSX.Element;
type SkipSec  = "skills" | "languages" | "education";

/** Circular photo or initials circle */
function PI({ url, name, sz, ac }: { url?: string; name: string; sz: number; ac: string }) {
  const i = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "?";
  if (url) return <img src={url} alt={name} className="rounded-full object-cover shrink-0" style={{ width: sz, height: sz }} />;
  return <div className="rounded-full flex items-center justify-center shrink-0 font-bold" style={{ width: sz, height: sz, background: `${ac}20`, color: ac, fontSize: sz * 0.3 }}>{i}</div>;
}

/** Square photo or initials box */
function SQI({ url, name, sz, ac }: { url?: string; name: string; sz: number; ac: string }) {
  const i = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "?";
  if (url) return <img src={url} alt={name} className="object-cover shrink-0" style={{ width: sz, height: sz }} />;
  return <div className="flex items-center justify-center shrink-0 font-bold" style={{ width: sz, height: sz, background: `${ac}20`, color: ac, fontSize: sz * 0.3 }}>{i}</div>;
}

// ── Icon contact rows (for sidebars) ─────────────────────────────────────────
function ContactRows({ data, ac, textCol = "#64748B" }: { data: ResumeData; ac: string; textCol?: string }) {
  const s = { color: textCol, fontSize: "9px" };
  return (
    <div className="space-y-1">
      {data.profile.email    && <div className="flex items-start gap-1.5"><Mail    className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: ac }} /><span style={{ ...s, wordBreak: "break-all" }}>{data.profile.email}</span></div>}
      {data.profile.phone    && <div className="flex items-start gap-1.5"><Phone   className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: ac }} /><span style={s}>{data.profile.phone}</span></div>}
      {loc(data)             && <div className="flex items-start gap-1.5"><MapPin  className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: ac }} /><span style={s}>{loc(data)}</span></div>}
      {data.profile.linkedIn && <div className="flex items-start gap-1.5"><Linkedin className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: ac }} /><span style={{ ...s, wordBreak: "break-all" }}>{data.profile.linkedIn}</span></div>}
      {data.profile.portfolio && <div className="flex items-start gap-1.5"><Globe   className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: ac }} /><span style={{ ...s, wordBreak: "break-all" }}>{data.profile.portfolio}</span></div>}
    </div>
  );
}

// ── Body — shared section content used by all templates ──────────────────────
function Body({
  data, isCV, SH, accent,
  body = "#374151", muted = "#6B7280", bullet = "•",
  skillStyle = "pill", skip = [] as SkipSec[],
}: {
  data: ResumeData; isCV: boolean; SH: SHComp; accent: string;
  body?: string; muted?: string; bullet?: string;
  skillStyle?: "pill" | "inline" | "dot" | "bar"; skip?: SkipSec[];
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
                <div className="mt-1 space-y-0.5">{e.bullets.filter(b => b.trim()).map((b, i) => <p key={i} className="text-xs pl-3" style={{ color: body }}>{bullet} {b}</p>)}</div>
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
          {skillStyle === "pill" && <div className="flex flex-wrap gap-1.5">{data.skills.map(s => <span key={s.id} className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${accent}15`, color: accent }}>{s.name}</span>)}</div>}
          {skillStyle === "inline" && <p className="text-xs" style={{ color: body }}>{data.skills.map(s => s.name).join(" · ")}</p>}
          {skillStyle === "dot" && <div className="flex flex-wrap gap-x-3 gap-y-0.5">{data.skills.map(s => <span key={s.id} className="text-xs flex items-center gap-1" style={{ color: body }}><span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ background: accent }} />{s.name}</span>)}</div>}
          {skillStyle === "bar" && <div className="space-y-1.5">{data.skills.map(s => <div key={s.id}><div className="flex justify-between mb-0.5"><span className="text-xs" style={{ color: body }}>{s.name}</span><span className="text-xs" style={{ color: muted }}>{s.level}</span></div><div className="h-1.5 rounded-full" style={{ background: `${accent}15` }}><div className="h-1.5 rounded-full" style={{ width: `${lvl[s.level] ?? 50}%`, background: accent }} /></div></div>)}</div>}
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
                  {(p.startDate || p.endDate) && <span className="text-xs shrink-0" style={{ color: muted }}>{fmt(p.startDate)}{p.endDate ? ` – ${fmt(p.endDate)}` : ""}</span>}
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
            {data.languages.map(l => <span key={l.id} className="text-xs" style={{ color: body }}>{l.name} <span style={{ color: muted }}>({l.proficiency})</span></span>)}
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
                {r.title       && <p className="text-xs" style={{ color: muted }}>{r.title}</p>}
                {r.institution && <p className="text-xs" style={{ color: muted }}>{r.institution}</p>}
                {r.email       && <p className="text-xs" style={{ color: muted }}>{r.email}</p>}
                {r.relationship && <p className="text-xs italic" style={{ color: muted }}>{r.relationship}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESUME TEMPLATES (30)
// ═══════════════════════════════════════════════════════════════════════════════

// ── 1. CLASSIC CLEAN — Left-border name, border-bottom section headers ─────────
function ClassicClean({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-0.5 border-b" style={{ color: a, borderColor: `${a}40` }}>{title}</h2>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5 pb-3" style={{ borderLeft: `3px solid ${a}`, paddingLeft: "10px" }}>
        <h1 className="font-bold leading-tight" style={{ color: a, fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="mt-0.5 text-slate-500" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-400 mt-1.5" style={{ fontSize: "9px" }}>{cnt(data).join("  |  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1f2937" muted="#6b7280" bullet="•" skillStyle="inline" />
    </div>
  );
}

// ── 2. TIMELINE LEFT — Vertical line with circle markers on left ───────────────
function TimelineLeft({ data }: { data: ResumeData }) {
  const a = "#334155"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2.5 h-2.5 rounded-full border-2 shrink-0" style={{ borderColor: a, background: "#fff" }} />
      <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: a }}>{title}</h2>
    </div>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5">
        <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="font-medium mt-0.5" style={{ color: a, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-400 mt-1.5" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
        <div className="h-0.5 mt-3" style={{ background: `${a}20` }} />
      </div>
      <div style={{ borderLeft: `2px solid ${a}20`, paddingLeft: "12px" }}>
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#334155" muted="#94a3b8" bullet="–" skillStyle="dot" />
      </div>
    </div>
  );
}

// ── 3. NUMBERED SECTIONS — Bold 01/02/03 counters before each section ──────────
function NumberedSections({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  let n = 0;
  const SH: SHComp = ({ title }) => {
    n++;
    return (
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-black shrink-0" style={{ color: `${a}30`, fontSize: "16px", lineHeight: 1 }}>{String(n).padStart(2, "0")}</span>
        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: a }}>{title}</h2>
        <div className="flex-1 h-px self-center" style={{ background: `${a}15` }} />
      </div>
    );
  };
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5">
        <h1 className="font-black leading-none" style={{ color: "#111827", fontSize: "26px", letterSpacing: "-0.5px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="mt-1 font-medium" style={{ color: a, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-400 mt-2" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="→" skillStyle="pill" />
    </div>
  );
}

// ── 4. MINIMAL SPACIOUS — Hairline dividers, maximum whitespace ─────────────────
function MinimalSpacious({ data }: { data: ResumeData }) {
  const a = "#6b7280"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-3 mb-3">
      <span className="uppercase tracking-widest font-medium shrink-0" style={{ color: "#9ca3af", fontSize: "8px" }}>{title}</span>
      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
    </div>
  );
  return (
    <div className="bg-white px-10 py-8 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-8">
        <h1 className="font-light tracking-tight" style={{ color: "#1f2937", fontSize: "28px", letterSpacing: "-0.4px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="font-light text-slate-400 mt-0.5" style={{ fontSize: "12px" }}>{data.profile.professionalTitle}</p>}
        <div className="h-px my-4" style={{ background: "#f3f4f6" }} />
        {cnt(data).length > 0 && <p className="text-slate-300 tracking-wide" style={{ fontSize: "9px" }}>{cnt(data).join("   ·   ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="–" skillStyle="inline" />
    </div>
  );
}

// ── 5. MONO TYPE — Monospace typewriter with === dividers ──────────────────────
function MonoType({ data }: { data: ResumeData }) {
  const a = "#1f2937"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="mb-2">
      <p style={{ color: "#9ca3af", fontSize: "9px", fontFamily: "monospace" }}>{"=".repeat(40)}</p>
      <h2 className="font-bold uppercase" style={{ color: a, fontFamily: "monospace", fontSize: "10px" }}>{title}</h2>
    </div>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "monospace", fontSize: "10px" }}>
      <div className="mb-5">
        <p style={{ color: "#9ca3af", fontFamily: "monospace", fontSize: "9px" }}>{"#".repeat(50)}</p>
        <h1 className="font-bold mt-1" style={{ color: a, fontFamily: "monospace", fontSize: "18px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p style={{ color: "#6b7280", fontFamily: "monospace", fontSize: "10px" }}>// {data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="mt-1" style={{ color: "#9ca3af", fontFamily: "monospace", fontSize: "9px" }}>{cnt(data).join(" | ")}</p>}
        <p className="mt-2" style={{ color: "#e5e7eb", fontFamily: "monospace", fontSize: "9px" }}>{"─".repeat(60)}</p>
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet=">" skillStyle="inline" />
    </div>
  );
}

// ── 6. COMPACT DENSE — Maximum information density, tight spacing ──────────────
function CompactDense({ data }: { data: ResumeData }) {
  const a = "#1f2937"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="font-bold uppercase text-xs mb-1" style={{ color: a, borderBottom: `1.5px solid ${a}`, paddingBottom: "1px", fontSize: "8px", letterSpacing: "0.08em" }}>{title}</h2>
  );
  return (
    <div className="bg-white p-4 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "9px" }}>
      <div className="flex justify-between items-start mb-3 pb-2" style={{ borderBottom: `1px solid #e5e7eb` }}>
        <div>
          <h1 className="font-bold" style={{ color: a, fontSize: "16px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p style={{ color: "#6b7280", fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
        </div>
        {cnt(data).length > 0 && (
          <div className="text-right space-y-0.5">{cnt(data).map((c, i) => <p key={i} style={{ color: "#9ca3af", fontSize: "8px" }}>{c}</p>)}</div>
        )}
      </div>
      <div style={{ lineHeight: 1.3 }}>
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="inline" />
      </div>
    </div>
  );
}

// ── 7. HEADER BAND DARK — Full-width dark header band with white text ──────────
function HeaderBandDark({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="mb-2 flex items-center gap-2">
      <div className="w-1 h-3 shrink-0 rounded-sm" style={{ background: a }} />
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: a }}>{title}</h2>
    </div>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-6 py-5" style={{ background: a }}>
        <h1 className="font-bold text-white" style={{ fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-white/70 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-white/50 mt-2" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <div className="p-6">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="pill" />
      </div>
    </div>
  );
}

// ── 8. HEADER BAND LIGHT — Soft gray header band ──────────────────────────────
function HeaderBandLight({ data }: { data: ResumeData }) {
  const a = "#475569"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ color: a, borderBottom: `1px solid ${a}20` }}>{title}</h2>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-6 py-5" style={{ background: "#f1f5f9" }}>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
            {data.profile.professionalTitle && <p className="mt-0.5" style={{ color: a, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
          </div>
          {cnt(data).length > 0 && (
            <div className="text-right space-y-0.5">{cnt(data).map((c, i) => <p key={i} style={{ color: "#94a3b8", fontSize: "9px" }}>{c}</p>)}</div>
          )}
        </div>
      </div>
      <div className="h-0.5" style={{ background: a }} />
      <div className="p-6">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#334155" muted="#94a3b8" bullet="▸" skillStyle="dot" />
      </div>
    </div>
  );
}

// ── 9. HEADER SPLIT — Dark left name panel, light right contact panel ──────────
function HeaderSplit({ data }: { data: ResumeData }) {
  const a = "#1e3a5f"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
      <h2 className="text-xs font-bold uppercase tracking-wider shrink-0" style={{ color: a }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `${a}20` }} />
    </div>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex" style={{ minHeight: "80px" }}>
        <div className="flex-1 px-6 py-5" style={{ background: a }}>
          <h1 className="font-bold text-white" style={{ fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-white/65 mt-0.5" style={{ fontSize: "10px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <div className="w-[38%] px-5 py-5 flex flex-col justify-center" style={{ background: "#f8fafc" }}>
          {cnt(data).map((c, i) => <p key={i} className="text-slate-400" style={{ fontSize: "9px", marginBottom: "2px" }}>{c}</p>)}
        </div>
      </div>
      <div className="p-6">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#334155" muted="#94a3b8" bullet="•" skillStyle="pill" />
      </div>
    </div>
  );
}

// ── 10. BORDER TOP ACCENT — Thick colored top stripe, clean below ──────────────
function BorderTopAccent({ data }: { data: ResumeData }) {
  const a = "#334155"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a }} />
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: a }}>{title}</h2>
    </div>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", borderTop: `5px solid ${a}` }}>
      <div className="px-6 pt-5 pb-4">
        <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "24px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="mt-0.5" style={{ color: "#64748b", fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="mt-2 text-slate-400" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <div className="px-6 pb-6">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#94a3b8" bullet="–" skillStyle="inline" />
      </div>
    </div>
  );
}

// ── 11. EXECUTIVE CENTERED — Centered name flanked by decorative rules ─────────
function ExecutiveCentered({ data }: { data: ResumeData }) {
  const a = "#1f2937"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-1 h-px" style={{ background: `${a}20` }} />
      <h2 className="text-xs font-bold uppercase tracking-widest px-2 shrink-0" style={{ color: a }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `${a}20` }} />
    </div>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="text-center mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
          <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
        </div>
        <h1 className="font-bold tracking-wide" style={{ color: a, fontSize: "22px", letterSpacing: "0.05em" }}>{data.profile.fullName?.toUpperCase() || "YOUR NAME"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5 uppercase tracking-widest" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 h-0.5" style={{ background: a }} />
          <div className="flex-1 h-0.5" style={{ background: a }} />
        </div>
        {cnt(data).length > 0 && <p className="text-slate-400 mt-2" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="▪" skillStyle="inline" />
    </div>
  );
}

// ── 12. SIDEBAR DARK LEFT — Charcoal left sidebar, white main area ─────────────
function SidebarDarkLeft({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1px solid ${a}20` }}>{title}</h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-white/60 uppercase tracking-wider font-bold mb-1.5" style={{ fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[30%] p-4 flex flex-col gap-4 shrink-0" style={{ background: a }}>
        <div>
          <h1 className="font-bold text-white leading-tight" style={{ fontSize: "14px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-white/60 mt-0.5" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <div>
          <SSH title="Contact" />
          <ContactRows data={data} ac="#94a3b8" textCol="rgba(255,255,255,0.65)" />
        </div>
        {data.skills.length > 0 && <div><SSH title="Skills" /><div className="space-y-0.5">{data.skills.map(s => <p key={s.id} className="text-white/70" style={{ fontSize: "9px" }}>· {s.name}</p>)}</div></div>}
        {data.languages.length > 0 && <div><SSH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-white/65" style={{ fontSize: "9px" }}>{l.name} <span className="text-white/40">({l.proficiency})</span></p>)}</div>}
      </div>
      <div className="flex-1 p-5">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#94a3b8" bullet="•" skillStyle="pill" skip={["skills", "languages"]} />
      </div>
    </div>
  );
}

// ── 13. SIDEBAR LIGHT LEFT — Gray left sidebar ─────────────────────────────────
function SidebarLightLeft({ data }: { data: ResumeData }) {
  const a = "#475569"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: a, borderLeft: `3px solid ${a}`, paddingLeft: "6px" }}>{title}</h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="uppercase tracking-wider font-bold mb-1.5 pb-0.5" style={{ color: a, fontSize: "8px", borderBottom: `1px solid ${a}20` }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[30%] p-4 flex flex-col gap-4 shrink-0" style={{ background: "#f8fafc", borderRight: `1px solid #e2e8f0` }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: "#0f172a", fontSize: "14px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <div><SSH title="Contact" /><ContactRows data={data} ac={a} textCol="#64748b" /></div>
        {data.skills.length > 0 && <div><SSH title="Skills" /><div className="flex flex-wrap gap-1">{data.skills.map(s => <span key={s.id} className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${a}15`, color: a, fontSize: "8px" }}>{s.name}</span>)}</div></div>}
        {data.languages.length > 0 && <div><SSH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-slate-500" style={{ fontSize: "9px" }}>{l.name} <span className="text-slate-400">({l.proficiency})</span></p>)}</div>}
        {data.education.length > 0 && <div><SSH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><p className="font-semibold text-slate-700" style={{ fontSize: "9px" }}>{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}</p><p className="text-slate-400" style={{ fontSize: "8px" }}>{e.school}</p></div>)}</div></div>}
      </div>
      <div className="flex-1 p-5">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#334155" muted="#94a3b8" bullet="▸" skillStyle="pill" skip={["skills", "languages", "education"]} />
      </div>
    </div>
  );
}

// ── 14. SIDEBAR DARK RIGHT — Wide main left, dark right sidebar ─────────────────
function SidebarDarkRight({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: a, borderBottom: `2px solid ${a}` }}>{title}</h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-white/60 uppercase tracking-wider font-bold mb-1.5" style={{ fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex-1 p-5">
        <div className="mb-4 pb-3" style={{ borderBottom: `1px solid ${a}20` }}>
          <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="mt-0.5" style={{ color: a, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#94a3b8" bullet="•" skillStyle="pill" skip={["skills", "languages"]} />
      </div>
      <div className="w-[28%] p-4 flex flex-col gap-4 shrink-0" style={{ background: a }}>
        <div><SSH title="Contact" /><ContactRows data={data} ac="#94a3b8" textCol="rgba(255,255,255,0.65)" /></div>
        {data.skills.length > 0 && <div><SSH title="Skills" /><div className="space-y-1">{data.skills.map(s => <div key={s.id}><div className="flex justify-between mb-0.5"><span className="text-white/75" style={{ fontSize: "9px" }}>{s.name}</span></div><div className="h-1 rounded-full bg-white/10"><div className="h-1 rounded-full bg-white/50" style={{ width: `${lvl[s.level] ?? 50}%` }} /></div></div>)}</div></div>}
        {data.languages.length > 0 && <div><SSH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-white/65" style={{ fontSize: "9px" }}>{l.name}</p>)}</div>}
      </div>
    </div>
  );
}

// ── 15. SIDEBAR LIGHT RIGHT — Wide main left, warm light right sidebar ──────────
function SidebarLightRight({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2" style={{ color: a }}>
      <span>{title}</span><div className="flex-1 h-px" style={{ background: `${a}15` }} />
    </h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="uppercase tracking-wider font-bold mb-1.5" style={{ color: "#94a3b8", fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex-1 p-5">
        <div className="mb-4">
          <h1 className="font-bold" style={{ color: "#111827", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="pill" skip={["skills", "languages", "education"]} />
      </div>
      <div className="w-[28%] p-4 flex flex-col gap-4 shrink-0" style={{ background: "#fafaf9", borderLeft: `1px solid #e5e7eb` }}>
        <div><SSH title="Contact" /><ContactRows data={data} ac={a} textCol="#64748b" /></div>
        {data.education.length > 0 && <div><SSH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><p className="font-semibold" style={{ color: a, fontSize: "9px" }}>{e.degree}</p><p className="text-slate-400" style={{ fontSize: "8px" }}>{e.school}</p></div>)}</div></div>}
        {data.skills.length > 0 && <div><SSH title="Skills" /><div className="flex flex-wrap gap-1">{data.skills.map(s => <span key={s.id} className="px-1.5 py-0.5 rounded" style={{ background: `${a}10`, color: a, fontSize: "8px" }}>{s.name}</span>)}</div></div>}
        {data.languages.length > 0 && <div><SSH title="Languages" />{data.languages.map(l => <p key={l.id} style={{ color: "#64748b", fontSize: "9px" }}>{l.name}</p>)}</div>}
      </div>
    </div>
  );
}

// ── 16. COLUMN BREAK — Full-width header+summary, then two columns ─────────────
function ColumnBreak({ data }: { data: ResumeData }) {
  const a = "#334155"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1.5px solid ${a}` }}>{title}</h2>
  );
  const leftSections = data.experience.length > 0 || (data.research ?? []).length > 0;
  return (
    <div className="bg-white p-5 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-4 pb-3" style={{ borderBottom: `2px solid ${a}` }}>
        <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        <div className="flex justify-between items-end mt-0.5">
          {data.profile.professionalTitle && <p style={{ color: a, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
          {cnt(data).length > 0 && <p className="text-slate-400" style={{ fontSize: "9px" }}>{cnt(data).slice(0, 3).join("  ·  ")}</p>}
        </div>
      </div>
      {data.summary.text && <p className="text-xs leading-relaxed mb-4 text-slate-600">{data.summary.text}</p>}
      <div className="flex gap-5">
        <div className="flex-1 min-w-0">
          {!isCV && data.experience.length > 0 && (
            <div className="mb-4">
              <SH title="Experience" />
              <div className="space-y-2.5">{data.experience.map(e => <div key={e.id}><div className="flex justify-between items-baseline gap-1"><span className="font-semibold text-xs text-slate-700">{e.jobTitle}</span><span className="text-xs text-slate-400 shrink-0">{dr(e.startDate, e.endDate, e.isCurrent)}</span></div><p className="text-xs text-slate-500">{e.company}</p>{e.bullets.filter(b => b.trim()).map((b, i) => <p key={i} className="text-xs pl-3 text-slate-600">• {b}</p>)}</div>)}</div>
            </div>
          )}
          {isCV && (data.research ?? []).length > 0 && (
            <div className="mb-4">
              <SH title="Research" />
              <div className="space-y-2">{(data.research ?? []).map(r => <div key={r.id}><span className="font-semibold text-xs text-slate-700">{r.title}</span><p className="text-xs text-slate-400">{r.institution}</p></div>)}</div>
            </div>
          )}
          {(data.projects ?? []).length > 0 && !isCV && (
            <div><SH title="Projects" /><div className="space-y-2">{data.projects.map(p => <div key={p.id}><span className="font-semibold text-xs text-slate-700">{p.name}</span>{p.description && <p className="text-xs text-slate-500">{p.description}</p>}</div>)}</div></div>
          )}
        </div>
        <div className="w-[38%] shrink-0">
          {data.education.length > 0 && <div className="mb-4"><SH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><p className="font-semibold text-xs text-slate-700">{e.degree}</p><p className="text-xs text-slate-400">{e.school}</p><p className="text-xs text-slate-400">{dr(e.startDate, e.endDate, e.isCurrent)}</p></div>)}</div></div>}
          {data.skills.length > 0 && <div className="mb-4"><SH title="Skills" /><div className="flex flex-wrap gap-1">{data.skills.map(s => <span key={s.id} className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${a}10`, color: a, fontSize: "8px" }}>{s.name}</span>)}</div></div>}
          {data.awards.length > 0 && <div><SH title="Awards" />{data.awards.map(a2 => <p key={a2.id} className="text-xs text-slate-600">{a2.name}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── 17. PHOTO ROUND TOP — Circular headshot in header ──────────────────────────
function PhotoRoundTop({ data }: { data: ResumeData }) {
  const a = "#1e3a5f"; const isCV = data.documentType === "cv";
  const photoUrl = (data.profile as { photoUrl?: string }).photoUrl;
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1.5px solid ${a}40` }}>{title}</h2>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-6 py-5 flex items-center gap-4" style={{ background: "#f8fafc" }}>
        <PI url={photoUrl} name={data.profile.fullName} sz={60} ac={a} />
        <div className="flex-1">
          <h1 className="font-bold" style={{ color: a, fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "10px" }}>{data.profile.professionalTitle}</p>}
          {cnt(data).length > 0 && <p className="text-slate-400 mt-1" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
        </div>
      </div>
      <div className="h-0.5" style={{ background: a }} />
      <div className="p-6">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#334155" muted="#94a3b8" bullet="•" skillStyle="pill" />
      </div>
    </div>
  );
}

// ── 18. PHOTO BANNER — Dark banner header with embedded circular photo ──────────
function PhotoBanner({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const photoUrl = (data.profile as { photoUrl?: string }).photoUrl;
  const SH: SHComp = ({ title }) => (
    <div className="mb-2 flex items-center gap-2">
      <div className="w-1 h-3 shrink-0" style={{ background: `${a}60` }} />
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: a }}>{title}</h2>
    </div>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-6 py-5 flex items-center gap-5" style={{ background: a }}>
        <PI url={photoUrl} name={data.profile.fullName} sz={64} ac="#94a3b8" />
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-white/60 mt-0.5" style={{ fontSize: "10px" }}>{data.profile.professionalTitle}</p>}
          {cnt(data).length > 0 && <p className="text-white/40 mt-1.5" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
        </div>
      </div>
      <div className="p-6">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="dot" />
      </div>
    </div>
  );
}

// ── 19. PHOTO SIDEBAR — Photo at top of dark sidebar ──────────────────────────
function PhotoSidebar({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const photoUrl = (data.profile as { photoUrl?: string }).photoUrl;
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1px solid ${a}25` }}>{title}</h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-white/50 uppercase tracking-wider font-bold mb-1.5" style={{ fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[30%] flex flex-col gap-4 shrink-0" style={{ background: a }}>
        <div className="flex flex-col items-center pt-5 pb-3 px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <PI url={photoUrl} name={data.profile.fullName} sz={56} ac="#94a3b8" />
          <h1 className="font-bold text-white text-center mt-2" style={{ fontSize: "12px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-white/55 text-center mt-0.5" style={{ fontSize: "8px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <div className="px-4 space-y-4">
          <div><SSH title="Contact" /><ContactRows data={data} ac="#94a3b8" textCol="rgba(255,255,255,0.6)" /></div>
          {data.skills.length > 0 && <div><SSH title="Skills" /><div className="space-y-0.5">{data.skills.map(s => <p key={s.id} className="text-white/65" style={{ fontSize: "9px" }}>· {s.name}</p>)}</div></div>}
          {data.languages.length > 0 && <div><SSH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-white/60" style={{ fontSize: "9px" }}>{l.name}</p>)}</div>}
        </div>
      </div>
      <div className="flex-1 p-5">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="pill" skip={["skills", "languages"]} />
      </div>
    </div>
  );
}

// ── 20. PHOTO CARD — Floating card with photo + name, classic single column ─────
function PhotoCard({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const photoUrl = (data.profile as { photoUrl?: string }).photoUrl;
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pl-2" style={{ color: a, borderLeft: `2px solid ${a}` }}>{title}</h2>
  );
  return (
    <div className="bg-white p-5 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex gap-4 mb-5 p-3 rounded-lg" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
        <PI url={photoUrl} name={data.profile.fullName} sz={52} ac={a} />
        <div className="flex-1">
          <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "18px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "10px" }}>{data.profile.professionalTitle}</p>}
          {cnt(data).length > 0 && <p className="text-slate-400 mt-1" style={{ fontSize: "9px" }}>{cnt(data).join("  |  ")}</p>}
        </div>
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="pill" />
    </div>
  );
}

// ── 21. PHOTO ELEGANT — Square photo left, right-aligned name block ─────────────
function PhotoElegant({ data }: { data: ResumeData }) {
  const a = "#1f2937"; const isCV = data.documentType === "cv";
  const photoUrl = (data.profile as { photoUrl?: string }).photoUrl;
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-3 mb-2">
      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: a }}>{title}</h2>
      <div className="w-4 h-px" style={{ background: "#e5e7eb" }} />
    </div>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex gap-4 items-start mb-5 pb-4" style={{ borderBottom: `1px solid #e5e7eb` }}>
        <SQI url={photoUrl} name={data.profile.fullName} sz={60} ac={a} />
        <div className="flex-1 text-right">
          <h1 className="font-bold" style={{ color: a, fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-400 mt-0.5 italic" style={{ fontSize: "10px" }}>{data.profile.professionalTitle}</p>}
          {cnt(data).length > 0 && <div className="mt-1 space-y-0.5">{cnt(data).map((c, i) => <p key={i} className="text-slate-400" style={{ fontSize: "9px" }}>{c}</p>)}</div>}
        </div>
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="inline" />
    </div>
  );
}

// ── 22. TWO EQUAL COLUMNS — 50/50 after full-width header ──────────────────────
function TwoEqualCols({ data }: { data: ResumeData }) {
  const a = "#334155"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: a, borderBottom: `1.5px solid ${a}` }}>{title}</h2>
  );
  return (
    <div className="bg-white p-5 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-4 pb-3" style={{ borderBottom: `2px solid ${a}` }}>
        <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        <div className="flex justify-between items-end mt-0.5">
          {data.profile.professionalTitle && <p style={{ color: a, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
          {cnt(data).length > 0 && <p className="text-slate-400" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex-1 space-y-4">
          {!isCV && data.experience.length > 0 && (
            <div><SH title="Experience" /><div className="space-y-2.5">{data.experience.map(e => <div key={e.id}><div className="flex justify-between"><span className="font-semibold text-xs text-slate-700">{e.jobTitle}</span><span className="text-xs text-slate-400 shrink-0">{dr(e.startDate, e.endDate, e.isCurrent)}</span></div><p className="text-xs text-slate-500">{e.company}</p>{e.bullets.slice(0, 3).filter(b => b.trim()).map((b, i) => <p key={i} className="text-xs pl-3 text-slate-600">• {b}</p>)}</div>)}</div></div>
          )}
          {isCV && (data.research ?? []).length > 0 && (
            <div><SH title="Research" /><div className="space-y-2">{(data.research ?? []).map(r => <div key={r.id}><span className="font-semibold text-xs text-slate-700">{r.title}</span><p className="text-xs text-slate-400">{r.institution}</p></div>)}</div></div>
          )}
          {data.summary.text && <div><SH title="Summary" /><p className="text-xs leading-relaxed text-slate-600">{data.summary.text}</p></div>}
        </div>
        <div className="w-[40%] shrink-0 space-y-4">
          {data.education.length > 0 && <div><SH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><p className="font-semibold text-xs text-slate-700">{e.degree}</p><p className="text-xs text-slate-400">{e.school}</p><p className="text-xs text-slate-400">{dr(e.startDate, e.endDate, e.isCurrent)}</p></div>)}</div></div>}
          {data.skills.length > 0 && <div><SH title="Skills" /><div className="flex flex-wrap gap-1">{data.skills.map(s => <span key={s.id} className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${a}12`, color: a, fontSize: "8px" }}>{s.name}</span>)}</div></div>}
          {data.awards.length > 0 && <div><SH title="Awards" />{data.awards.map(a2 => <p key={a2.id} className="text-xs text-slate-600 mb-1">{a2.name}</p>)}</div>}
          {data.certifications.length > 0 && !isCV && <div><SH title="Certs" />{data.certifications.map(c => <p key={c.id} className="text-xs text-slate-600 mb-0.5">{c.name}</p>)}</div>}
          {data.languages.length > 0 && <div><SH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-xs text-slate-600">{l.name} <span className="text-slate-400">({l.proficiency})</span></p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── 23. THREE PANEL — Three columns: contact | experience | skills ──────────────
function ThreePanel({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1px solid ${a}30` }}>{title}</h2>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-4 py-4 text-center" style={{ background: a }}>
        <h1 className="font-bold text-white" style={{ fontSize: "18px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-white/60 mt-0.5" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
      </div>
      <div className="flex" style={{ minHeight: "calc(100% - 56px)" }}>
        <div className="w-[22%] p-3 flex flex-col gap-3 shrink-0" style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0" }}>
          <SH title="Contact" />
          <ContactRows data={data} ac={a} textCol="#64748b" />
          {data.languages.length > 0 && <div><SH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-xs text-slate-500 mb-0.5">{l.name}</p>)}</div>}
        </div>
        <div className="flex-1 p-3">
          {data.summary.text && <p className="text-xs leading-relaxed text-slate-600 mb-3 pb-3" style={{ borderBottom: "1px solid #e5e7eb" }}>{data.summary.text}</p>}
          {!isCV && data.experience.length > 0 && (
            <div>
              <SH title="Experience" />
              <div className="space-y-2.5">{data.experience.map(e => <div key={e.id}><div className="flex justify-between"><span className="font-semibold text-xs text-slate-700">{e.jobTitle}</span><span className="text-xs text-slate-400 shrink-0">{dr(e.startDate, e.endDate, e.isCurrent)}</span></div><p className="text-xs text-slate-500">{e.company}</p>{e.bullets.filter(b => b.trim()).map((b, i) => <p key={i} className="text-xs pl-3 text-slate-600">• {b}</p>)}</div>)}</div>
            </div>
          )}
          {data.education.length > 0 && <div className="mt-3"><SH title="Education" /><div className="space-y-1.5">{data.education.map(e => <div key={e.id}><span className="font-semibold text-xs text-slate-700">{e.degree}</span><p className="text-xs text-slate-400">{e.school} · {dr(e.startDate, e.endDate, e.isCurrent)}</p></div>)}</div></div>}
        </div>
        <div className="w-[22%] p-3 shrink-0" style={{ background: "#f8fafc", borderLeft: "1px solid #e2e8f0" }}>
          {data.skills.length > 0 && <div className="mb-3"><SH title="Skills" /><div className="space-y-0.5">{data.skills.map(s => <p key={s.id} className="text-xs text-slate-600">· {s.name}</p>)}</div></div>}
          {data.awards.length > 0 && <div className="mb-3"><SH title="Awards" />{data.awards.map(a2 => <p key={a2.id} className="text-xs text-slate-500 mb-0.5">{a2.name}</p>)}</div>}
          {data.certifications.length > 0 && !isCV && <div><SH title="Certs" />{data.certifications.map(c => <p key={c.id} className="text-xs text-slate-500 mb-0.5">{c.name}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── 24. CARD SECTIONS — Each section wrapped in its own subtle card ─────────────
function CardSections({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: a, fontSize: "9px" }}>{title}</h2>
  );
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-lg p-3 mb-3" style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}>{children}</div>
  );
  return (
    <div className="bg-white p-4 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-4 rounded-xl p-4 text-center" style={{ background: a }}>
        <h1 className="font-bold text-white" style={{ fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-white/65 mt-0.5" style={{ fontSize: "10px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-white/40 mt-1.5" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <Card><SH title="Summary" /><p className="text-xs text-slate-600">{data.summary.text || "Add your professional summary..."}</p></Card>
      {!isCV && data.experience.length > 0 && <Card><SH title="Experience" /><div className="space-y-2">{data.experience.map(e => <div key={e.id}><div className="flex justify-between"><span className="font-semibold text-xs text-slate-700">{e.jobTitle}</span><span className="text-xs text-slate-400">{dr(e.startDate, e.endDate, e.isCurrent)}</span></div><p className="text-xs text-slate-500">{e.company}</p></div>)}</div></Card>}
      {data.education.length > 0 && <Card><SH title="Education" /><div className="space-y-1.5">{data.education.map(e => <div key={e.id}><span className="font-semibold text-xs text-slate-700">{e.degree}</span><p className="text-xs text-slate-400">{e.school}</p></div>)}</div></Card>}
      {data.skills.length > 0 && <Card><SH title="Skills" /><div className="flex flex-wrap gap-1">{data.skills.map(s => <span key={s.id} className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${a}12`, color: a }}>{s.name}</span>)}</div></Card>}
      {data.awards.length > 0 && <Card><SH title="Awards" />{data.awards.map(a2 => <p key={a2.id} className="text-xs text-slate-600 mb-0.5">{a2.name}</p>)}</Card>}
    </div>
  );
}

// ── 25. LETTERHEAD — Right-aligned address block at top ────────────────────────
function LetterHead({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-0.5" style={{ color: a, borderBottom: `2px solid ${a}` }}>{title}</h2>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex justify-between items-start mb-5 pb-4" style={{ borderBottom: `3px double ${a}` }}>
        <div>
          <h1 className="font-bold" style={{ color: a, fontSize: "24px", letterSpacing: "0.02em" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="font-medium mt-1 uppercase tracking-widest" style={{ color: `${a}80`, fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
        </div>
        {cnt(data).length > 0 && (
          <div className="text-right space-y-0.5 mt-1">{cnt(data).map((c, i) => <p key={i} className="text-slate-400" style={{ fontSize: "9px" }}>{c}</p>)}</div>
        )}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1f2937" muted="#6b7280" bullet="•" skillStyle="inline" />
    </div>
  );
}

// ── 26. SPLIT CONTACT — Name+title left, contact right-aligned ─────────────────
function SplitContact({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
      <h2 className="text-xs font-bold uppercase tracking-wider shrink-0" style={{ color: a }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: "#d1d5db" }} />
    </div>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: `1px solid #e5e7eb` }}>
        <div>
          <h1 className="font-bold" style={{ color: "#111827", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        </div>
        {cnt(data).length > 0 && (
          <div className="text-right space-y-0.5">{cnt(data).map((c, i) => <p key={i} className="text-slate-400" style={{ fontSize: "9px" }}>{c}</p>)}</div>
        )}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="pill" />
    </div>
  );
}

// ── 27. SKILL BARS — Two-column with horizontal skill progress bars ─────────────
function SkillBars({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1px solid ${a}20` }}>{title}</h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="uppercase tracking-wider font-bold mb-1.5" style={{ color: "#9ca3af", fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[32%] p-4 flex flex-col gap-4 shrink-0" style={{ background: "#f9fafb", borderRight: "1px solid #e5e7eb" }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: "#0f172a", fontSize: "14px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-400 mt-0.5" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <div><SSH title="Contact" /><ContactRows data={data} ac={a} textCol="#64748b" /></div>
        {data.skills.length > 0 && (
          <div>
            <SSH title="Skills" />
            <div className="space-y-2">
              {data.skills.map(s => (
                <div key={s.id}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-slate-600" style={{ fontSize: "9px" }}>{s.name}</span>
                    <span className="text-slate-300" style={{ fontSize: "8px" }}>{s.level}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: `${a}12` }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${lvl[s.level] ?? 50}%`, background: a }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && <div><SSH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><p className="font-semibold text-slate-700" style={{ fontSize: "9px" }}>{e.degree}</p><p className="text-slate-400" style={{ fontSize: "8px" }}>{e.school}</p></div>)}</div></div>}
        {data.languages.length > 0 && <div><SSH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-slate-500" style={{ fontSize: "9px" }}>{l.name}</p>)}</div>}
      </div>
      <div className="flex-1 p-4">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="pill" skip={["skills", "languages", "education"]} />
      </div>
    </div>
  );
}

// ── 28. BADGE SKILLS — Pill badges displayed prominently ──────────────────────
function BadgeSkills({ data }: { data: ResumeData }) {
  const a = "#334155"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1px solid ${a}25` }}>{title}</h2>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-4">
        <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-400 mt-1" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      {data.skills.length > 0 && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: "#f8fafc" }}>
          <p className="uppercase tracking-widest font-bold mb-2" style={{ color: "#9ca3af", fontSize: "8px" }}>Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map(s => <span key={s.id} className="px-2.5 py-1 rounded-full font-medium" style={{ background: `${a}10`, color: a, fontSize: "9px" }}>{s.name}</span>)}
          </div>
        </div>
      )}
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="•" skillStyle="pill" skip={["skills"]} />
    </div>
  );
}

// ── 29. INFOGRAPHIC — Icon bullets, two-column with visual elements ─────────────
function Infographic({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-1.5 mb-2">
      <div className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{ background: a }}><span className="text-white" style={{ fontSize: "7px" }}>▸</span></div>
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: a }}>{title}</h2>
    </div>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: `${a}80`, fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-5 py-4 flex justify-between items-center" style={{ background: a }}>
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-white/60 mt-0.5" style={{ fontSize: "10px" }}>{data.profile.professionalTitle}</p>}
        </div>
        {cnt(data).length > 0 && <div className="text-right">{cnt(data).slice(0, 3).map((c, i) => <p key={i} className="text-white/50" style={{ fontSize: "9px" }}>{c}</p>)}</div>}
      </div>
      <div className="flex">
        <div className="flex-1 p-4">
          {data.summary.text && <p className="text-xs leading-relaxed text-slate-600 mb-4">{data.summary.text}</p>}
          {!isCV && data.experience.length > 0 && <div><SH title="Experience" /><div className="space-y-2.5 mb-4">{data.experience.map(e => <div key={e.id}><div className="flex justify-between"><span className="font-semibold text-xs text-slate-700">{e.jobTitle}</span><span className="text-xs text-slate-400">{dr(e.startDate, e.endDate, e.isCurrent)}</span></div><p className="text-xs text-slate-500">{e.company}</p>{e.bullets.filter(b => b.trim()).map((b, i) => <p key={i} className="text-xs pl-3 text-slate-600">✓ {b}</p>)}</div>)}</div></div>}
          {data.education.length > 0 && <div><SH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><span className="font-semibold text-xs text-slate-700">{e.degree}</span><p className="text-xs text-slate-400">{e.school}</p></div>)}</div></div>}
        </div>
        <div className="w-[30%] p-4 shrink-0" style={{ background: "#f9fafb", borderLeft: `3px solid ${a}` }}>
          {data.skills.length > 0 && <div className="mb-3"><SSH title="Skills" /><div className="space-y-1.5">{data.skills.map(s => <div key={s.id}><div className="flex justify-between mb-0.5"><span className="text-xs text-slate-600">{s.name}</span></div><div className="h-1 rounded-full" style={{ background: "#e5e7eb" }}><div className="h-1 rounded-full" style={{ width: `${lvl[s.level] ?? 50}%`, background: a }} /></div></div>)}</div></div>}
          {data.awards.length > 0 && <div className="mb-3"><SSH title="Awards" />{data.awards.map(a2 => <p key={a2.id} className="text-xs text-slate-500 mb-1">★ {a2.name}</p>)}</div>}
          {data.languages.length > 0 && <div><SSH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-xs text-slate-500">{l.name}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── 30. RULED PAPER — Subtle bottom rule under each experience entry ────────────
function RuledPaper({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="mt-4 mb-2 flex items-center gap-3">
      <h2 className="text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: "#9ca3af", fontSize: "8px" }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
    </div>
  );
  return (
    <div className="bg-white px-7 py-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5">
        <h1 className="font-semibold" style={{ color: "#0f172a", fontSize: "24px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-400 mt-0.5 font-light" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-300 mt-2" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
        <div className="h-px mt-3" style={{ background: "#e5e7eb" }} />
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="–" skillStyle="inline" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CV TEMPLATES (20)
// ═══════════════════════════════════════════════════════════════════════════════

// ── 31. ACADEMIC FORMAL — Centered, double horizontal rules (CV) ───────────────
function AcademicFormal({ data }: { data: ResumeData }) {
  const a = "#1e3a5f"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="text-center mb-2">
      <div className="h-0.5 mb-1" style={{ background: a, opacity: 0.3 }} />
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: a }}>{title}</h2>
      <div className="h-px mt-1" style={{ background: a, opacity: 0.2 }} />
    </div>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="text-center mb-5">
        <h1 className="font-bold" style={{ color: a, fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-600 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        <p className="font-medium mt-0.5 uppercase tracking-widest" style={{ color: a, fontSize: "8px" }}>Curriculum Vitae</p>
        <div className="h-0.5 my-3 mx-auto w-16" style={{ background: a }} />
        {cnt(data).length > 0 && <p className="text-slate-500" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1f2937" muted="#6b7280" skillStyle="inline" />
    </div>
  );
}

// ── 32. PROFESSOR ELEGANT — Green, em-dash section decorations (CV) ────────────
function ProfessorElegant({ data }: { data: ResumeData }) {
  const a = "#166534"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-slate-300 text-xs">—</span>
      <h2 className="text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: a }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `${a}30` }} />
    </div>
  );
  return (
    <div className="bg-white px-8 py-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="text-center mb-6">
        <h1 className="font-semibold" style={{ color: "#0f172a", fontSize: "22px", letterSpacing: "-0.2px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5 italic" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        <p className="uppercase tracking-widest mt-0.5 font-medium" style={{ color: a, fontSize: "8px" }}>Curriculum Vitae</p>
        <div className="h-px my-3 mx-auto" style={{ background: `${a}40`, maxWidth: "80px" }} />
        {cnt(data).length > 0 && <p className="text-slate-500" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1f2937" muted="#6b7280" skillStyle="inline" />
    </div>
  );
}

// ── 33. CV NORDIC — Ultra-clean Nordic, large name, abundant whitespace ────────
function CvNordic({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="font-semibold mb-2" style={{ color: a, fontSize: "11px", borderBottom: `3px solid ${a}`, paddingBottom: "4px" }}>{title}</h2>
  );
  return (
    <div className="bg-white px-10 py-8 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-8">
        <h1 className="font-bold tracking-tight" style={{ color: "#0f172a", fontSize: "32px", letterSpacing: "-0.8px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-400 mt-1" style={{ fontSize: "13px", fontWeight: 300 }}>{data.profile.professionalTitle}</p>}
        <p className="uppercase tracking-widest mt-1 font-medium" style={{ color: a, fontSize: "8px" }}>Curriculum Vitae</p>
        <div className="flex gap-4 mt-3">{cnt(data).map((c, i) => <span key={i} className="text-slate-300" style={{ fontSize: "9px" }}>{c}</span>)}</div>
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" skillStyle="inline" />
    </div>
  );
}

// ── 34. CV HUMANITIES — Wide-margin scholarly format ──────────────────────────
function CvHumanities({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="font-bold mb-2 mt-4 pb-0.5" style={{ color: a, fontSize: "11px", borderBottom: `1px solid ${a}30`, letterSpacing: "0.05em" }}>{title}</h2>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Georgia, serif", fontSize: "10px" }}>
      <div className="text-center px-12 pt-8 pb-5" style={{ borderBottom: `2px solid ${a}` }}>
        <h1 className="font-bold" style={{ color: a, fontSize: "22px", fontFamily: "Georgia, serif" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="mt-1 italic text-slate-600" style={{ fontSize: "12px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-400 mt-2" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <div className="px-12 py-5">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1f2937" muted="#6b7280" skillStyle="inline" />
      </div>
    </div>
  );
}

// ── 35. CV MINIMAL ACADEMIC — Absolute minimum styling, purely typographic ─────
function CvMinimalAcademic({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="font-bold uppercase mb-1.5 mt-3" style={{ color: "#111827", fontSize: "9px", letterSpacing: "0.12em" }}>{title}</h2>
  );
  return (
    <div className="bg-white px-8 py-6 min-h-full" style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "11px" }}>
      <div className="mb-5 text-center">
        <h1 className="font-bold" style={{ color: "#000", fontSize: "18px", fontFamily: "Times New Roman, serif" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-600 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-500 mt-1" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
        <div className="h-px mt-3" style={{ background: "#000" }} />
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#111827" muted="#6b7280" skillStyle="inline" />
    </div>
  );
}

// ── 36. SCHOLAR MODERN — Two-col slate sidebar (CV) ───────────────────────────
function ScholarModern({ data }: { data: ResumeData }) {
  const a = "#475569"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: a }}>
      <span className="w-1.5 h-1.5 rounded-sm inline-block shrink-0" style={{ background: a }} />{title}
    </h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5" style={{ color: a, borderBottom: `1px solid ${a}30` }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[32%] p-4 flex flex-col gap-4 shrink-0" style={{ background: "#f8fafc" }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: "#0f172a", fontSize: "15px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
          <p className="font-medium mt-0.5 uppercase tracking-widest" style={{ color: a, fontSize: "8px" }}>Curriculum Vitae</p>
        </div>
        <div><SSH title="Contact" /><ContactRows data={data} ac={a} textCol="#64748b" /></div>
        {data.education.length > 0 && <div><SSH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><p className="font-semibold text-slate-700" style={{ fontSize: "9px" }}>{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}</p><p className="text-slate-400" style={{ fontSize: "8px" }}>{e.school}</p></div>)}</div></div>}
        {data.skills.length > 0 && <div><SSH title="Skills" /><div className="space-y-0.5">{data.skills.map(s => <p key={s.id} className="text-slate-600" style={{ fontSize: "9px" }}>▸ {s.name}</p>)}</div></div>}
        {data.languages.length > 0 && <div><SSH title="Languages" />{data.languages.map(l => <p key={l.id} className="text-slate-600" style={{ fontSize: "9px" }}>{l.name}</p>)}</div>}
      </div>
      <div className="flex-1 p-4 border-l" style={{ borderColor: `${a}20` }}>
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#334155" muted="#64748b" skillStyle="pill" skip={["skills", "languages", "education"]} />
      </div>
    </div>
  );
}

// ── 37. CV TWO DARK SIDEBAR — Dark sidebar, clean main (CV) ───────────────────
function CvTwoDarkSidebar({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1.5px solid ${a}` }}>{title}</h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="text-white/50 uppercase tracking-wider font-bold mb-1.5" style={{ fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[28%] p-4 flex flex-col gap-4 shrink-0" style={{ background: a }}>
        <div>
          <h1 className="font-bold text-white leading-tight" style={{ fontSize: "13px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-white/55 mt-0.5" style={{ fontSize: "8px" }}>{data.profile.professionalTitle}</p>}
          <p className="text-white/35 mt-0.5 uppercase tracking-widest" style={{ fontSize: "7px" }}>Curriculum Vitae</p>
        </div>
        <div><SSH title="Contact" /><ContactRows data={data} ac="#94a3b8" textCol="rgba(255,255,255,0.6)" /></div>
        {data.skills.length > 0 && <div><SSH title="Keywords" /><div className="flex flex-wrap gap-1">{data.skills.map(s => <span key={s.id} className="px-1.5 py-0.5 rounded text-white/70" style={{ background: "rgba(255,255,255,0.08)", fontSize: "8px" }}>{s.name}</span>)}</div></div>}
        {data.awards.length > 0 && <div><SSH title="Honors" />{data.awards.map(a2 => <p key={a2.id} className="text-white/60" style={{ fontSize: "9px" }}>· {a2.name}</p>)}</div>}
      </div>
      <div className="flex-1 p-5">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#334155" muted="#94a3b8" skillStyle="pill" skip={["skills"]} />
      </div>
    </div>
  );
}

// ── 38. CV PHOTO ACADEMIC — Sidebar with circular photo ──────────────────────
function CvPhotoAcademic({ data }: { data: ResumeData }) {
  const a = "#334155"; const isCV = data.documentType === "cv";
  const photoUrl = (data.profile as { photoUrl?: string }).photoUrl;
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1px solid ${a}20` }}>{title}</h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="uppercase tracking-wider font-bold mb-1.5" style={{ color: "#9ca3af", fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[30%] p-4 flex flex-col gap-3 shrink-0" style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0" }}>
        <div className="flex flex-col items-center pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
          <PI url={photoUrl} name={data.profile.fullName} sz={54} ac={a} />
          <h1 className="font-bold text-center mt-2" style={{ color: "#0f172a", fontSize: "12px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-400 text-center mt-0.5" style={{ fontSize: "8px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <div><SSH title="Contact" /><ContactRows data={data} ac={a} textCol="#64748b" /></div>
        {data.education.length > 0 && <div><SSH title="Education" /><div className="space-y-1.5">{data.education.map(e => <div key={e.id}><p className="font-semibold" style={{ color: a, fontSize: "9px" }}>{e.degree}</p><p className="text-slate-400" style={{ fontSize: "8px" }}>{e.school}</p></div>)}</div></div>}
        {data.skills.length > 0 && <div><SSH title="Research Areas" /><div className="space-y-0.5">{data.skills.map(s => <p key={s.id} className="text-slate-500" style={{ fontSize: "9px" }}>· {s.name}</p>)}</div></div>}
      </div>
      <div className="flex-1 p-4">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#334155" muted="#94a3b8" skillStyle="pill" skip={["skills", "education"]} />
      </div>
    </div>
  );
}

// ── 39. CV STEM MODERN — Teal accents, technical skill grid ───────────────────
function CvStemModern({ data }: { data: ResumeData }) {
  const a = "#0f766e"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: a }} />
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: a }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `${a}20` }} />
    </div>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="uppercase tracking-wider font-bold mb-1.5 pb-0.5" style={{ color: a, fontSize: "8px", borderBottom: `1px solid ${a}30` }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[32%] p-4 flex flex-col gap-4 shrink-0" style={{ background: "#f0fdfa" }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: "#0f172a", fontSize: "14px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="mt-0.5" style={{ color: a, fontSize: "9px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <div><SSH title="Contact" /><ContactRows data={data} ac={a} textCol="#0f766e" /></div>
        {data.skills.length > 0 && <div><SSH title="Technical Skills" /><div className="grid grid-cols-2 gap-1">{data.skills.map(s => <span key={s.id} className="px-1 py-0.5 rounded text-center" style={{ background: `${a}15`, color: a, fontSize: "8px" }}>{s.name}</span>)}</div></div>}
        {data.education.length > 0 && <div><SSH title="Education" /><div className="space-y-1.5">{data.education.map(e => <div key={e.id}><p className="font-semibold" style={{ color: "#0f172a", fontSize: "9px" }}>{e.degree}</p><p style={{ color: `${a}80`, fontSize: "8px" }}>{e.school}</p></div>)}</div></div>}
      </div>
      <div className="flex-1 p-4" style={{ borderLeft: `2px solid ${a}30` }}>
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#134e4a" muted="#64748b" bullet="▸" skillStyle="pill" skip={["skills", "education"]} />
      </div>
    </div>
  );
}

// ── 40. RESEARCH FOCUSED — Blue, publications prominent (CV) ───────────────────
function ResearchFocused({ data }: { data: ResumeData }) {
  const a = "#0369a1"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="mb-2 pb-0.5" style={{ borderBottom: `2px solid ${a}` }}>
      <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: a }}>{title}</h2>
    </div>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5">
        <h1 className="font-bold leading-tight" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="font-medium mt-0.5" style={{ color: a, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        <p className="text-slate-400 uppercase tracking-widest mt-0.5" style={{ fontSize: "8px" }}>Curriculum Vitae</p>
        <div className="h-px mt-3" style={{ background: `${a}40` }} />
        {cnt(data).length > 0 && <p className="text-slate-500 mt-1" style={{ fontSize: "9px" }}>{cnt(data).join("  |  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1e293b" muted="#64748b" bullet="→" skillStyle="dot" />
    </div>
  );
}

// ── 41. CV PUBLICATIONS — Numbered citations as dominant visual ────────────────
function CvPublications({ data }: { data: ResumeData }) {
  const a = "#1e3a5f"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2 mt-4">
      <h2 className="font-bold shrink-0" style={{ color: a, fontSize: "11px", letterSpacing: "0.04em" }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `${a}20` }} />
    </div>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5 pb-4" style={{ borderBottom: `1px solid ${a}30` }}>
        <h1 className="font-bold" style={{ color: a, fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5 italic" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-400 mt-1.5" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      {(data.publications ?? []).length > 0 && (
        <div className="mb-4">
          <SH title="Selected Publications" />
          <div className="space-y-2 pl-1">
            {(data.publications ?? []).map((p, i) => (
              <p key={p.id} className="text-xs leading-snug" style={{ color: "#1e293b", paddingLeft: "2em", textIndent: "-2em" }}>
                <span className="font-bold" style={{ color: a }}>[{i + 1}]</span>{" "}{p.authors} ({p.year}). {p.title}. <em className="text-slate-500">{p.journal}</em>
              </p>
            ))}
          </div>
        </div>
      )}
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1e293b" muted="#64748b" skillStyle="inline" />
    </div>
  );
}

// ── 42. PHD DYNAMIC — Split header, triangle bullets (CV) ─────────────────────
function PhdDynamic({ data }: { data: ResumeData }) {
  const a = "#5b21b6"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: a }}>
      <span style={{ color: a }}>▶</span>{title}
    </h2>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="flex justify-between items-start gap-4 mb-5 pb-3" style={{ borderBottom: `2px solid ${a}` }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="font-medium mt-0.5" style={{ color: a, fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
          <p className="text-slate-400 uppercase tracking-widest mt-0.5" style={{ fontSize: "8px" }}>Curriculum Vitae</p>
        </div>
        {cnt(data).length > 0 && (
          <div className="text-right shrink-0 space-y-0.5">{cnt(data).map((c, i) => <p key={i} className="text-slate-500" style={{ fontSize: "9px" }}>{c}</p>)}</div>
        )}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1e1b4b" muted="#64748b" bullet="◆" skillStyle="dot" />
    </div>
  );
}

// ── 43. CV GRANTS FIRST — Grants highlighted prominently at top ────────────────
function CvGrantsFirst({ data }: { data: ResumeData }) {
  const a = "#1a4731"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 pl-2" style={{ color: a, borderLeft: `3px solid ${a}`, borderBottom: `1px solid ${a}20` }}>{title}</h2>
  );
  return (
    <div className="bg-white p-6 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="mb-5">
        <h1 className="font-bold" style={{ color: a, fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-400 mt-1.5" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
        <div className="h-0.5 mt-3" style={{ background: a }} />
      </div>
      {(data.grants ?? []).length > 0 && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: `${a}08`, border: `1px solid ${a}20` }}>
          <SH title="Grants & Funding" />
          <div className="space-y-2 mt-2">
            {(data.grants ?? []).map(g => (
              <div key={g.id} className="flex justify-between items-baseline gap-2">
                <div><span className="font-semibold text-xs text-slate-700">{g.title}</span><p className="text-xs text-slate-400">{g.fundingBody}{g.amount ? ` · ${g.amount}` : ""}</p></div>
                <span className="text-xs shrink-0 text-slate-400">{fmt(g.startDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1f2937" muted="#6b7280" skillStyle="inline" />
    </div>
  );
}

// ── 44. CV BANNER HEADER — Bold dark banner like university stationery ──────────
function CvBannerHeader({ data }: { data: ResumeData }) {
  const a = "#1e3a5f"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: a }}>{title}</h2>
      <div className="flex-1 h-0.5" style={{ background: `${a}25` }} />
    </div>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-6 py-5" style={{ background: a, borderBottom: "4px solid #fbbf24" }}>
        <h1 className="font-bold text-white" style={{ fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-white/70 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        <p className="text-white/45 uppercase tracking-widest mt-0.5" style={{ fontSize: "8px" }}>Curriculum Vitae</p>
        {cnt(data).length > 0 && <p className="text-white/40 mt-2" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <div className="p-6">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1e293b" muted="#64748b" skillStyle="inline" />
      </div>
    </div>
  );
}

// ── 45. CV EUROPEAN — Table-structured rows (Europass-inspired) ────────────────
function CvEuropean({ data }: { data: ResumeData }) {
  const a = "#1e3a5f"; const isCV = data.documentType === "cv";
  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex gap-0 mb-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div className="w-[26%] shrink-0 py-2 pr-3" style={{ borderRight: `2px solid ${a}20` }}>
        <p className="uppercase tracking-wider font-bold text-right" style={{ color: a, fontSize: "8px" }}>{label}</p>
      </div>
      <div className="flex-1 py-2 pl-4 text-xs" style={{ color: "#374151" }}>{children}</div>
    </div>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-5 py-4 flex justify-between items-center" style={{ background: a }}>
        <h1 className="font-bold text-white" style={{ fontSize: "18px" }}>{data.profile.fullName || "Your Name"}</h1>
        <p className="text-white/40 uppercase tracking-widest" style={{ fontSize: "7px" }}>Curriculum Vitae</p>
      </div>
      <div className="p-5">
        {data.profile.professionalTitle && <Row label="Position">{data.profile.professionalTitle}</Row>}
        {cnt(data).length > 0 && <Row label="Contact">{cnt(data).join(" · ")}</Row>}
        {data.summary.text && <Row label="Profile"><p className="text-xs leading-relaxed">{data.summary.text}</p></Row>}
        {!isCV && data.experience.length > 0 && <Row label="Experience"><div className="space-y-2">{data.experience.map(e => <div key={e.id}><div className="flex justify-between"><span className="font-semibold">{e.jobTitle}</span><span className="text-slate-400 text-xs">{dr(e.startDate, e.endDate, e.isCurrent)}</span></div><p className="text-slate-500 text-xs">{e.company}</p></div>)}</div></Row>}
        {isCV && (data.research ?? []).length > 0 && <Row label="Research"><div className="space-y-1.5">{(data.research ?? []).map(r => <div key={r.id}><span className="font-semibold">{r.title}</span><p className="text-slate-500">{r.institution}</p></div>)}</div></Row>}
        {(data.publications ?? []).length > 0 && <Row label="Publications"><div className="space-y-1">{(data.publications ?? []).map((p, i) => <p key={p.id} style={{ paddingLeft: "1.5em", textIndent: "-1.5em" }}><span className="text-slate-400">[{i+1}]</span> {p.authors} ({p.year}). {p.title}. <em className="text-slate-400">{p.journal}</em></p>)}</div></Row>}
        {data.education.length > 0 && <Row label="Education"><div className="space-y-1.5">{data.education.map(e => <div key={e.id}><span className="font-semibold">{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}</span><p className="text-slate-500">{e.school} · {dr(e.startDate, e.endDate, e.isCurrent)}</p></div>)}</div></Row>}
        {data.skills.length > 0 && <Row label="Skills">{data.skills.map(s => s.name).join(" · ")}</Row>}
        {data.languages.length > 0 && <Row label="Languages">{data.languages.map(l => `${l.name} (${l.proficiency})`).join(" · ")}</Row>}
      </div>
    </div>
  );
}

// ── 46. CV INDUSTRY — Less academic, corporate results-focused ─────────────────
function CvIndustry({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="mb-2 flex items-center gap-2">
      <div className="w-1 h-4 shrink-0" style={{ background: a }} />
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: a }}>{title}</h2>
    </div>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-6 py-5 flex justify-between items-end" style={{ background: "#1a2332" }}>
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-white/60 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        </div>
        {cnt(data).length > 0 && <div className="text-right">{cnt(data).slice(0, 3).map((c, i) => <p key={i} className="text-white/45" style={{ fontSize: "9px" }}>{c}</p>)}</div>}
      </div>
      <div className="h-1" style={{ background: "#f59e0b" }} />
      <div className="p-6">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#374151" muted="#9ca3af" bullet="▸" skillStyle="pill" />
      </div>
    </div>
  );
}

// ── 47. CV INTERDISCIPLINARY — Two equal columns for multiple research areas ────
function CvInterdisciplinary({ data }: { data: ResumeData }) {
  const a = "#374151"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: a, borderBottom: `1px solid ${a}25` }}>{title}</h2>
  );
  return (
    <div className="bg-white p-5 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="text-center mb-4 pb-3" style={{ borderBottom: `2px solid ${a}` }}>
        <h1 className="font-bold" style={{ color: "#0f172a", fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5 italic" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-slate-400 mt-1.5" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      {data.summary.text && <p className="text-xs leading-relaxed text-slate-600 mb-4 text-center">{data.summary.text}</p>}
      <div className="flex gap-5">
        <div className="flex-1 space-y-4">
          {(data.research ?? []).length > 0 && <div><SH title="Research Experience" /><div className="space-y-2">{(data.research ?? []).map(r => <div key={r.id}><span className="font-semibold text-xs text-slate-700">{r.title}</span><p className="text-xs text-slate-400">{r.institution}</p></div>)}</div></div>}
          {(data.teaching ?? []).length > 0 && <div><SH title="Teaching" /><div className="space-y-1.5">{(data.teaching ?? []).map(t => <div key={t.id}><span className="font-semibold text-xs text-slate-700">{t.course}</span><p className="text-xs text-slate-400">{t.institution}</p></div>)}</div></div>}
          {(data.publications ?? []).length > 0 && <div><SH title="Publications" /><div className="space-y-1">{(data.publications ?? []).map((p, i) => <p key={p.id} className="text-xs text-slate-600" style={{ paddingLeft: "1.5em", textIndent: "-1.5em" }}><span className="text-slate-400">[{i+1}]</span> {p.authors} ({p.year}). {p.title}.</p>)}</div></div>}
        </div>
        <div className="w-[40%] shrink-0 space-y-4">
          {data.education.length > 0 && <div><SH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><p className="font-semibold text-xs text-slate-700">{e.degree}</p><p className="text-xs text-slate-400">{e.school}</p></div>)}</div></div>}
          {data.skills.length > 0 && <div><SH title="Research Areas" /><div className="flex flex-wrap gap-1">{data.skills.map(s => <span key={s.id} className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${a}12`, color: a, fontSize: "8px" }}>{s.name}</span>)}</div></div>}
          {(data.grants ?? []).length > 0 && <div><SH title="Grants" />{(data.grants ?? []).map(g => <p key={g.id} className="text-xs text-slate-600 mb-0.5">{g.title}{g.amount ? ` · ${g.amount}` : ""}</p>)}</div>}
          {data.awards.length > 0 && <div><SH title="Awards" />{data.awards.map(a2 => <p key={a2.id} className="text-xs text-slate-600 mb-0.5">{a2.name}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── 48. CV POSTDOC — Research trajectory + publications front ─────────────────
function CvPostdoc({ data }: { data: ResumeData }) {
  const a = "#1e3a5f"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-0.5" style={{ color: a, borderBottom: `1.5px solid ${a}` }}>{title}</h2>
  );
  const SSH: SHComp = ({ title }) => (
    <h3 className="uppercase tracking-wider font-bold mb-1.5" style={{ color: `${a}70`, fontSize: "8px" }}>{title}</h3>
  );
  return (
    <div className="bg-white min-h-full flex" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="w-[28%] p-4 flex flex-col gap-4 shrink-0" style={{ background: "#f0f4f8", borderRight: `2px solid ${a}25` }}>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: a, fontSize: "13px" }}>{data.profile.fullName || "Your Name"}</h1>
          {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "8px" }}>{data.profile.professionalTitle}</p>}
        </div>
        <div><SSH title="Contact" /><ContactRows data={data} ac={a} textCol="#475569" /></div>
        {data.education.length > 0 && <div><SSH title="Education" /><div className="space-y-2">{data.education.map(e => <div key={e.id}><p className="font-semibold" style={{ color: a, fontSize: "9px" }}>{e.degree}</p><p className="text-slate-400" style={{ fontSize: "8px" }}>{e.school}</p></div>)}</div></div>}
        {data.skills.length > 0 && <div><SSH title="Expertise" /><div className="flex flex-wrap gap-0.5">{data.skills.map(s => <span key={s.id} className="px-1.5 py-0.5 rounded" style={{ background: `${a}12`, color: a, fontSize: "8px" }}>{s.name}</span>)}</div></div>}
        {data.awards.length > 0 && <div><SSH title="Awards" />{data.awards.map(a2 => <p key={a2.id} style={{ color: "#475569", fontSize: "9px" }}>· {a2.name}</p>)}</div>}
      </div>
      <div className="flex-1 p-4">
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1e293b" muted="#64748b" skillStyle="pill" skip={["skills", "education"]} />
      </div>
    </div>
  );
}

// ── 49. CV LAB PI — Grants, mentorship, lab management featured ────────────────
function CvLabPi({ data }: { data: ResumeData }) {
  const a = "#1a4731"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-3 h-3 rounded-full shrink-0 flex items-center justify-center" style={{ background: a }}>
        <span className="text-white" style={{ fontSize: "6px" }}>▸</span>
      </div>
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: a }}>{title}</h2>
    </div>
  );
  return (
    <div className="bg-white min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="px-6 py-5" style={{ background: a }}>
        <h1 className="font-bold text-white" style={{ fontSize: "22px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-white/65 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        {cnt(data).length > 0 && <p className="text-white/40 mt-2" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <div className="p-6">
        {(data.grants ?? []).length > 0 && (
          <div className="mb-4">
            <SH title="Grants & Funding" />
            <div className="space-y-1.5">{(data.grants ?? []).map(g => <div key={g.id} className="flex justify-between items-baseline gap-2"><div><span className="font-semibold text-xs text-slate-700">{g.title}</span><p className="text-xs text-slate-400">{g.fundingBody}{g.amount ? ` · ${g.amount}` : ""}</p></div><span className="text-xs text-slate-400 shrink-0">{fmt(g.startDate)}</span></div>)}</div>
          </div>
        )}
        <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1f2937" muted="#6b7280" skillStyle="inline" />
      </div>
    </div>
  );
}

// ── 50. CV COMPREHENSIVE — Every section in full detail ───────────────────────
function CvComprehensive({ data }: { data: ResumeData }) {
  const a = "#1a2332"; const isCV = data.documentType === "cv";
  const SH: SHComp = ({ title }) => (
    <div className="mb-2 mt-4">
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: a, letterSpacing: "0.1em" }}>{title}</h2>
      <div className="h-0.5 mt-0.5" style={{ background: `${a}30` }} />
    </div>
  );
  return (
    <div className="bg-white px-7 py-5 min-h-full" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}>
      <div className="text-center mb-4 pb-3" style={{ borderBottom: `2px solid ${a}` }}>
        <h1 className="font-bold" style={{ color: a, fontSize: "20px" }}>{data.profile.fullName || "Your Name"}</h1>
        {data.profile.professionalTitle && <p className="text-slate-500 mt-0.5" style={{ fontSize: "11px" }}>{data.profile.professionalTitle}</p>}
        <p className="uppercase tracking-widest mt-0.5 font-medium" style={{ color: a, fontSize: "8px" }}>Curriculum Vitae</p>
        {cnt(data).length > 0 && <p className="text-slate-400 mt-1.5" style={{ fontSize: "9px" }}>{cnt(data).join("  ·  ")}</p>}
      </div>
      <Body data={data} isCV={isCV} SH={SH} accent={a} body="#1f2937" muted="#6b7280" skillStyle="inline" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ROUTER
// ═══════════════════════════════════════════════════════════════════════════════
export function ResumePreview({ data, templateId = "classic-clean" }: ResumePreviewProps) {
  const template = getTemplateById(templateId);
  const id = template?.id ?? "classic-clean";
  const W = "bg-white shadow-lg rounded-lg overflow-hidden";

  switch (id) {
    // ── Resume: Single Column ──
    case "classic-clean":       return <div className={W}><ClassicClean      data={data} /></div>;
    case "timeline-left":       return <div className={W}><TimelineLeft      data={data} /></div>;
    case "numbered-sections":   return <div className={W}><NumberedSections  data={data} /></div>;
    case "minimal-spacious":    return <div className={W}><MinimalSpacious   data={data} /></div>;
    case "mono-type":           return <div className={W}><MonoType          data={data} /></div>;
    case "compact-dense":       return <div className={W}><CompactDense      data={data} /></div>;
    // ── Resume: Colored Header ──
    case "header-band-dark":    return <div className={W}><HeaderBandDark    data={data} /></div>;
    case "header-band-light":   return <div className={W}><HeaderBandLight   data={data} /></div>;
    case "header-split":        return <div className={W}><HeaderSplit       data={data} /></div>;
    case "border-top-accent":   return <div className={W}><BorderTopAccent   data={data} /></div>;
    case "executive-centered":  return <div className={W}><ExecutiveCentered data={data} /></div>;
    // ── Resume: Two-Column Sidebar ──
    case "sidebar-dark-left":   return <div className={W}><SidebarDarkLeft   data={data} /></div>;
    case "sidebar-light-left":  return <div className={W}><SidebarLightLeft  data={data} /></div>;
    case "sidebar-dark-right":  return <div className={W}><SidebarDarkRight  data={data} /></div>;
    case "sidebar-light-right": return <div className={W}><SidebarLightRight data={data} /></div>;
    case "column-break":        return <div className={W}><ColumnBreak       data={data} /></div>;
    // ── Resume: Photo ──
    case "photo-round-top":     return <div className={W}><PhotoRoundTop     data={data} /></div>;
    case "photo-banner":        return <div className={W}><PhotoBanner       data={data} /></div>;
    case "photo-sidebar":       return <div className={W}><PhotoSidebar      data={data} /></div>;
    case "photo-card":          return <div className={W}><PhotoCard         data={data} /></div>;
    case "photo-elegant":       return <div className={W}><PhotoElegant      data={data} /></div>;
    // ── Resume: Special Layout ──
    case "two-equal-cols":      return <div className={W}><TwoEqualCols      data={data} /></div>;
    case "three-panel":         return <div className={W}><ThreePanel        data={data} /></div>;
    case "card-sections":       return <div className={W}><CardSections      data={data} /></div>;
    case "letter-head":         return <div className={W}><LetterHead        data={data} /></div>;
    case "split-contact":       return <div className={W}><SplitContact      data={data} /></div>;
    // ── Resume: Visual ──
    case "skill-bars":          return <div className={W}><SkillBars         data={data} /></div>;
    case "badge-skills":        return <div className={W}><BadgeSkills       data={data} /></div>;
    case "infographic":         return <div className={W}><Infographic       data={data} /></div>;
    case "ruled-paper":         return <div className={W}><RuledPaper        data={data} /></div>;
    // ── CV: Academic Classic ──
    case "academic-formal":     return <div className={W}><AcademicFormal    data={data} /></div>;
    case "professor-elegant":   return <div className={W}><ProfessorElegant  data={data} /></div>;
    case "cv-nordic":           return <div className={W}><CvNordic          data={data} /></div>;
    case "cv-humanities":       return <div className={W}><CvHumanities      data={data} /></div>;
    case "cv-minimal-academic": return <div className={W}><CvMinimalAcademic data={data} /></div>;
    // ── CV: Two-Column ──
    case "scholar-modern":      return <div className={W}><ScholarModern     data={data} /></div>;
    case "cv-two-dark-sidebar": return <div className={W}><CvTwoDarkSidebar  data={data} /></div>;
    case "cv-photo-academic":   return <div className={W}><CvPhotoAcademic   data={data} /></div>;
    case "cv-stem-modern":      return <div className={W}><CvStemModern      data={data} /></div>;
    // ── CV: Publications/Research ──
    case "research-focused":    return <div className={W}><ResearchFocused   data={data} /></div>;
    case "cv-publications":     return <div className={W}><CvPublications    data={data} /></div>;
    case "phd-dynamic":         return <div className={W}><PhdDynamic        data={data} /></div>;
    case "cv-grants-first":     return <div className={W}><CvGrantsFirst     data={data} /></div>;
    // ── CV: Specialized ──
    case "cv-banner-header":    return <div className={W}><CvBannerHeader    data={data} /></div>;
    case "cv-european":         return <div className={W}><CvEuropean        data={data} /></div>;
    case "cv-industry":         return <div className={W}><CvIndustry        data={data} /></div>;
    case "cv-interdisciplinary":return <div className={W}><CvInterdisciplinary data={data} /></div>;
    // ── CV: Career Stage ──
    case "cv-postdoc":          return <div className={W}><CvPostdoc         data={data} /></div>;
    case "cv-lab-pi":           return <div className={W}><CvLabPi           data={data} /></div>;
    case "cv-comprehensive":    return <div className={W}><CvComprehensive   data={data} /></div>;
    // ── Legacy aliases ──
    case "classic-one":         return <div className={W}><ClassicClean      data={data} /></div>;
    default:                    return <div className={W}><ClassicClean      data={data} /></div>;
  }
}
