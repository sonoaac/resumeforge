import type { ResumeData } from "@shared/schema";
import { getTemplateById } from "@/lib/templates";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  templateId?: string;
  showWatermark?: boolean;
}

export function ResumePreview({ data, templateId = "classic-one", showWatermark = true }: ResumePreviewProps) {
  const template = getTemplateById(templateId) || getTemplateById("classic-one")!;
  const isCV = data.documentType === "cv";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1] || ""} ${year}`;
  };

  const accentColor = template.accentColor;
  const fontFamily = template.fontFamily;

  const SectionHeader = ({ title }: { title: string }) => (
    <h2
      className="text-sm font-semibold uppercase tracking-wide mb-2 pb-1 border-b"
      style={{ color: accentColor, borderColor: `${accentColor}40` }}
    >
      {title}
    </h2>
  );

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden relative"
      style={{ fontFamily, fontSize: "10px" }}
    >
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className="text-slate-200 text-4xl font-bold transform -rotate-45 opacity-30 select-none"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}
          >
            ResumeForge
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4" style={{ borderLeft: `4px solid ${accentColor}` }}>
        <div className="mb-1">
          <h1 className="text-2xl font-bold mb-0.5" style={{ color: accentColor }}>
            {data.profile.fullName || "Your Name"}
          </h1>
          {data.profile.professionalTitle && (
            <p className="text-sm text-slate-600">{data.profile.professionalTitle}</p>
          )}
          {isCV && (
            <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>
              Curriculum Vitae
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-600 mt-3">
          {data.profile.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" style={{ color: accentColor }} />
              {data.profile.email}
            </span>
          )}
          {data.profile.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" style={{ color: accentColor }} />
              {data.profile.phone}
            </span>
          )}
          {(data.profile.city || data.profile.state) && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" style={{ color: accentColor }} />
              {[data.profile.city, data.profile.state].filter(Boolean).join(", ")}
            </span>
          )}
          {data.profile.linkedIn && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" style={{ color: accentColor }} />
              {data.profile.linkedIn}
            </span>
          )}
          {data.profile.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" style={{ color: accentColor }} />
              {data.profile.portfolio}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4">
        {/* Summary / Academic Profile */}
        {data.summary.text && (
          <section>
            <SectionHeader title={isCV ? "Academic Profile" : "Professional Summary"} />
            <p className="text-slate-700 leading-relaxed">{data.summary.text}</p>
          </section>
        )}

        {/* ── RESUME SECTIONS ── */}
        {!isCV && data.experience.length > 0 && (
          <section>
            <SectionHeader title="Experience" />
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-800">{exp.jobTitle}</h3>
                      <p className="text-slate-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">
                      {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.bullets.filter(b => b.trim()).length > 0 && (
                    <ul className="mt-1.5 space-y-1">
                      {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                        <li key={i} className="text-slate-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CV SECTIONS ── */}
        {isCV && (data.research ?? []).length > 0 && (
          <section>
            <SectionHeader title="Research Experience" />
            <div className="space-y-3">
              {(data.research ?? []).map((res) => (
                <div key={res.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-800">{res.title}</h3>
                      <p className="text-slate-600">{res.institution}{res.supervisor ? ` · ${res.supervisor}` : ""}</p>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">
                      {formatDate(res.startDate)} – {res.isCurrent ? "Present" : formatDate(res.endDate)}
                    </span>
                  </div>
                  {res.description && <p className="text-slate-700 mt-1">{res.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {isCV && (data.teaching ?? []).length > 0 && (
          <section>
            <SectionHeader title="Teaching Experience" />
            <div className="space-y-2">
              {(data.teaching ?? []).map((t) => (
                <div key={t.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800">{t.course}</h3>
                    <p className="text-slate-600">{t.role}{t.institution ? `, ${t.institution}` : ""}</p>
                    {t.description && <p className="text-slate-500 text-xs mt-0.5">{t.description}</p>}
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {formatDate(t.startDate)} – {t.isCurrent ? "Present" : formatDate(t.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {isCV && (data.publications ?? []).length > 0 && (
          <section>
            <SectionHeader title="Publications" />
            <div className="space-y-2">
              {(data.publications ?? []).map((pub, i) => (
                <div key={pub.id}>
                  <p className="text-slate-800 leading-snug">
                    <span className="font-medium">{pub.authors}</span>
                    {pub.authors ? " " : ""}
                    ({pub.year}). {pub.title}.{" "}
                    <em className="text-slate-600">{pub.journal}</em>
                    {pub.doi && <span className="text-slate-500"> · {pub.doi}</span>}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {isCV && (data.presentations ?? []).length > 0 && (
          <section>
            <SectionHeader title="Presentations" />
            <div className="space-y-2">
              {(data.presentations ?? []).map((pres) => (
                <div key={pres.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800">{pres.title}</h3>
                    <p className="text-slate-600 capitalize">{pres.type} · {pres.event}{pres.location ? `, ${pres.location}` : ""}</p>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">{formatDate(pres.date)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {isCV && (data.grants ?? []).length > 0 && (
          <section>
            <SectionHeader title="Grants & Fellowships" />
            <div className="space-y-2">
              {(data.grants ?? []).map((grant) => (
                <div key={grant.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800">{grant.title}</h3>
                    <p className="text-slate-600">{grant.fundingBody}{grant.role ? ` · ${grant.role}` : ""}</p>
                    {grant.amount && <p className="text-slate-500 text-xs">{grant.amount}</p>}
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {formatDate(grant.startDate)}{grant.endDate ? ` – ${formatDate(grant.endDate)}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education (both) */}
        {data.education.length > 0 && (
          <section>
            <SectionHeader title="Education" />
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <p className="text-slate-600">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                    {edu.honors && <p className="text-slate-500 italic text-xs">{edu.honors}</p>}
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {formatDate(edu.startDate)} – {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills (both) */}
        {data.skills.length > 0 && (
          <section>
            <SectionHeader title="Skills" />
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects (resume only) */}
        {!isCV && data.projects.length > 0 && (
          <section>
            <SectionHeader title="Projects" />
            <div className="space-y-2">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-800">{project.name}</h3>
                      {project.role && <p className="text-slate-600 text-xs">{project.role}</p>}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatDate(project.startDate)}{project.endDate ? ` – ${formatDate(project.endDate)}` : ""}
                      </span>
                    )}
                  </div>
                  {project.description && <p className="text-slate-700 mt-1">{project.description}</p>}
                  {project.tools && <p className="text-slate-500 text-xs mt-0.5">Tools: {project.tools}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards (both) */}
        {data.awards.length > 0 && (
          <section>
            <SectionHeader title="Awards & Honors" />
            <div className="space-y-1.5">
              {data.awards.map((award) => (
                <div key={award.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-slate-800">{award.name}</span>
                    {award.awardingBody && <span className="text-slate-600"> · {award.awardingBody}</span>}
                    {award.description && <p className="text-slate-500 text-xs">{award.description}</p>}
                  </div>
                  {award.date && <span className="text-xs text-slate-500 shrink-0">{formatDate(award.date)}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications (resume only) */}
        {!isCV && data.certifications.length > 0 && (
          <section>
            <SectionHeader title="Certifications" />
            <div className="space-y-1">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-slate-800">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-600"> – {cert.issuer}</span>}
                  </div>
                  {cert.issueDate && <span className="text-xs text-slate-500">{formatDate(cert.issueDate)}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages (both) */}
        {data.languages.length > 0 && (
          <section>
            <SectionHeader title="Languages" />
            <div className="flex flex-wrap gap-3">
              {data.languages.map((lang) => (
                <span key={lang.id} className="text-slate-700">
                  {lang.name} <span className="text-slate-500 text-xs capitalize">({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* References (CV only) */}
        {isCV && (data.references ?? []).length > 0 && (
          <section>
            <SectionHeader title="References" />
            <div className="grid grid-cols-2 gap-3">
              {(data.references ?? []).map((ref) => (
                <div key={ref.id} className="text-xs text-slate-700">
                  <p className="font-semibold text-slate-800">{ref.name}</p>
                  {ref.title && <p>{ref.title}</p>}
                  {ref.institution && <p className="text-slate-600">{ref.institution}</p>}
                  {ref.email && <p className="text-slate-500">{ref.email}</p>}
                  {ref.relationship && <p className="text-slate-500 italic">{ref.relationship}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
