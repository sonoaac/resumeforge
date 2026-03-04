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
  layout: "single" | "two-column" | "three-column";
  hasPhoto?: boolean;
}

export const allTemplates: TemplateInfo[] = [
  // ─── RESUME: Single Column ────────────────────────────────────────────────
  { id: "classic-clean", name: "Classic Clean", family: "classic", type: "resume", isPremium: false, isReleased: true, bestFor: "Business, Finance, Law", description: "Left-border section headers with clean typography. ATS-safe.", accentColor: "#1a2332", fontFamily: "Inter", layout: "single" },
  { id: "timeline-left", name: "Timeline", family: "classic", type: "resume", isPremium: false, isReleased: true, bestFor: "Any Industry", description: "Vertical timeline line with circle dots marking each section.", accentColor: "#334155", fontFamily: "Inter", layout: "single" },
  { id: "numbered-sections", name: "Numbered", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "Tech, Product, Creative", description: "Bold 01 02 03 numbers before each section for strong hierarchy.", accentColor: "#374151", fontFamily: "Inter", layout: "single" },
  { id: "minimal-spacious", name: "Minimal Spacious", family: "minimal", type: "resume", isPremium: false, isReleased: true, bestFor: "Consulting, Finance, Legal", description: "Maximum whitespace with hairline dividers. Quiet elegance.", accentColor: "#6b7280", fontFamily: "Inter", layout: "single" },
  { id: "mono-type", name: "Mono Type", family: "creative", type: "resume", isPremium: false, isReleased: true, bestFor: "Engineering, DevOps, Tech", description: "Monospace typewriter aesthetic with === divider lines.", accentColor: "#1f2937", fontFamily: "monospace", layout: "single" },
  { id: "compact-dense", name: "Compact Dense", family: "minimal", type: "resume", isPremium: false, isReleased: true, bestFor: "Senior Professionals", description: "Maximum information density — tight spacing, all on one page.", accentColor: "#1f2937", fontFamily: "Inter", layout: "single" },
  // ─── RESUME: Colored Header ───────────────────────────────────────────────
  { id: "header-band-dark", name: "Dark Header", family: "professional", type: "resume", isPremium: false, isReleased: true, bestFor: "Executive, Management, C-Suite", description: "Bold dark header band with white text. Commanding presence.", accentColor: "#1a2332", fontFamily: "Inter", layout: "single" },
  { id: "header-band-light", name: "Light Band", family: "professional", type: "resume", isPremium: false, isReleased: true, bestFor: "Business, HR, Operations", description: "Soft gray header band with subtle shadow. Professional.", accentColor: "#475569", fontFamily: "Inter", layout: "single" },
  { id: "header-split", name: "Split Header", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "Tech, Product, Strategy", description: "Dark left name panel meets light right contact panel.", accentColor: "#1e3a5f", fontFamily: "Inter", layout: "single" },
  { id: "border-top-accent", name: "Top Stripe", family: "minimal", type: "resume", isPremium: false, isReleased: true, bestFor: "Design, UX, Architecture", description: "Single thick top border, completely clean below. Subtle personality.", accentColor: "#334155", fontFamily: "Inter", layout: "single" },
  { id: "executive-centered", name: "Executive", family: "professional", type: "resume", isPremium: false, isReleased: true, bestFor: "Directors, VPs, C-Suite", description: "Centered name and title flanked by decorative rules.", accentColor: "#1f2937", fontFamily: "Inter", layout: "single" },
  // ─── RESUME: Two-Column Sidebar ───────────────────────────────────────────
  { id: "sidebar-dark-left", name: "Dark Left Sidebar", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "Tech, Engineering, Data", description: "Dark charcoal sidebar with contact and skills. White main area.", accentColor: "#1a2332", fontFamily: "Inter", layout: "two-column" },
  { id: "sidebar-light-left", name: "Light Left Sidebar", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "Marketing, Sales, Communications", description: "Soft gray sidebar with skills, white main area for experience.", accentColor: "#475569", fontFamily: "Inter", layout: "two-column" },
  { id: "sidebar-dark-right", name: "Dark Right Sidebar", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "Finance, Analytics, Risk", description: "Wide main content left, dark sidebar on the right with skills.", accentColor: "#1a2332", fontFamily: "Inter", layout: "two-column" },
  { id: "sidebar-light-right", name: "Light Right Sidebar", family: "minimal", type: "resume", isPremium: false, isReleased: true, bestFor: "Consulting, Strategy, Policy", description: "Wide main area left, warm light sidebar right.", accentColor: "#374151", fontFamily: "Inter", layout: "two-column" },
  { id: "column-break", name: "Column Break", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "Product, Operations, PM", description: "Full-width header and summary, then splits into two columns.", accentColor: "#334155", fontFamily: "Inter", layout: "two-column" },
  // ─── RESUME: Photo Templates ──────────────────────────────────────────────
  { id: "photo-round-top", name: "Photo Round", family: "modern", type: "resume", hasPhoto: true, isPremium: false, isReleased: true, bestFor: "Sales, Hospitality, PR", description: "Circular headshot in the header alongside name and contact.", accentColor: "#1e3a5f", fontFamily: "Inter", layout: "single" },
  { id: "photo-banner", name: "Photo Banner", family: "creative", type: "resume", hasPhoto: true, isPremium: false, isReleased: true, bestFor: "Creative, Media, Design", description: "Dark banner header with embedded circular photo.", accentColor: "#1a2332", fontFamily: "Inter", layout: "single" },
  { id: "photo-sidebar", name: "Photo Sidebar", family: "professional", type: "resume", hasPhoto: true, isPremium: false, isReleased: true, bestFor: "Management, Hospitality, HR", description: "Photo at top of dark left sidebar with contact below.", accentColor: "#1a2332", fontFamily: "Inter", layout: "two-column" },
  { id: "photo-card", name: "Photo Card", family: "modern", type: "resume", hasPhoto: true, isPremium: false, isReleased: true, bestFor: "Real Estate, Customer Success", description: "Photo in a floating card upper-left, contact info beside.", accentColor: "#374151", fontFamily: "Inter", layout: "single" },
  { id: "photo-elegant", name: "Photo Elegant", family: "professional", type: "resume", hasPhoto: true, isPremium: false, isReleased: true, bestFor: "Executive, Law, Finance", description: "Square photo left, right-aligned name block, understated.", accentColor: "#1f2937", fontFamily: "Inter", layout: "single" },
  // ─── RESUME: Special Layouts ──────────────────────────────────────────────
  { id: "two-equal-cols", name: "Two Columns", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "Tech, Data Science, Engineering", description: "50/50 split: experience left, skills and education right.", accentColor: "#334155", fontFamily: "Inter", layout: "two-column" },
  { id: "three-panel", name: "Three Panel", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "Design, Product, Creative", description: "Contact narrow-left | Experience wide-center | Skills narrow-right.", accentColor: "#374151", fontFamily: "Inter", layout: "three-column" },
  { id: "card-sections", name: "Card Sections", family: "creative", type: "resume", isPremium: false, isReleased: true, bestFor: "Marketing, Growth, Design", description: "Each section wrapped in its own card with subtle shadow.", accentColor: "#374151", fontFamily: "Inter", layout: "single" },
  { id: "letter-head", name: "Letterhead", family: "classic", type: "resume", isPremium: false, isReleased: true, bestFor: "Law, Government, Academia", description: "Letterhead-style with right-aligned address block at top.", accentColor: "#1a2332", fontFamily: "Inter", layout: "single" },
  { id: "split-contact", name: "Split Contact", family: "minimal", type: "resume", isPremium: false, isReleased: true, bestFor: "Any Industry", description: "Name and title on the left, contact info aligned to the right.", accentColor: "#374151", fontFamily: "Inter", layout: "single" },
  // ─── RESUME: Visual ───────────────────────────────────────────────────────
  { id: "skill-bars", name: "Skill Bars", family: "creative", type: "resume", isPremium: false, isReleased: true, bestFor: "Tech, Engineering, Creative", description: "Visual horizontal progress bars show skill proficiency levels.", accentColor: "#374151", fontFamily: "Inter", layout: "two-column" },
  { id: "badge-skills", name: "Badge Skills", family: "modern", type: "resume", isPremium: false, isReleased: true, bestFor: "UX, Marketing, Operations", description: "Skills displayed as pill badges in a flexible wrapping grid.", accentColor: "#334155", fontFamily: "Inter", layout: "single" },
  { id: "infographic", name: "Infographic", family: "creative", type: "resume", isPremium: false, isReleased: true, bestFor: "Creative, Design, Media", description: "Visual hierarchy with icon-style bullets and metric highlights.", accentColor: "#1a2332", fontFamily: "Inter", layout: "two-column" },
  { id: "ruled-paper", name: "Ruled Paper", family: "minimal", type: "resume", isPremium: false, isReleased: true, bestFor: "Legal, Banking, Finance", description: "Subtle bottom rule under each entry for clean separation.", accentColor: "#374151", fontFamily: "Inter", layout: "single" },
  // ─── CV: Academic Classic ─────────────────────────────────────────────────
  { id: "academic-formal", name: "Academic Formal", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Academia, Tenure Applications", description: "Traditional centered format with double horizontal rules.", accentColor: "#1e3a5f", fontFamily: "Inter", layout: "single" },
  { id: "professor-elegant", name: "Professor Elegant", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Senior Faculty, Department Heads", description: "Dignified centered layout with em-dash section decorations.", accentColor: "#166534", fontFamily: "Inter", layout: "single" },
  { id: "cv-nordic", name: "Nordic CV", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "European Academia", description: "Ultra-clean Nordic style — large name, abundant whitespace.", accentColor: "#374151", fontFamily: "Inter", layout: "single" },
  { id: "cv-humanities", name: "Humanities", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Literature, Philosophy, History", description: "Wide-margin scholarly layout for humanities and social sciences.", accentColor: "#1a2332", fontFamily: "Inter", layout: "single" },
  { id: "cv-minimal-academic", name: "Minimal Academic", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Established Professors", description: "Absolute minimum styling trusted by senior academics worldwide.", accentColor: "#374151", fontFamily: "Inter", layout: "single" },
  // ─── CV: Two-Column ───────────────────────────────────────────────────────
  { id: "scholar-modern", name: "Scholar Modern", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Graduate, Postdoc, Faculty", description: "Two-column with slate sidebar for contact, skills, and awards.", accentColor: "#475569", fontFamily: "Inter", layout: "two-column" },
  { id: "cv-two-dark-sidebar", name: "Academic Sidebar", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Research PIs, Faculty", description: "Dark sidebar with contact and keywords, clean white main content.", accentColor: "#1a2332", fontFamily: "Inter", layout: "two-column" },
  { id: "cv-photo-academic", name: "Photo Academic", family: "academic", type: "cv", hasPhoto: true, isPremium: false, isReleased: true, bestFor: "International Academia", description: "Circular headshot in sidebar alongside full academic CV.", accentColor: "#334155", fontFamily: "Inter", layout: "two-column" },
  { id: "cv-stem-modern", name: "STEM Modern", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "STEM, Engineering, Life Sciences", description: "Modern two-column format with technical skill grid.", accentColor: "#0f766e", fontFamily: "Inter", layout: "two-column" },
  // ─── CV: Publications / Research ──────────────────────────────────────────
  { id: "research-focused", name: "Research Focused", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Research Scientists, Lab Scientists", description: "Publications and research experience positioned prominently.", accentColor: "#0369a1", fontFamily: "Inter", layout: "single" },
  { id: "cv-publications", name: "Publications First", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Prolific Researchers", description: "Numbered citations [1][2] as the main visual focus.", accentColor: "#1e3a5f", fontFamily: "Inter", layout: "single" },
  { id: "phd-dynamic", name: "PhD Dynamic", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "PhD Students, Postdocs", description: "Split header with bold research trajectory and dynamic bullets.", accentColor: "#5b21b6", fontFamily: "Inter", layout: "single" },
  { id: "cv-grants-first", name: "Grants First", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Research PIs, Grant Writers", description: "Grants and funding highlighted in a prominent top section.", accentColor: "#1a4731", fontFamily: "Inter", layout: "single" },
  // ─── CV: Specialized ──────────────────────────────────────────────────────
  { id: "cv-banner-header", name: "University Banner", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "University Faculty", description: "Bold dark banner header like official university stationery.", accentColor: "#1e3a5f", fontFamily: "Inter", layout: "single" },
  { id: "cv-european", name: "European CV", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "European Institutions, EU Jobs", description: "Table-structured format with labeled rows inspired by Europass.", accentColor: "#1e3a5f", fontFamily: "Inter", layout: "single" },
  { id: "cv-industry", name: "Industry CV", family: "professional", type: "cv", isPremium: false, isReleased: true, bestFor: "Industry Research, R&D, Pharma", description: "Bridges academia and industry. Less formal, results-focused.", accentColor: "#1a2332", fontFamily: "Inter", layout: "single" },
  { id: "cv-interdisciplinary", name: "Interdisciplinary", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Cross-disciplinary Research", description: "Two-column highlighting multiple distinct research areas.", accentColor: "#374151", fontFamily: "Inter", layout: "two-column" },
  // ─── CV: Career Stage ─────────────────────────────────────────────────────
  { id: "cv-postdoc", name: "Postdoc CV", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Postdoctoral Researchers", description: "Research trajectory and publications front and center.", accentColor: "#1e3a5f", fontFamily: "Inter", layout: "single" },
  { id: "cv-lab-pi", name: "Lab PI", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "Principal Investigators", description: "Grants, mentorship, and lab management featured prominently.", accentColor: "#1a4731", fontFamily: "Inter", layout: "single" },
  { id: "cv-comprehensive", name: "Comprehensive", family: "academic", type: "cv", isPremium: false, isReleased: true, bestFor: "All Academic Positions", description: "Complete CV with every section displayed in full detail.", accentColor: "#1a2332", fontFamily: "Inter", layout: "single" },
];

export const templateFamilies = [
  { id: "all",    label: "All" },
  { id: "resume", label: "Resume" },
  { id: "cv",     label: "CV" },
];

export const layoutFilters = [
  { id: "all",          label: "All Layouts" },
  { id: "single",       label: "Single Column" },
  { id: "two-column",   label: "Two Column" },
  { id: "three-column", label: "Three Column" },
];

export const styleFilters = [
  { id: "all",          label: "All Styles" },
  { id: "classic",      label: "Classic" },
  { id: "modern",       label: "Modern" },
  { id: "minimal",      label: "Minimal" },
  { id: "creative",     label: "Creative" },
  { id: "professional", label: "Professional" },
  { id: "academic",     label: "Academic" },
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
