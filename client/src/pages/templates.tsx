import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { allTemplates, templateFamilies, type TemplateInfo } from "@/lib/templates";
import { TemplateThumbnail } from "@/components/resume/TemplateThumbnail";
import type { ResumeData } from "@shared/schema";
import { motion } from "framer-motion";

// ── Preview sample data shown in all template thumbnails ──────────────────────
const resumePreviewData: ResumeData = {
  documentType: "resume",
  profile: {
    fullName: "Sonoaac Mark",
    professionalTitle: "Software Developer",
    email: "sonoaac@email.com",
    phone: "0000000000",
    city: "Brooklyn",
    state: "NY",
    country: "USA",
    linkedIn: "linkedin.com/in/sonoaacmark",
    portfolio: "sonoaac.dev",
    website: "",
  },
  summary: {
    headline: "Software Developer",
    text: "Versatile software developer with 5+ years of experience building web applications and IT support systems. Passionate about clean code and great user experiences.",
  },
  experience: [
    {
      id: "p1",
      jobTitle: "Software Developer",
      company: "Tech Studio NYC",
      location: "Brooklyn, NY",
      startDate: "2021-03",
      endDate: "",
      isCurrent: true,
      bullets: [
        "Built responsive web applications for 20+ clients",
        "Led frontend development with React and TypeScript",
        "Improved site performance by 45% through optimization",
      ],
    },
    {
      id: "p2",
      jobTitle: "IT Support Specialist",
      company: "Digital Agency",
      location: "New York, NY",
      startDate: "2019-06",
      endDate: "2021-02",
      isCurrent: false,
      bullets: [
        "Developed interactive UI components",
        "Collaborated with design team on user flows",
      ],
    },
  ],
  education: [
    {
      id: "e1",
      degree: "B.S. Computer Science",
      fieldOfStudy: "Computer Science",
      school: "City University of New York",
      location: "New York, NY",
      startDate: "2015-09",
      endDate: "2019-05",
      isCurrent: false,
      honors: "",
    },
  ],
  skills: [
    { id: "s1", name: "React", level: "expert" },
    { id: "s2", name: "TypeScript", level: "advanced" },
    { id: "s3", name: "Node.js", level: "advanced" },
    { id: "s4", name: "CSS / Tailwind", level: "expert" },
    { id: "s5", name: "PostgreSQL", level: "intermediate" },
  ],
  projects: [
    {
      id: "pr1",
      name: "ResumeForge",
      role: "Lead Developer",
      description: "Full-stack resume builder with 50+ templates",
      startDate: "2023-01",
      endDate: "",
      tools: "React, TypeScript, Express",
      link: "",
    },
  ],
  certifications: [],
  awards: [],
  languages: [],
  customSections: [],
  publications: [],
  research: [],
  teaching: [],
  presentations: [],
  grants: [],
  references: [],
};

const cvPreviewData: ResumeData = {
  documentType: "cv",
  profile: {
    fullName: "Sonoaac Mark",
    professionalTitle: "Research Scholar",
    email: "sonoaac@edu.com",
    phone: "0000000000",
    city: "Brooklyn",
    state: "NY",
    country: "USA",
    linkedIn: "",
    portfolio: "sonoaac.edu",
    website: "",
  },
  summary: {
    headline: "Research Scholar",
    text: "Academic researcher with expertise in computational methods and interdisciplinary studies. Published in peer-reviewed journals with experience in grant writing and graduate instruction.",
  },
  experience: [],
  education: [
    {
      id: "e1",
      degree: "Ph.D. Computer Science",
      fieldOfStudy: "Computer Science",
      school: "City University of New York",
      location: "New York, NY",
      startDate: "2018-09",
      endDate: "2023-05",
      isCurrent: false,
      honors: "",
    },
    {
      id: "e2",
      degree: "B.S. Computer Science",
      fieldOfStudy: "Computer Science",
      school: "CUNY Brooklyn College",
      location: "Brooklyn, NY",
      startDate: "2014-09",
      endDate: "2018-05",
      isCurrent: false,
      honors: "Summa Cum Laude",
    },
  ],
  skills: [
    { id: "s1", name: "Python", level: "expert" },
    { id: "s2", name: "R", level: "advanced" },
    { id: "s3", name: "Machine Learning", level: "advanced" },
    { id: "s4", name: "Data Analysis", level: "expert" },
  ],
  projects: [],
  certifications: [],
  awards: [
    { id: "a1", name: "Best Paper Award", awardingBody: "ACM Conference", date: "2022-06", description: "" },
  ],
  languages: [
    { id: "l1", name: "English", proficiency: "native" },
    { id: "l2", name: "French", proficiency: "conversational" },
  ],
  customSections: [],
  publications: [
    { id: "pub1", title: "Neural Networks in Context", authors: "Mar, S. et al.", journal: "Journal of AI Research", year: "2022", doi: "", type: "journal" },
    { id: "pub2", title: "Computational Linguistics Survey", authors: "Mar, S., Smith, J.", journal: "NLP Conference", year: "2021", doi: "", type: "conference" },
  ],
  research: [
    { id: "r1", title: "Computational Linguistics Lab", institution: "CUNY", supervisor: "Dr. Smith", startDate: "2019-01", endDate: "", isCurrent: true, description: "Analysis of transformer-based language models" },
  ],
  teaching: [
    { id: "t1", course: "Intro to Programming", role: "Teaching Assistant", institution: "CUNY", startDate: "2018-09", endDate: "2020-05", isCurrent: false, description: "" },
  ],
  presentations: [
    { id: "pres1", title: "Deep Learning in NLP", event: "ACM Symposium", location: "New York, NY", date: "2022-04", type: "oral" },
  ],
  grants: [],
  references: [],
};

// ── Template card with real HTML preview ─────────────────────────────────────
function TemplateCard({ template }: { template: TemplateInfo }) {
  const isComingSoon = !template.isReleased;
  const previewData = template.type === "cv" ? cvPreviewData : resumePreviewData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {isComingSoon && (
        <div className="absolute inset-0 bg-slate-900/60 z-10 flex items-center justify-center">
          <Badge variant="secondary" className="bg-white text-slate-800 px-4 py-1.5">
            Coming Soon
          </Badge>
        </div>
      )}

      {/* Perfect-scaled thumbnail — matches full preview exactly */}
      <div className="relative">
        <TemplateThumbnail data={previewData} templateId={template.id} />

        {!isComingSoon && (
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
            <Link href={`/builder?template=${template.id}`} data-testid={`button-use-template-${template.id}`}>
              <Button className="bg-primary hover:bg-primary/90">
                Use Template
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100">
        <h3 className="font-medium text-slate-800 text-sm truncate">{template.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-slate-500 capitalize">{template.family}</span>
          {template.bestFor && (
            <Badge variant="outline" className="text-xs capitalize">
              {template.bestFor}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [selectedFamily, setSelectedFamily] = useState("all");

  const filteredTemplates = allTemplates.filter((template) => {
    if (selectedFamily === "resume" && template.type !== "resume") return false;
    if (selectedFamily === "cv" && template.type !== "cv") return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose from our library of customizable{" "}
            <span className="text-primary">resume templates</span> professionally designed to help you create a polished resume for every job you apply for.
          </p>
        </div>
      </section>

      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {templateFamilies.map((family) => (
                <Button
                  key={family.id}
                  variant={selectedFamily === family.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFamily(family.id)}
                  data-testid={`filter-${family.id}`}
                >
                  {family.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{filteredTemplates.length} templates — all free</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500">No templates match your filters.</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedFamily("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
