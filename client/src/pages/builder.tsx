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
import { sampleResumeData } from "@shared/schema";
import { ResumePreview } from "@/components/resume/ResumePreview";
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
  Crown,
  Lock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { v4 as uuid } from "uuid";

const wizardSteps: WizardStep[] = [
  { id: "template", label: "Template", icon: <FileText className="w-4 h-4" /> },
  { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { id: "summary", label: "Summary", icon: <FileText className="w-4 h-4" /> },
  { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "skills", label: "Skills", icon: <Wrench className="w-4 h-4" /> },
  { id: "projects", label: "Projects", icon: <FolderOpen className="w-4 h-4" /> },
  { id: "finalize", label: "Finalize", icon: <CheckCircle className="w-4 h-4" /> },
  { id: "export", label: "Export", icon: <Download className="w-4 h-4" /> },
];

function TemplateSelector({ 
  selectedId, 
  onSelect 
}: { 
  selectedId: string; 
  onSelect: (id: string) => void; 
}) {
  const templates = getReleasedTemplates();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`relative rounded-lg border-2 overflow-hidden transition-all ${
            selectedId === template.id 
              ? "border-primary ring-2 ring-primary/20" 
              : "border-slate-200 hover:border-slate-300"
          }`}
          data-testid={`template-select-${template.id}`}
        >
          {template.isPremium && (
            <Badge className="absolute top-2 right-2 z-10 bg-amber-500 text-white border-0 text-xs gap-1">
              <Crown className="w-3 h-3" />
              Pro
            </Badge>
          )}
          <div 
            className="aspect-[3/4] bg-gradient-to-b from-slate-50 to-slate-100 p-2"
            style={{ borderLeft: `3px solid ${template.accentColor}` }}
          >
            <div className="h-full bg-white rounded shadow-sm p-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `${template.accentColor}30` }} />
                <div className="h-1.5 w-10 rounded" style={{ backgroundColor: template.accentColor }} />
              </div>
              <div className="space-y-1">
                <div className="h-1 w-full bg-slate-200 rounded" />
                <div className="h-1 w-4/5 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
          <div className="p-2 bg-white">
            <p className="text-xs font-medium text-slate-700 truncate">{template.name}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ProfileForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
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
          <Label htmlFor="title">Professional Title</Label>
          <Input id="title" value={data.profile.professionalTitle} onChange={(e) => updateProfile("professionalTitle", e.target.value)} placeholder="Software Engineer" className="mt-1" data-testid="input-title" />
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
          <Label htmlFor="portfolio">Portfolio</Label>
          <Input id="portfolio" value={data.profile.portfolio} onChange={(e) => updateProfile("portfolio", e.target.value)} placeholder="johndoe.com" className="mt-1" data-testid="input-portfolio" />
        </div>
      </div>
    </div>
  );
}

function SummaryForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="headline">Headline (Optional)</Label>
        <Input id="headline" value={data.summary.headline} onChange={(e) => onChange({ ...data, summary: { ...data.summary, headline: e.target.value } })} placeholder="Innovative Software Engineer" className="mt-1" data-testid="input-headline" />
      </div>
      <div>
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea id="summary" value={data.summary.text} onChange={(e) => onChange({ ...data, summary: { ...data.summary, text: e.target.value } })} placeholder="Write 2-4 sentences about your professional background..." rows={4} className="mt-1" data-testid="input-summary" />
        <p className="text-xs text-slate-500 mt-1">Recommended: 2-4 sentences. No bullet points.</p>
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
            <Button variant="ghost" size="icon" onClick={() => removeExperience(index)} className="text-destructive" data-testid={`button-remove-exp-${index}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Job Title</Label>
              <Input value={exp.jobTitle} onChange={(e) => updateExperience(index, "jobTitle", e.target.value)} placeholder="Software Engineer" className="mt-1" data-testid={`input-exp-title-${index}`} />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} placeholder="Tech Company Inc" className="mt-1" data-testid={`input-exp-company-${index}`} />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div>
              <Label>Location</Label>
              <Input value={exp.location} onChange={(e) => updateExperience(index, "location", e.target.value)} placeholder="San Francisco, CA" className="mt-1" data-testid={`input-exp-location-${index}`} />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="month" value={exp.startDate} onChange={(e) => updateExperience(index, "startDate", e.target.value)} className="mt-1" data-testid={`input-exp-start-${index}`} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="month" value={exp.endDate} onChange={(e) => updateExperience(index, "endDate", e.target.value)} disabled={exp.isCurrent} className="mt-1" data-testid={`input-exp-end-${index}`} />
            </div>
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
                    <Button variant="ghost" size="icon" onClick={() => removeBullet(index, bIndex)} data-testid={`button-remove-bullet-${index}-${bIndex}`}>
                      <Trash2 className="w-4 h-4 text-slate-400" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => addBullet(index)} className="mt-2 gap-1" data-testid={`button-add-bullet-${index}`}>
              <Plus className="w-4 h-4" /> Add bullet point
            </Button>
          </div>
        </Card>
      ))}
      <Button onClick={addExperience} variant="outline" className="w-full gap-2" data-testid="button-add-experience">
        <Plus className="w-4 h-4" /> Add Experience
      </Button>
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
            <Button variant="ghost" size="icon" onClick={() => removeEducation(index)} className="text-destructive" data-testid={`button-remove-edu-${index}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Degree</Label>
              <Input value={edu.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} placeholder="Bachelor of Science" className="mt-1" data-testid={`input-edu-degree-${index}`} />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input value={edu.fieldOfStudy} onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)} placeholder="Computer Science" className="mt-1" data-testid={`input-edu-field-${index}`} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <Label>School</Label>
              <Input value={edu.school} onChange={(e) => updateEducation(index, "school", e.target.value)} placeholder="University Name" className="mt-1" data-testid={`input-edu-school-${index}`} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={edu.location} onChange={(e) => updateEducation(index, "location", e.target.value)} placeholder="City, State" className="mt-1" data-testid={`input-edu-location-${index}`} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Start Date</Label>
              <Input type="month" value={edu.startDate} onChange={(e) => updateEducation(index, "startDate", e.target.value)} className="mt-1" data-testid={`input-edu-start-${index}`} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="month" value={edu.endDate} onChange={(e) => updateEducation(index, "endDate", e.target.value)} disabled={edu.isCurrent} className="mt-1" data-testid={`input-edu-end-${index}`} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Checkbox id={`edu-current-${index}`} checked={edu.isCurrent} onCheckedChange={(checked) => updateEducation(index, "isCurrent", checked)} data-testid={`checkbox-edu-current-${index}`} />
            <Label htmlFor={`edu-current-${index}`} className="text-sm">Currently enrolled</Label>
          </div>
          <div className="mt-4">
            <Label>Honors (Optional)</Label>
            <Input value={edu.honors} onChange={(e) => updateEducation(index, "honors", e.target.value)} placeholder="Magna Cum Laude" className="mt-1" data-testid={`input-edu-honors-${index}`} />
          </div>
        </Card>
      ))}
      <Button onClick={addEducation} variant="outline" className="w-full gap-2" data-testid="button-add-education">
        <Plus className="w-4 h-4" /> Add Education
      </Button>
    </div>
  );
}

function SkillsForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const addSkill = () => {
    onChange({ ...data, skills: [...data.skills, { id: uuid(), name: "", level: "intermediate" as const }] });
  };

  const updateSkill = (index: number, field: string, value: any) => {
    const updated = [...data.skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, skills: updated });
  };

  const removeSkill = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {data.skills.map((skill, index) => (
        <div key={skill.id} className="flex gap-3 items-end">
          <div className="flex-1">
            <Label>Skill</Label>
            <Input value={skill.name} onChange={(e) => updateSkill(index, "name", e.target.value)} placeholder="JavaScript" className="mt-1" data-testid={`input-skill-name-${index}`} />
          </div>
          <div className="w-32">
            <Label>Level</Label>
            <Select value={skill.level} onValueChange={(value) => updateSkill(index, "level", value)}>
              <SelectTrigger className="mt-1" data-testid={`select-skill-level-${index}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeSkill(index)} className="text-destructive shrink-0" data-testid={`button-remove-skill-${index}`}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button onClick={addSkill} variant="outline" className="w-full gap-2" data-testid="button-add-skill">
        <Plus className="w-4 h-4" /> Add Skill
      </Button>
    </div>
  );
}

function ProjectsForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const addProject = () => {
    onChange({ ...data, projects: [...data.projects, { id: uuid(), name: "", role: "", description: "", startDate: "", endDate: "", tools: "", link: "" }] });
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, projects: updated });
  };

  const removeProject = (index: number) => {
    onChange({ ...data, projects: data.projects.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {data.projects.map((project, index) => (
        <Card key={project.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-slate-800">Project {index + 1}</h3>
            <Button variant="ghost" size="icon" onClick={() => removeProject(index)} className="text-destructive" data-testid={`button-remove-project-${index}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Project Name</Label>
              <Input value={project.name} onChange={(e) => updateProject(index, "name", e.target.value)} placeholder="My Project" className="mt-1" data-testid={`input-project-name-${index}`} />
            </div>
            <div>
              <Label>Your Role</Label>
              <Input value={project.role} onChange={(e) => updateProject(index, "role", e.target.value)} placeholder="Lead Developer" className="mt-1" data-testid={`input-project-role-${index}`} />
            </div>
          </div>
          <div className="mt-4">
            <Label>Description</Label>
            <Textarea value={project.description} onChange={(e) => updateProject(index, "description", e.target.value)} placeholder="Brief description of the project..." rows={2} className="mt-1" data-testid={`input-project-desc-${index}`} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Tools & Technologies</Label>
              <Input value={project.tools} onChange={(e) => updateProject(index, "tools", e.target.value)} placeholder="React, Node.js, PostgreSQL" className="mt-1" data-testid={`input-project-tools-${index}`} />
            </div>
            <div>
              <Label>Link (Optional)</Label>
              <Input value={project.link} onChange={(e) => updateProject(index, "link", e.target.value)} placeholder="github.com/..." className="mt-1" data-testid={`input-project-link-${index}`} />
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={addProject} variant="outline" className="w-full gap-2" data-testid="button-add-project">
        <Plus className="w-4 h-4" /> Add Project
      </Button>
    </div>
  );
}

function FinalizeForm({ data }: { data: ResumeData }) {
  const checks = [
    { label: "Contact information complete", passed: !!(data.profile.fullName && data.profile.email && data.profile.phone) },
    { label: "Professional summary added", passed: !!data.summary.text },
    { label: "At least one work experience", passed: data.experience.length > 0 },
    { label: "Experience has bullet points", passed: data.experience.every(exp => exp.bullets.filter(b => b.trim()).length >= 2) },
    { label: "Education added", passed: data.education.length > 0 },
    { label: "Skills listed", passed: data.skills.length >= 3 },
  ];

  const passedCount = checks.filter(c => c.passed).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-slate-800 mb-2">ATS Readiness Check</h3>
        <p className="text-sm text-slate-600 mb-4">Make sure your resume is optimized to pass Applicant Tracking Systems.</p>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${check.passed ? "bg-green-50" : "bg-amber-50"}`}>
              {check.passed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
              <span className={check.passed ? "text-green-800" : "text-amber-800"}>{check.label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 mt-4">{passedCount} of {checks.length} checks passed</p>
      </div>
    </div>
  );
}

function ExportForm({ resumeId, templateId }: { resumeId?: string; templateId: string }) {
  const { toast } = useToast();
  const template = allTemplates.find(t => t.id === templateId);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!resumeId) {
      toast({ title: "Please save your resume first", variant: "destructive" });
      return;
    }
    
    setIsExporting(true);
    try {
      const response = await fetch(`/api/resumes/${resumeId}/download`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to export");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({ title: "PDF downloaded successfully!" });
    } catch (error: any) {
      toast({ title: error.message || "Failed to export PDF", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpgradeClick = () => {
    window.location.href = "/pricing";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-medium text-slate-800 mb-4">Export Your Resume</h3>
        <div className="space-y-4">
          <Button 
            onClick={handleExportPDF} 
            disabled={isExporting || !resumeId}
            className="w-full justify-between" 
            data-testid="button-export-pdf"
          >
            <span className="flex items-center gap-2">
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? "Generating PDF..." : "Download PDF"}
            </span>
            <Badge variant="secondary">Free (Watermark)</Badge>
          </Button>
          <Button onClick={handleUpgradeClick} variant="outline" className="w-full justify-between" data-testid="button-export-pdf-clean">
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF (No Watermark)
            </span>
            <Badge className="bg-primary">$14.99</Badge>
          </Button>
          <Button onClick={handleUpgradeClick} variant="outline" className="w-full justify-between" data-testid="button-export-docx">
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download DOCX
            </span>
            <Badge className="bg-amber-500 gap-1">
              <Crown className="w-3 h-3" />
              Pro Only
            </Badge>
          </Button>
        </div>
      </Card>

      {template?.isPremium && (
        <Card className="p-6 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Premium Template</h4>
              <p className="text-sm text-amber-700 mt-1">
                You're using a premium template. Upgrade to Pro to export without restrictions.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function BuilderPage() {
  const params = useParams<{ id?: string }>();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const searchParams = new URLSearchParams(search);
  const initialTemplate = searchParams.get("template") || "modern-one";

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResumeData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { data: existingResume, isLoading: resumeLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes", params.id],
    enabled: !!params.id,
  });

  useEffect(() => {
    if (existingResume) {
      setResumeData(existingResume.resumeData);
      if (existingResume.templateId) {
        setSelectedTemplate(existingResume.templateId);
      }
    }
  }, [existingResume]);

  const saveMutation = useMutation({
    mutationFn: async (data: { resumeData: ResumeData; templateId: string; title?: string }) => {
      if (params.id) {
        return apiRequest("PATCH", `/api/resumes/${params.id}`, data);
      } else {
        return apiRequest("POST", "/api/resumes", data);
      }
    },
    onSuccess: (data: any) => {
      setLastSaved(new Date());
      setIsSaving(false);
      if (!params.id && data.id) {
        setLocation(`/builder/${data.id}`, { replace: true });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
    },
    onError: () => {
      setIsSaving(false);
      toast({ title: "Failed to save resume", variant: "destructive" });
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

  const handleDataChange = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, wizardSteps.length - 1)));
  };

  const renderStepContent = () => {
    switch (wizardSteps[currentStep].id) {
      case "template":
        return <TemplateSelector selectedId={selectedTemplate} onSelect={setSelectedTemplate} />;
      case "profile":
        return <ProfileForm data={resumeData} onChange={handleDataChange} />;
      case "summary":
        return <SummaryForm data={resumeData} onChange={handleDataChange} />;
      case "experience":
        return <ExperienceForm data={resumeData} onChange={handleDataChange} />;
      case "education":
        return <EducationForm data={resumeData} onChange={handleDataChange} />;
      case "skills":
        return <SkillsForm data={resumeData} onChange={handleDataChange} />;
      case "projects":
        return <ProjectsForm data={resumeData} onChange={handleDataChange} />;
      case "finalize":
        return <FinalizeForm data={resumeData} />;
      case "export":
        return <ExportForm resumeId={params.id} templateId={selectedTemplate} />;
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 max-w-md text-center">
          <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Sign in to build your resume</h1>
          <p className="text-slate-600 mb-6">Create an account to save your progress and export your resume.</p>
          <a href="/api/login" data-testid="button-login-builder">
            <Button className="w-full">Sign in to continue</Button>
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="gap-2" data-testid="button-back-dashboard">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>

            <div className="flex items-center gap-3">
              {isSaving && (
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              )}
              {lastSaved && !isSaving && (
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  Saved
                </span>
              )}
              <Button onClick={autoSave} variant="outline" size="sm" className="gap-2" data-testid="button-save">
                <Save className="w-4 h-4" />
                Save
              </Button>
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
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button onClick={() => goToStep(currentStep + 1)} disabled={currentStep === wizardSteps.length - 1} className="gap-2" data-testid="button-next-step">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          <div className="hidden lg:block bg-slate-200 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-220px)]">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-700">Live Preview</h3>
                <Badge variant="outline">
                  {allTemplates.find(t => t.id === selectedTemplate)?.name || "Modern One"}
                </Badge>
              </div>
              <div className="transform scale-[0.75] origin-top">
                <ResumePreview data={resumeData} templateId={selectedTemplate} showWatermark={true} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
