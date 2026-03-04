export interface TemplateInfo {
  id: string;
  name: string;
  family: string;
  type: "resume" | "cv";
  isPremium: boolean;
  isReleased: boolean;
  bestFor?: string;
  description: string;
  accentColor: string;
  fontFamily: string;
  layout: "single" | "two-column";
}

export const allTemplates: TemplateInfo[] = [
  // ── Resume Templates ──────────────────────────────────────────────────────
  {
    id: "classic-one",
    name: "Classic One",
    family: "classic",
    type: "resume",
    isPremium: false,
    isReleased: true,
    bestFor: "Business, Finance, Law",
    description: "Clean, traditional layout trusted by hiring managers worldwide.",
    accentColor: "#0A2540",
    fontFamily: "Inter",
    layout: "single",
  },
  {
    id: "modern-slate",
    name: "Modern Slate",
    family: "modern",
    type: "resume",
    isPremium: false,
    isReleased: true,
    bestFor: "Tech, Engineering, Data",
    description: "Contemporary two-column design with a clean sidebar for skills and contact.",
    accentColor: "#0D9488",
    fontFamily: "Inter",
    layout: "two-column",
  },
  {
    id: "executive-bold",
    name: "Executive Bold",
    family: "professional",
    type: "resume",
    isPremium: false,
    isReleased: true,
    bestFor: "Executive, Management, C-Suite",
    description: "Commanding presence with bold centered header and strong visual hierarchy.",
    accentColor: "#7C3AED",
    fontFamily: "Inter",
    layout: "single",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    family: "minimal",
    type: "resume",
    isPremium: false,
    isReleased: true,
    bestFor: "Consulting, Finance, Legal",
    description: "Understated elegance with hairline dividers. Lets your experience speak.",
    accentColor: "#374151",
    fontFamily: "Inter",
    layout: "single",
  },
  {
    id: "creative-vibrant",
    name: "Creative Vibrant",
    family: "creative",
    type: "resume",
    isPremium: false,
    isReleased: true,
    bestFor: "Design, Marketing, Media",
    description: "Bold two-column layout with a colored sidebar that showcases personality.",
    accentColor: "#EA580C",
    fontFamily: "Inter",
    layout: "two-column",
  },

  // ── CV Templates ──────────────────────────────────────────────────────────
  {
    id: "academic-formal",
    name: "Academic Formal",
    family: "academic",
    type: "cv",
    isPremium: false,
    isReleased: true,
    bestFor: "Academia, Research, Tenure",
    description: "Traditional centered format meeting expectations of hiring committees.",
    accentColor: "#1E3A5F",
    fontFamily: "Inter",
    layout: "single",
  },
  {
    id: "research-focused",
    name: "Research Focused",
    family: "academic",
    type: "cv",
    isPremium: false,
    isReleased: true,
    bestFor: "Research, Lab, Science",
    description: "Highlights publications and research with clear numbered citation format.",
    accentColor: "#0369A1",
    fontFamily: "Inter",
    layout: "single",
  },
  {
    id: "scholar-modern",
    name: "Scholar Modern",
    family: "academic",
    type: "cv",
    isPremium: false,
    isReleased: true,
    bestFor: "Graduate, Postdoc, Faculty",
    description: "Two-column modern layout balancing academic depth with visual clarity.",
    accentColor: "#475569",
    fontFamily: "Inter",
    layout: "two-column",
  },
  {
    id: "professor-elegant",
    name: "Professor Elegant",
    family: "academic",
    type: "cv",
    isPremium: false,
    isReleased: true,
    bestFor: "Professor, Teaching, University",
    description: "Dignified and authoritative. Designed for senior academic appointments.",
    accentColor: "#166534",
    fontFamily: "Inter",
    layout: "single",
  },
  {
    id: "phd-dynamic",
    name: "PhD Dynamic",
    family: "academic",
    type: "cv",
    isPremium: false,
    isReleased: true,
    bestFor: "PhD Student, Researcher, Postdoc",
    description: "Modern split-header layout showcasing research trajectory and potential.",
    accentColor: "#5B21B6",
    fontFamily: "Inter",
    layout: "single",
  },
];

export const templateFamilies = [
  { id: "all", label: "All" },
  { id: "resume", label: "Resume" },
  { id: "cv", label: "CV" },
];

export const getTemplateById = (id: string): TemplateInfo | undefined =>
  allTemplates.find((t) => t.id === id);

export const getReleasedTemplates = (): TemplateInfo[] =>
  allTemplates.filter((t) => t.isReleased);

export const getResumeTemplates = (): TemplateInfo[] =>
  allTemplates.filter((t) => t.type === "resume" && t.isReleased);

export const getCVTemplates = (): TemplateInfo[] =>
  allTemplates.filter((t) => t.type === "cv" && t.isReleased);

export const getFreeTemplates = (): TemplateInfo[] =>
  allTemplates.filter((t) => !t.isPremium);

export const getPremiumTemplates = (): TemplateInfo[] =>
  allTemplates.filter((t) => t.isPremium);
