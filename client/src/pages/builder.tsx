import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Resume, ResumeData } from "@shared/schema";
import { sampleResumeData, sampleCVData } from "@shared/schema";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TemplateThumbnail } from "@/components/resume/TemplateThumbnail";
import { WizardSteps, type WizardStep } from "@/components/resume/WizardSteps";
import { allTemplates, getReleasedTemplates, type TemplateInfo } from "@/lib/templates";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  CheckCircle,
  Download,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  BookOpen,
  Microscope,
  Presentation,
  Trophy,
  Globe,
  Users,
  DollarSign,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { v4 as uuid } from "uuid";

// ─────────────────────────────────────────────
// Wizard step definitions
// ─────────────────────────────────────────────
const resumeSteps: WizardStep[] = [
  { id: "template",   label: "Template",   icon: <FileText    className="w-4 h-4" /> },
  { id: "profile",    label: "Profile",    icon: <User        className="w-4 h-4" /> },
  { id: "summary",    label: "Summary",    icon: <FileText    className="w-4 h-4" /> },
  { id: "experience", label: "Experience", icon: <Briefcase   className="w-4 h-4" /> },
  { id: "education",  label: "Education",  icon: <GraduationCap className="w-4 h-4" /> },
  { id: "skills",     label: "Skills",     icon: <Wrench      className="w-4 h-4" /> },
  { id: "projects",   label: "Projects",   icon: <FolderOpen  className="w-4 h-4" /> },
  { id: "finalize",   label: "Finalize",   icon: <CheckCircle className="w-4 h-4" /> },
  { id: "export",     label: "Export",     icon: <Download    className="w-4 h-4" /> },
];

const cvSteps: WizardStep[] = [
  { id: "template",      label: "Template",      icon: <FileText      className="w-4 h-4" /> },
  { id: "profile",       label: "Profile",       icon: <User          className="w-4 h-4" /> },
  { id: "summary",       label: "Summary",       icon: <FileText      className="w-4 h-4" /> },
  { id: "research",      label: "Research",      icon: <Microscope    className="w-4 h-4" /> },
  { id: "teaching",      label: "Teaching",      icon: <Users         className="w-4 h-4" /> },
  { id: "publications",  label: "Publications",  icon: <BookOpen      className="w-4 h-4" /> },
  { id: "presentations", label: "Presentations", icon: <Presentation  className="w-4 h-4" /> },
  { id: "grants",        label: "Grants",        icon: <DollarSign    className="w-4 h-4" /> },
  { id: "education",     label: "Education",     icon: <GraduationCap className="w-4 h-4" /> },
  { id: "skills",        label: "Skills",        icon: <Wrench        className="w-4 h-4" /> },
  { id: "awards",        label: "Awards",        icon: <Trophy        className="w-4 h-4" /> },
  { id: "languages",     label: "Languages",     icon: <Globe         className="w-4 h-4" /> },
  { id: "references",    label: "References",    icon: <Star          className="w-4 h-4" /> },
  { id: "finalize",      label: "Finalize",      icon: <CheckCircle   className="w-4 h-4" /> },
  { id: "export",        label: "Export",        icon: <Download      className="w-4 h-4" /> },
];

// ─────────────────────────────────────────────
// Preview sample data for template thumbnails
// ─────────────────────────────────────────────
const resumePreviewData: ResumeData = {
  documentType: "resume",
  profile: { fullName: "Sonoaac Mark", professionalTitle: "Software Developer", email: "sonoaac@email.com", phone: "0000000000", city: "Brooklyn", state: "NY", country: "USA", linkedIn: "linkedin.com/in/sonoaacmark", portfolio: "sonoaac.dev", website: "" },
  summary: { headline: "Software Developer", text: "Versatile software developer with 5+ years of experience building web applications and IT support systems. Passionate about clean code and great user experiences." },
  experience: [
    { id: "p1", jobTitle: "Software Developer", company: "Tech Studio NYC", location: "Brooklyn, NY", startDate: "2021-03", endDate: "", isCurrent: true, bullets: ["Built responsive web applications for 20+ clients", "Led frontend development with React and TypeScript", "Improved site performance by 45% through optimization"] },
    { id: "p2", jobTitle: "IT Support Specialist", company: "Digital Agency", location: "New York, NY", startDate: "2019-06", endDate: "2021-02", isCurrent: false, bullets: ["Managed IT infrastructure and user support tickets", "Collaborated with development team on technical solutions"] },
  ],
  education: [{ id: "e1", degree: "B.S. Computer Science", fieldOfStudy: "Computer Science", school: "City University of New York", location: "New York, NY", startDate: "2015-09", endDate: "2019-05", isCurrent: false, honors: "" }],
  skills: [{ id: "s1", name: "React", level: "expert" }, { id: "s2", name: "TypeScript", level: "advanced" }, { id: "s3", name: "Node.js", level: "advanced" }, { id: "s4", name: "CSS / Tailwind", level: "expert" }],
  projects: [{ id: "pr1", name: "ResumeForge", role: "Lead Developer", description: "Full-stack resume builder with 50+ templates", startDate: "2023-01", endDate: "", tools: "React, TypeScript, Express", link: "" }],
  certifications: [], awards: [], languages: [], customSections: [], publications: [], research: [], teaching: [], presentations: [], grants: [], references: [],
};

const cvPreviewData: ResumeData = {
  documentType: "cv",
  profile: { fullName: "Sonoaac Mark", professionalTitle: "Research Scholar", email: "sonoaac@edu.com", phone: "0000000000", city: "Brooklyn", state: "NY", country: "USA", linkedIn: "", portfolio: "sonoaac.edu", website: "" },
  summary: { headline: "Research Scholar", text: "Academic researcher with expertise in computational methods. Published in peer-reviewed journals with experience in grant writing and graduate instruction." },
  experience: [],
  education: [{ id: "e1", degree: "Ph.D. Computer Science", fieldOfStudy: "Computer Science", school: "City University of New York", location: "New York, NY", startDate: "2018-09", endDate: "2023-05", isCurrent: false, honors: "" }],
  skills: [{ id: "s1", name: "Python", level: "expert" }, { id: "s2", name: "R", level: "advanced" }, { id: "s3", name: "Machine Learning", level: "advanced" }],
  projects: [], certifications: [],
  awards: [{ id: "a1", name: "Best Paper Award", awardingBody: "ACM", date: "2022-06", description: "" }],
  languages: [{ id: "l1", name: "English", proficiency: "native" }],
  customSections: [],
  publications: [{ id: "pub1", title: "Neural Networks in Context", authors: "Mar, S. et al.", journal: "Journal of AI Research", year: "2022", doi: "", type: "journal" }],
  research: [{ id: "r1", title: "Computational Linguistics Lab", institution: "CUNY", supervisor: "Dr. Smith", startDate: "2019-01", endDate: "", isCurrent: true, description: "Analysis of transformer-based language models" }],
  teaching: [{ id: "t1", course: "Intro to Programming", role: "Teaching Assistant", institution: "CUNY", startDate: "2018-09", endDate: "2020-05", isCurrent: false, description: "" }],
  presentations: [], grants: [], references: [],
};

// ─────────────────────────────────────────────
// Shared form helpers
// ─────────────────────────────────────────────
function TemplateSelector({ selectedId, onSelect, isCV }: { selectedId: string; onSelect: (id: string) => void; isCV?: boolean }) {
  const templates = getReleasedTemplates().filter(t => isCV ? t.type === "cv" : t.type === "resume");
  const previewData = isCV ? cvPreviewData : resumePreviewData;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`relative rounded-lg border-2 overflow-hidden transition-all bg-white ${
            selectedId === template.id ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-400"
          }`}
          data-testid={`template-select-${template.id}`}
        >
          {/* Perfect-scaled thumbnail */}
          <div className="relative">
            <TemplateThumbnail data={previewData} templateId={template.id} />
            {selectedId === template.id && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-700 truncate">{template.name}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ProfileForm({ data, onChange, isCV }: { data: ResumeData; onChange: (data: ResumeData) => void; isCV?: boolean }) {
  const updateProfile = (field: keyof ResumeData["profile"], value: string) => {
    onChange({ ...data, profile: { ...data.profile, [field]: value } });
  };
  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-primary flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Replace the sample data below with your own information.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" value={data.profile.fullName} onChange={(e) => updateProfile("fullName", e.target.value)} placeholder="John Doe" className="mt-1" data-testid="input-fullname" />
        </div>
        <div>
          <Label htmlFor="title">{isCV ? "Academic Title" : "Professional Title"}</Label>
          <Input id="title" value={data.profile.professionalTitle} onChange={(e) => updateProfile("professionalTitle", e.target.value)} placeholder={isCV ? "Assistant Professor of Biology" : "Software Engineer"} className="mt-1" data-testid="input-title" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={data.profile.email} onChange={(e) => updateProfile("email", e.target.value)} placeholder="john@example.com" className="mt-1" data-testid="input-email" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={data.profile.phone} onChange={(e) => updateProfile("phone", e.target.value)} placeholder="(555) 123-4567" className="mt-1" data-testid="input-phone" />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={data.profile.city} onChange={(e) => updateProfile("city", e.target.value)} placeholder="San Francisco" className="mt-1" data-testid="input-city" />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" value={data.profile.state} onChange={(e) => updateProfile("state", e.target.value)} placeholder="CA" className="mt-1" data-testid="input-state" />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={data.profile.country} onChange={(e) => updateProfile("country", e.target.value)} placeholder="USA" className="mt-1" data-testid="input-country" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" value={data.profile.linkedIn} onChange={(e) => updateProfile("linkedIn", e.target.value)} placeholder="linkedin.com/in/johndoe" className="mt-1" data-testid="input-linkedin" />
        </div>
        <div>
          <Label htmlFor="portfolio">{isCV ? "Academic Website" : "Portfolio"}</Label>
          <Input id="portfolio" value={data.profile.portfolio} onChange={(e) => updateProfile("portfolio", e.target.value)} placeholder={isCV ? "yourname.edu" : "johndoe.com"} className="mt-1" data-testid="input-portfolio" />
        </div>
      </div>
    </div>
  );
}

function SummaryForm({ data, onChange, isCV }: { data: ResumeData; onChange: (data: ResumeData) => void; isCV?: boolean }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="headline">Headline (Optional)</Label>
        <Input id="headline" value={data.summary.headline} onChange={(e) => onChange({ ...data, summary: { ...data.summary, headline: e.target.value } })} placeholder={isCV ? "Professor of Molecular Biology" : "Innovative Software Engineer"} className="mt-1" data-testid="input-headline" />
      </div>
      <div>
        <Label htmlFor="summary">{isCV ? "Academic Profile" : "Professional Summary"}</Label>
        <Textarea
          id="summary"
          value={data.summary.text}
          onChange={(e) => onChange({ ...data, summary: { ...data.summary, text: e.target.value } })}
          placeholder={isCV ? "Summarize your research interests, key achievements, and academic contributions..." : "Write 2-4 sentences about your professional background..."}
          rows={5}
          className="mt-1"
          data-testid="input-summary"
        />
        <p className="text-xs text-slate-500 mt-1">{isCV ? "Include your research focus, major grants, and teaching philosophy." : "Recommended: 2-4 sentences. No bullet points."}</p>
      </div>
    </div>
  );
}

function ExperienceForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const addExperience = () => {
    onChange({ ...data, experience: [...data.experience, { id: uuid(), jobTitle: "", company: "", location: "", startDate: "", endDate: "", isCurrent: false, bullets: [""] }] });
  };
  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...data.experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, experience: updated });
  };
  const removeExperience = (index: number) => {
    onChange({ ...data, experience: data.experience.filter((_, i) => i !== index) });
  };
  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...data.experience];
    const bullets = [...updated[expIndex].bullets];
    bullets[bulletIndex] = value;
    updated[expIndex] = { ...updated[expIndex], bullets };
    onChange({ ...data, experience: updated });
  };
  const addBullet = (expIndex: number) => {
    const updated = [...data.experience];
    updated[expIndex] = { ...updated[expIndex], bullets: [...updated[expIndex].bullets, ""] };
    onChange({ ...data, experience: updated });
  };
  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...data.experience];
    updated[expIndex] = { ...updated[expIndex], bullets: updated[expIndex].bullets.filter((_, i) => i !== bulletIndex) };
    onChange({ ...data, experience: updated });
  };
  return (
    <div className="space-y-6">
      {data.experience.map((exp, index) => (
        <Card key={exp.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Position {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => removeExperience(index)} className="text-destructive" data-testid={`button-remove-exp-${index}`}><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Job Title</Label><Input value={exp.jobTitle} onChange={(e) => updateExperience(index, "jobTitle", e.target.value)} placeholder="Software Engineer" className="mt-1" data-testid={`input-exp-title-${index}`} /></div>
            <div><Label>Company</Label><Input value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} placeholder="Tech Company Inc" className="mt-1" data-testid={`input-exp-company-${index}`} /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div><Label>Location</Label><Input value={exp.location} onChange={(e) => updateExperience(index, "location", e.target.value)} placeholder="San Francisco, CA" className="mt-1" data-testid={`input-exp-location-${index}`} /></div>
            <div><Label>Start Date</Label><Input type="month" value={exp.startDate} onChange={(e) => updateExperience(index, "startDate", e.target.value)} className="mt-1" data-testid={`input-exp-start-${index}`} /></div>
            <div><Label>End Date</Label><Input type="month" value={exp.endDate} onChange={(e) => updateExperience(index, "endDate", e.target.value)} disabled={exp.isCurrent} className="mt-1" data-testid={`input-exp-end-${index}`} /></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Checkbox id={`current-${index}`} checked={exp.isCurrent} onCheckedChange={(checked) => updateExperience(index, "isCurrent", checked)} data-testid={`checkbox-exp-current-${index}`} />
            <Label htmlFor={`current-${index}`} className="text-sm">I currently work here</Label>
          </div>
          <div className="mt-4">
            <Label>Achievements & Responsibilities</Label>
            <div className="space-y-2 mt-2">
              {exp.bullets.map((bullet, bIndex) => (
                <div key={bIndex} className="flex gap-2">
                  <Input value={bullet} onChange={(e) => updateBullet(index, bIndex, e.target.value)} placeholder="Start with an action verb..." className="flex-1" data-testid={`input-exp-bullet-${index}-${bIndex}`} />
                  {exp.bullets.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeBullet(index, bIndex)} data-testid={`button-remove-bullet-${index}-${bIndex}`}><Trash2 className="w-4 h-4 text-slate-400" /></Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => addBullet(index)} className="mt-2 gap-1" data-testid={`button-add-bullet-${index}`}><Plus className="w-4 h-4" /> Add bullet point</Button>
          </div>
        </Card>
      ))}
      <Button onClick={addExperience} variant="outline" className="w-full gap-2" data-testid="button-add-experience"><Plus className="w-4 h-4" /> Add Experience</Button>
    </div>
  );
}

function EducationForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const addEducation = () => {
    onChange({ ...data, education: [...data.education, { id: uuid(), degree: "", fieldOfStudy: "", school: "", location: "", startDate: "", endDate: "", isCurrent: false, honors: "" }] });
  };
  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, education: updated });
  };
  const removeEducation = (index: number) => {
    onChange({ ...data, education: data.education.filter((_, i) => i !== index) });
  };
  return (
    <div className="space-y-6">
      {data.education.map((edu, index) => (
        <Card key={edu.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Education {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => removeEducation(index)} className="text-destructive" data-testid={`button-remove-edu-${index}`}><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Degree</Label><Input value={edu.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} placeholder="Bachelor of Science" className="mt-1" data-testid={`input-edu-degree-${index}`} /></div>
            <div><Label>Field of Study</Label><Input value={edu.fieldOfStudy} onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)} placeholder="Computer Science" className="mt-1" data-testid={`input-edu-field-${index}`} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>School</Label><Input value={edu.school} onChange={(e) => updateEducation(index, "school", e.target.value)} placeholder="University Name" className="mt-1" data-testid={`input-edu-school-${index}`} /></div>
            <div><Label>Location</Label><Input value={edu.location} onChange={(e) => updateEducation(index, "location", e.target.value)} placeholder="City, State" className="mt-1" data-testid={`input-edu-location-${index}`} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Start Date</Label><Input type="month" value={edu.startDate} onChange={(e) => updateEducation(index, "startDate", e.target.value)} className="mt-1" data-testid={`input-edu-start-${index}`} /></div>
            <div><Label>End Date</Label><Input type="month" value={edu.endDate} onChange={(e) => updateEducation(index, "endDate", e.target.value)} disabled={edu.isCurrent} className="mt-1" data-testid={`input-edu-end-${index}`} /></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Checkbox id={`edu-current-${index}`} checked={edu.isCurrent} onCheckedChange={(checked) => updateEducation(index, "isCurrent", checked)} data-testid={`checkbox-edu-current-${index}`} />
            <Label htmlFor={`edu-current-${index}`} className="text-sm">Currently enrolled</Label>
          </div>
          <div className="mt-4"><Label>Honors (Optional)</Label><Input value={edu.honors} onChange={(e) => updateEducation(index, "honors", e.target.value)} placeholder="Magna Cum Laude" className="mt-1" data-testid={`input-edu-honors-${index}`} /></div>
        </Card>
      ))}
      <Button onClick={addEducation} variant="outline" className="w-full gap-2" data-testid="button-add-education"><Plus className="w-4 h-4" /> Add Education</Button>
    </div>
  );
}

function SkillsForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const addSkill = () => onChange({ ...data, skills: [...data.skills, { id: uuid(), name: "", level: "intermediate" as const }] });
  const updateSkill = (index: number, field: string, value: any) => {
    const updated = [...data.skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, skills: updated });
  };
  const removeSkill = (index: number) => onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  return (
    <div className="space-y-4">
      {data.skills.map((skill, index) => (
        <div key={skill.id} className="flex gap-3 items-end">
          <div className="flex-1"><Label>Skill</Label><Input value={skill.name} onChange={(e) => updateSkill(index, "name", e.target.value)} placeholder="JavaScript" className="mt-1" data-testid={`input-skill-name-${index}`} /></div>
          <div className="w-32">
            <Label>Level</Label>
            <Select value={skill.level} onValueChange={(value) => updateSkill(index, "level", value)}>
              <SelectTrigger className="mt-1" data-testid={`select-skill-level-${index}`}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeSkill(index)} className="text-destructive shrink-0" data-testid={`button-remove-skill-${index}`}><Trash2 className="w-4 h-4" /></Button>
        </div>
      ))}
      <Button onClick={addSkill} variant="outline" className="w-full gap-2" data-testid="button-add-skill"><Plus className="w-4 h-4" /> Add Skill</Button>
    </div>
  );
}

function ProjectsForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const addProject = () => onChange({ ...data, projects: [...data.projects, { id: uuid(), name: "", role: "", description: "", startDate: "", endDate: "", tools: "", link: "" }] });
  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, projects: updated });
  };
  const removeProject = (index: number) => onChange({ ...data, projects: data.projects.filter((_, i) => i !== index) });
  return (
    <div className="space-y-6">
      {data.projects.map((project, index) => (
        <Card key={project.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Project {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => removeProject(index)} className="text-destructive" data-testid={`button-remove-project-${index}`}><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Project Name</Label><Input value={project.name} onChange={(e) => updateProject(index, "name", e.target.value)} placeholder="My Project" className="mt-1" data-testid={`input-project-name-${index}`} /></div>
            <div><Label>Your Role</Label><Input value={project.role} onChange={(e) => updateProject(index, "role", e.target.value)} placeholder="Lead Developer" className="mt-1" data-testid={`input-project-role-${index}`} /></div>
          </div>
          <div className="mt-4"><Label>Description</Label><Textarea value={project.description} onChange={(e) => updateProject(index, "description", e.target.value)} placeholder="Brief description..." rows={2} className="mt-1" data-testid={`input-project-desc-${index}`} /></div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Tools & Technologies</Label><Input value={project.tools} onChange={(e) => updateProject(index, "tools", e.target.value)} placeholder="React, Node.js" className="mt-1" data-testid={`input-project-tools-${index}`} /></div>
            <div><Label>Link (Optional)</Label><Input value={project.link} onChange={(e) => updateProject(index, "link", e.target.value)} placeholder="github.com/..." className="mt-1" data-testid={`input-project-link-${index}`} /></div>
          </div>
        </Card>
      ))}
      <Button onClick={addProject} variant="outline" className="w-full gap-2" data-testid="button-add-project"><Plus className="w-4 h-4" /> Add Project</Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// CV-specific form components
// ─────────────────────────────────────────────
function ResearchForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const add = () => onChange({ ...data, research: [...(data.research ?? []), { id: uuid(), title: "", institution: "", supervisor: "", startDate: "", endDate: "", isCurrent: false, description: "" }] });
  const update = (index: number, field: string, value: any) => {
    const updated = [...(data.research ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, research: updated });
  };
  const remove = (index: number) => onChange({ ...data, research: (data.research ?? []).filter((_, i) => i !== index) });
  return (
    <div className="space-y-6">
      {(data.research ?? []).map((res, index) => (
        <Card key={res.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Research Position {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div><Label>Position / Project Title</Label><Input value={res.title} onChange={(e) => update(index, "title", e.target.value)} placeholder="Postdoctoral Fellow – Structural Biology" className="mt-1" /></div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Institution</Label><Input value={res.institution} onChange={(e) => update(index, "institution", e.target.value)} placeholder="MIT" className="mt-1" /></div>
            <div><Label>Supervisor (Optional)</Label><Input value={res.supervisor} onChange={(e) => update(index, "supervisor", e.target.value)} placeholder="Prof. Jane Smith" className="mt-1" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Start Date</Label><Input type="month" value={res.startDate} onChange={(e) => update(index, "startDate", e.target.value)} className="mt-1" /></div>
            <div><Label>End Date</Label><Input type="month" value={res.endDate} onChange={(e) => update(index, "endDate", e.target.value)} disabled={res.isCurrent} className="mt-1" /></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Checkbox id={`res-current-${index}`} checked={res.isCurrent} onCheckedChange={(checked) => update(index, "isCurrent", checked)} />
            <Label htmlFor={`res-current-${index}`} className="text-sm">Currently in this position</Label>
          </div>
          <div className="mt-4"><Label>Description</Label><Textarea value={res.description} onChange={(e) => update(index, "description", e.target.value)} placeholder="Describe your research focus and key findings..." rows={3} className="mt-1" /></div>
        </Card>
      ))}
      <Button onClick={add} variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Add Research Position</Button>
    </div>
  );
}

function TeachingForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const add = () => onChange({ ...data, teaching: [...(data.teaching ?? []), { id: uuid(), course: "", institution: "", role: "", startDate: "", endDate: "", isCurrent: false, description: "" }] });
  const update = (index: number, field: string, value: any) => {
    const updated = [...(data.teaching ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, teaching: updated });
  };
  const remove = (index: number) => onChange({ ...data, teaching: (data.teaching ?? []).filter((_, i) => i !== index) });
  return (
    <div className="space-y-6">
      {(data.teaching ?? []).map((t, index) => (
        <Card key={t.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Teaching Entry {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Course Name / Number</Label><Input value={t.course} onChange={(e) => update(index, "course", e.target.value)} placeholder="BIOL 301 – Cell Biology" className="mt-1" /></div>
            <div><Label>Role</Label><Input value={t.role} onChange={(e) => update(index, "role", e.target.value)} placeholder="Lead Instructor / Teaching Fellow" className="mt-1" /></div>
          </div>
          <div className="mt-4"><Label>Institution</Label><Input value={t.institution} onChange={(e) => update(index, "institution", e.target.value)} placeholder="University Name" className="mt-1" /></div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Start Date</Label><Input type="month" value={t.startDate} onChange={(e) => update(index, "startDate", e.target.value)} className="mt-1" /></div>
            <div><Label>End Date</Label><Input type="month" value={t.endDate} onChange={(e) => update(index, "endDate", e.target.value)} disabled={t.isCurrent} className="mt-1" /></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Checkbox id={`teach-current-${index}`} checked={t.isCurrent} onCheckedChange={(checked) => update(index, "isCurrent", checked)} />
            <Label htmlFor={`teach-current-${index}`} className="text-sm">Currently teaching</Label>
          </div>
          <div className="mt-4"><Label>Notes (Optional)</Label><Input value={t.description} onChange={(e) => update(index, "description", e.target.value)} placeholder="e.g. 120 students, redesigned curriculum" className="mt-1" /></div>
        </Card>
      ))}
      <Button onClick={add} variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Add Teaching Entry</Button>
    </div>
  );
}

function PublicationsForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const add = () => onChange({ ...data, publications: [...(data.publications ?? []), { id: uuid(), title: "", authors: "", journal: "", year: "", doi: "", type: "journal" as const }] });
  const update = (index: number, field: string, value: any) => {
    const updated = [...(data.publications ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, publications: updated });
  };
  const remove = (index: number) => onChange({ ...data, publications: (data.publications ?? []).filter((_, i) => i !== index) });
  return (
    <div className="space-y-6">
      {(data.publications ?? []).map((pub, index) => (
        <Card key={pub.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Publication {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div><Label>Title</Label><Input value={pub.title} onChange={(e) => update(index, "title", e.target.value)} placeholder="Full title of the paper or book" className="mt-1" /></div>
          <div className="mt-4"><Label>Authors</Label><Input value={pub.authors} onChange={(e) => update(index, "authors", e.target.value)} placeholder="Smith J., Doe A., Johnson R." className="mt-1" /></div>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div className="sm:col-span-2"><Label>Journal / Conference / Publisher</Label><Input value={pub.journal} onChange={(e) => update(index, "journal", e.target.value)} placeholder="Nature Cell Biology" className="mt-1" /></div>
            <div><Label>Year</Label><Input value={pub.year} onChange={(e) => update(index, "year", e.target.value)} placeholder="2023" className="mt-1" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Type</Label>
              <Select value={pub.type} onValueChange={(v) => update(index, "type", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="journal">Journal Article</SelectItem>
                  <SelectItem value="conference">Conference Paper</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="chapter">Book Chapter</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>DOI / Link (Optional)</Label><Input value={pub.doi} onChange={(e) => update(index, "doi", e.target.value)} placeholder="10.1038/s41586-..." className="mt-1" /></div>
          </div>
        </Card>
      ))}
      <Button onClick={add} variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Add Publication</Button>
    </div>
  );
}

function PresentationsForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const add = () => onChange({ ...data, presentations: [...(data.presentations ?? []), { id: uuid(), title: "", event: "", location: "", date: "", type: "oral" as const }] });
  const update = (index: number, field: string, value: any) => {
    const updated = [...(data.presentations ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, presentations: updated });
  };
  const remove = (index: number) => onChange({ ...data, presentations: (data.presentations ?? []).filter((_, i) => i !== index) });
  return (
    <div className="space-y-6">
      {(data.presentations ?? []).map((pres, index) => (
        <Card key={pres.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Presentation {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div><Label>Talk Title</Label><Input value={pres.title} onChange={(e) => update(index, "title", e.target.value)} placeholder="Structural Basis of mTOR Activation" className="mt-1" /></div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Conference / Event</Label><Input value={pres.event} onChange={(e) => update(index, "event", e.target.value)} placeholder="ASCB Annual Meeting" className="mt-1" /></div>
            <div><Label>Location</Label><Input value={pres.location} onChange={(e) => update(index, "location", e.target.value)} placeholder="San Francisco, CA" className="mt-1" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Date</Label><Input type="month" value={pres.date} onChange={(e) => update(index, "date", e.target.value)} className="mt-1" /></div>
            <div>
              <Label>Type</Label>
              <Select value={pres.type} onValueChange={(v) => update(index, "type", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="oral">Oral Presentation</SelectItem>
                  <SelectItem value="poster">Poster</SelectItem>
                  <SelectItem value="invited">Invited Talk</SelectItem>
                  <SelectItem value="keynote">Keynote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={add} variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Add Presentation</Button>
    </div>
  );
}

function GrantsForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const add = () => onChange({ ...data, grants: [...(data.grants ?? []), { id: uuid(), title: "", fundingBody: "", amount: "", startDate: "", endDate: "", role: "", description: "" }] });
  const update = (index: number, field: string, value: any) => {
    const updated = [...(data.grants ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, grants: updated });
  };
  const remove = (index: number) => onChange({ ...data, grants: (data.grants ?? []).filter((_, i) => i !== index) });
  return (
    <div className="space-y-6">
      {(data.grants ?? []).map((grant, index) => (
        <Card key={grant.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Grant / Fellowship {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div><Label>Grant Title / Number</Label><Input value={grant.title} onChange={(e) => update(index, "title", e.target.value)} placeholder="R01 GM145782 – Structural Mechanisms of mTOR" className="mt-1" /></div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Funding Body</Label><Input value={grant.fundingBody} onChange={(e) => update(index, "fundingBody", e.target.value)} placeholder="NIH / NSF / Welcome Trust" className="mt-1" /></div>
            <div><Label>Total Amount</Label><Input value={grant.amount} onChange={(e) => update(index, "amount", e.target.value)} placeholder="$1,250,000" className="mt-1" /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div><Label>Your Role</Label><Input value={grant.role} onChange={(e) => update(index, "role", e.target.value)} placeholder="Principal Investigator" className="mt-1" /></div>
            <div><Label>Start Date</Label><Input type="month" value={grant.startDate} onChange={(e) => update(index, "startDate", e.target.value)} className="mt-1" /></div>
            <div><Label>End Date</Label><Input type="month" value={grant.endDate} onChange={(e) => update(index, "endDate", e.target.value)} className="mt-1" /></div>
          </div>
          <div className="mt-4"><Label>Brief Description (Optional)</Label><Input value={grant.description} onChange={(e) => update(index, "description", e.target.value)} placeholder="One-line summary of the grant goals" className="mt-1" /></div>
        </Card>
      ))}
      <Button onClick={add} variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Add Grant / Fellowship</Button>
    </div>
  );
}

function AwardsForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const add = () => onChange({ ...data, awards: [...data.awards, { id: uuid(), name: "", awardingBody: "", date: "", description: "" }] });
  const update = (index: number, field: string, value: any) => {
    const updated = [...data.awards];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, awards: updated });
  };
  const remove = (index: number) => onChange({ ...data, awards: data.awards.filter((_, i) => i !== index) });
  return (
    <div className="space-y-6">
      {data.awards.map((award, index) => (
        <Card key={award.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Award {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Award Name</Label><Input value={award.name} onChange={(e) => update(index, "name", e.target.value)} placeholder="Young Investigator Award" className="mt-1" /></div>
            <div><Label>Awarding Body</Label><Input value={award.awardingBody} onChange={(e) => update(index, "awardingBody", e.target.value)} placeholder="American Society of Biochemistry" className="mt-1" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Date</Label><Input type="month" value={award.date} onChange={(e) => update(index, "date", e.target.value)} className="mt-1" /></div>
            <div><Label>Description (Optional)</Label><Input value={award.description} onChange={(e) => update(index, "description", e.target.value)} placeholder="Brief reason or context" className="mt-1" /></div>
          </div>
        </Card>
      ))}
      <Button onClick={add} variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Add Award</Button>
    </div>
  );
}

function LanguagesForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const add = () => onChange({ ...data, languages: [...data.languages, { id: uuid(), name: "", proficiency: "conversational" as const }] });
  const update = (index: number, field: string, value: any) => {
    const updated = [...data.languages];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, languages: updated });
  };
  const remove = (index: number) => onChange({ ...data, languages: data.languages.filter((_, i) => i !== index) });
  return (
    <div className="space-y-4">
      {data.languages.map((lang, index) => (
        <div key={lang.id} className="flex gap-3 items-end">
          <div className="flex-1"><Label>Language</Label><Input value={lang.name} onChange={(e) => update(index, "name", e.target.value)} placeholder="French" className="mt-1" /></div>
          <div className="w-40">
            <Label>Proficiency</Label>
            <Select value={lang.proficiency} onValueChange={(v) => update(index, "proficiency", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="fluent">Fluent</SelectItem>
                <SelectItem value="native">Native</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
        </div>
      ))}
      <Button onClick={add} variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Add Language</Button>
    </div>
  );
}

function ReferencesForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const add = () => onChange({ ...data, references: [...(data.references ?? []), { id: uuid(), name: "", title: "", institution: "", email: "", phone: "", relationship: "" }] });
  const update = (index: number, field: string, value: any) => {
    const updated = [...(data.references ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, references: updated });
  };
  const remove = (index: number) => onChange({ ...data, references: (data.references ?? []).filter((_, i) => i !== index) });
  return (
    <div className="space-y-6">
      {(data.references ?? []).map((ref, index) => (
        <Card key={ref.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Reference {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={ref.name} onChange={(e) => update(index, "name", e.target.value)} placeholder="Prof. Jane Smith" className="mt-1" /></div>
            <div><Label>Title / Position</Label><Input value={ref.title} onChange={(e) => update(index, "title", e.target.value)} placeholder="Professor of Chemistry" className="mt-1" /></div>
          </div>
          <div className="mt-4"><Label>Institution</Label><Input value={ref.institution} onChange={(e) => update(index, "institution", e.target.value)} placeholder="Stanford University" className="mt-1" /></div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><Label>Email</Label><Input type="email" value={ref.email} onChange={(e) => update(index, "email", e.target.value)} placeholder="j.smith@stanford.edu" className="mt-1" /></div>
            <div><Label>Phone (Optional)</Label><Input value={ref.phone} onChange={(e) => update(index, "phone", e.target.value)} placeholder="(650) 000-0000" className="mt-1" /></div>
          </div>
          <div className="mt-4"><Label>Relationship</Label><Input value={ref.relationship} onChange={(e) => update(index, "relationship", e.target.value)} placeholder="PhD Supervisor / Collaborator / Mentor" className="mt-1" /></div>
        </Card>
      ))}
      <Button onClick={add} variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Add Reference</Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Finalize / Export forms (shared, CV-aware)
// ─────────────────────────────────────────────
function FinalizeForm({ data, isCV }: { data: ResumeData; isCV: boolean }) {
  const resumeChecks = [
    { label: "Contact information complete", passed: !!(data.profile.fullName && data.profile.email && data.profile.phone) },
    { label: "Professional summary added", passed: !!data.summary.text },
    { label: "At least one work experience", passed: data.experience.length > 0 },
    { label: "Experience has bullet points", passed: data.experience.every(exp => exp.bullets.filter(b => b.trim()).length >= 2) },
    { label: "Education added", passed: data.education.length > 0 },
    { label: "Skills listed", passed: data.skills.length >= 3 },
  ];

  const cvChecks = [
    { label: "Contact information complete", passed: !!(data.profile.fullName && data.profile.email) },
    { label: "Academic profile / summary added", passed: !!data.summary.text },
    { label: "Education added", passed: data.education.length > 0 },
    { label: "At least one publication", passed: (data.publications ?? []).length > 0 },
    { label: "Research experience added", passed: (data.research ?? []).length > 0 },
    { label: "Skills listed", passed: data.skills.length >= 2 },
  ];

  const checks = isCV ? cvChecks : resumeChecks;
  const passedCount = checks.filter(c => c.passed).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-slate-800 mb-2">{isCV ? "CV Completeness Check" : "ATS Readiness Check"}</h3>
        <p className="text-sm text-slate-600 mb-4">
          {isCV ? "Make sure your CV is comprehensive and ready for academic applications." : "Make sure your resume is optimized to pass Applicant Tracking Systems."}
        </p>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${check.passed ? "bg-green-50" : "bg-amber-50"}`}>
              {check.passed ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
              <span className={check.passed ? "text-green-800" : "text-amber-800"}>{check.label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 mt-4">{passedCount} of {checks.length} checks passed</p>
      </div>
    </div>
  );
}

function ExportForm({ resumeId, templateId, isGuestMode, isCV, resumeData }: { resumeId?: string; templateId: string; isGuestMode?: boolean; isCV?: boolean; resumeData?: ResumeData }) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [pdfFailed, setPdfFailed] = useState(false);
  const docLabel = isCV ? "CV" : "Resume";

  // ── Primary: open print/save-as-PDF page in new tab ─────────────────────
  const handlePrint = () => {
    if (!resumeData) return;
    localStorage.setItem("resumeforge_print_job", JSON.stringify({ resumeData, templateId }));
    window.open("/resume/print", "_blank");
  };

  // ── Secondary: server-side PDF download ─────────────────────────────────
  const handleExportPDF = async () => {
    setIsExporting(true);
    setPdfFailed(false);
    try {
      let response: Response;
      if (isGuestMode && resumeData) {
        response = await fetch("/api/pdf/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData, templateId }),
        });
      } else if (resumeId) {
        response = await fetch(`/api/resumes/${resumeId}/download`, { credentials: "include" });
      } else {
        window.location.href = "/api/login";
        return;
      }
      if (!response.ok) {
        let msg = "Server PDF failed";
        try { const e = await response.json(); msg = e.error || msg; } catch {}
        throw new Error(msg);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${docLabel.toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: `${docLabel} PDF downloaded!` });
    } catch (error: any) {
      setPdfFailed(true);
      toast({ title: "Server PDF unavailable — use Print / Save as PDF instead", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {isGuestMode && (
        <Card className="p-5 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-slate-800">Your {docLabel} is ready!</h4>
              <p className="text-sm text-slate-600 mt-1">Sign in to save your work and access it from any device.</p>
              <a href="/api/login" data-testid="link-login-export">
                <Button className="mt-3" size="sm" variant="outline">Sign in to save</Button>
              </a>
            </div>
          </div>
        </Card>
      )}

      {/* ── PRIMARY: Print / Save as PDF ── */}
      <Card className="p-5 border-primary/30 bg-primary/5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Print / Save as PDF</h3>
            <p className="text-xs text-slate-500 mt-0.5">Opens a print-ready preview — choose "Save as PDF" in the dialog</p>
          </div>
        </div>
        <Button
          onClick={handlePrint}
          className="w-full gap-2"
          data-testid="button-print-pdf"
        >
          <Download className="w-4 h-4" />
          Open Print Preview
        </Button>
        <p className="text-xs text-slate-500 mt-3 flex items-start gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          In print dialog: set <strong className="mx-0.5">Destination → Save as PDF</strong>, <strong className="mx-0.5">Margins → None</strong>, enable <strong className="mx-0.5">Background graphics</strong>
        </p>
      </Card>

      {/* ── SECONDARY: Direct PDF download ── */}
      <Card className="p-5">
        <h3 className="font-medium text-slate-700 mb-3 text-sm">Direct PDF Download</h3>
        {pdfFailed && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md p-3 mb-3 text-xs text-amber-800">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Server PDF is unavailable on this deployment. Use the Print option above instead — it works in all browsers.
          </div>
        )}
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          variant="outline"
          className="w-full gap-2"
          data-testid="button-export-pdf"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isExporting ? "Generating..." : `Download ${docLabel} as PDF`}
        </Button>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main builder page
// ─────────────────────────────────────────────
export default function BuilderPage() {
  const params = useParams<{ id?: string }>();
  const search = useSearch();
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const isCV = location.startsWith("/cv-builder");
  const wizardSteps = isCV ? cvSteps : resumeSteps;

  const searchParams = new URLSearchParams(search);
  const initialTemplate = searchParams.get("template") || (isCV ? "academic-formal" : "classic-clean");

  const isNewDoc = !params.id && (location === "/builder/new" || location === "/cv-builder/new" || location === "/builder" || location === "/cv-builder");
  const isGuestMode = !isAuthenticated && isNewDoc;

  const defaultData = isCV ? sampleCVData : sampleResumeData;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { data: existingResume, isLoading: resumeLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes", params.id],
    enabled: !!params.id,
  });

  useEffect(() => {
    if (existingResume) {
      setResumeData(existingResume.resumeData);
      if (existingResume.templateId) setSelectedTemplate(existingResume.templateId);
    }
  }, [existingResume]);

  const [guestDataProcessed, setGuestDataProcessed] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isNewDoc && !params.id && !guestDataProcessed) {
      const key = isCV ? "resumeforge_guest_cv" : "resumeforge_guest_resume";
      const savedDoc = localStorage.getItem(key);
      if (savedDoc) {
        try {
          const parsed = JSON.parse(savedDoc);
          if (parsed.resumeData) setResumeData(parsed.resumeData);
          if (parsed.templateId) setSelectedTemplate(parsed.templateId);
          localStorage.removeItem(key);
          localStorage.removeItem("resumeforge_selected_template");
          localStorage.removeItem("resumeforge_onboarding");
          setGuestDataProcessed(true);
        } catch (e) {}
      }
    }
  }, [isAuthenticated, isNewDoc, params.id, guestDataProcessed, isCV]);

  useEffect(() => {
    if (isAuthenticated && guestDataProcessed && !params.id) {
      const docLabel = isCV ? "CV" : "Resume";
      apiRequest("POST", "/api/resumes", {
        resumeData,
        templateId: selectedTemplate,
        title: resumeData.profile.fullName ? `${resumeData.profile.fullName}'s ${docLabel}` : `My ${docLabel}`,
      }).then((data: any) => {
        if (data.id) {
          const base = isCV ? "/cv-builder" : "/builder";
          setLocation(`${base}/${data.id}`, { replace: true });
          toast({ title: `${docLabel} saved successfully!` });
        }
      }).catch(() => {
        toast({ title: "Failed to save", variant: "destructive" });
      });
    }
  }, [guestDataProcessed, isAuthenticated, params.id, isCV]);

  const saveMutation = useMutation({
    mutationFn: async (data: { resumeData: ResumeData; templateId: string; title?: string }) => {
      if (params.id) return apiRequest("PATCH", `/api/resumes/${params.id}`, data);
      return apiRequest("POST", "/api/resumes", data);
    },
    onSuccess: (data: any) => {
      setLastSaved(new Date());
      setIsSaving(false);
      if (!params.id && data.id) {
        const base = isCV ? "/cv-builder" : "/builder";
        setLocation(`${base}/${data.id}`, { replace: true });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
    },
    onError: () => {
      setIsSaving(false);
      toast({ title: "Failed to save", variant: "destructive" });
    },
  });

  const autoSave = useCallback(() => {
    if (!isAuthenticated) return;
    setIsSaving(true);
    saveMutation.mutate({ resumeData, templateId: selectedTemplate });
  }, [resumeData, selectedTemplate, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [resumeData, selectedTemplate, isAuthenticated, autoSave]);

  const handleDataChange = (newData: ResumeData) => setResumeData(newData);
  const goToStep = (step: number) => setCurrentStep(Math.max(0, Math.min(step, wizardSteps.length - 1)));

  const renderStepContent = () => {
    const stepId = wizardSteps[currentStep].id;
    switch (stepId) {
      case "template":      return <TemplateSelector selectedId={selectedTemplate} onSelect={setSelectedTemplate} isCV={isCV} />;
      case "profile":       return <ProfileForm data={resumeData} onChange={handleDataChange} isCV={isCV} />;
      case "summary":       return <SummaryForm data={resumeData} onChange={handleDataChange} isCV={isCV} />;
      case "experience":    return <ExperienceForm data={resumeData} onChange={handleDataChange} />;
      case "education":     return <EducationForm data={resumeData} onChange={handleDataChange} />;
      case "skills":        return <SkillsForm data={resumeData} onChange={handleDataChange} />;
      case "projects":      return <ProjectsForm data={resumeData} onChange={handleDataChange} />;
      case "research":      return <ResearchForm data={resumeData} onChange={handleDataChange} />;
      case "teaching":      return <TeachingForm data={resumeData} onChange={handleDataChange} />;
      case "publications":  return <PublicationsForm data={resumeData} onChange={handleDataChange} />;
      case "presentations": return <PresentationsForm data={resumeData} onChange={handleDataChange} />;
      case "grants":        return <GrantsForm data={resumeData} onChange={handleDataChange} />;
      case "awards":        return <AwardsForm data={resumeData} onChange={handleDataChange} />;
      case "languages":     return <LanguagesForm data={resumeData} onChange={handleDataChange} />;
      case "references":    return <ReferencesForm data={resumeData} onChange={handleDataChange} />;
      case "finalize":      return <FinalizeForm data={resumeData} isCV={isCV} />;
      case "export":        return <ExportForm resumeId={params.id} templateId={selectedTemplate} isGuestMode={isGuestMode} isCV={isCV} resumeData={resumeData} />;
      default:              return null;
    }
  };

  // Guest localStorage persistence — versioned so stale data is ignored
  const GUEST_VERSION = "v4";
  useEffect(() => {
    if (isNewDoc && !isAuthenticated) {
      const key = isCV ? "resumeforge_guest_cv" : "resumeforge_guest_resume";
      const stored = localStorage.getItem("resumeforge_selected_template");
      if (stored) { try { const { templateId } = JSON.parse(stored); if (templateId) setSelectedTemplate(templateId); } catch (e) {} }
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only restore data if it matches current version; otherwise fresh sample is shown
          if (parsed.version === GUEST_VERSION && parsed.resumeData) setResumeData(parsed.resumeData);
          if (parsed.templateId) setSelectedTemplate(parsed.templateId);
        } catch (e) {}
      }
    }
  }, [isNewDoc, isAuthenticated, isCV]);

  useEffect(() => {
    if (isGuestMode) {
      const key = isCV ? "resumeforge_guest_cv" : "resumeforge_guest_resume";
      localStorage.setItem(key, JSON.stringify({ resumeData, templateId: selectedTemplate, version: GUEST_VERSION }));
    }
  }, [resumeData, selectedTemplate, isGuestMode, isCV]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated && params.id) {
    const docLabel = isCV ? "CV" : "resume";
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 max-w-md text-center">
          <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Sign in to access your {docLabel}</h1>
          <p className="text-slate-600 mb-6">Log in to continue editing your saved {docLabel}.</p>
          <a href="/api/login" data-testid="button-login-builder"><Button className="w-full">Sign in to continue</Button></a>
        </Card>
      </div>
    );
  }

  const docLabel = isCV ? "CV" : "Resume";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation(isGuestMode ? "/" : "/dashboard")}
                className="gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" />
                {isGuestMode ? "Home" : "Dashboard"}
              </Button>
              <Badge variant={isCV ? "default" : "secondary"} className="text-xs">
                {isCV ? "CV Builder" : "Resume Builder"}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {isGuestMode ? (
                <a href="/api/login" data-testid="link-login-header">
                  <Button size="sm" variant="outline" className="gap-2">Sign in to save</Button>
                </a>
              ) : (
                <>
                  {isSaving && <span className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" />Saving...</span>}
                  {lastSaved && !isSaving && <span className="text-sm text-slate-500 flex items-center gap-1"><Save className="w-4 h-4" />Saved</span>}
                  <Button onClick={autoSave} variant="outline" size="sm" className="gap-2" data-testid="button-save"><Save className="w-4 h-4" />Save</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 overflow-x-auto">
        <div className="container mx-auto px-4 py-3">
          <WizardSteps steps={wizardSteps} currentStep={currentStep} onStepClick={goToStep} />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-full">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 overflow-y-auto max-h-[calc(100vh-220px)]"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                {wizardSteps[currentStep].icon}
                {wizardSteps[currentStep].label}
              </h2>
            </div>

            {renderStepContent()}

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              <Button variant="outline" onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0} className="gap-2" data-testid="button-prev-step">
                <ArrowLeft className="w-4 h-4" /> Previous
              </Button>
              <Button onClick={() => goToStep(currentStep + 1)} disabled={currentStep === wizardSteps.length - 1} className="gap-2" data-testid="button-next-step">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          <div className="hidden lg:block bg-slate-200 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-220px)]">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-700">Live Preview</h3>
                <Badge variant="outline">{allTemplates.find(t => t.id === selectedTemplate)?.name || "Classic One"}</Badge>
              </div>
              <div className="transform scale-[0.75] origin-top">
                <ResumePreview data={resumeData} templateId={selectedTemplate} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
