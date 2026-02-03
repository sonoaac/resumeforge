export interface TemplateInfo {
  id: string;
  name: string;
  family: string;
  isPremium: boolean;
  isReleased: boolean;
  bestFor?: string;
  accentColor: string;
  fontFamily: string;
  layout: "single" | "two-column";
}

// Free Templates (20)
const freeTemplates: TemplateInfo[] = [
  // Classic Family (5 free)
  { id: "classic-one", name: "Classic One", family: "classic", isPremium: false, isReleased: true, bestFor: "business", accentColor: "#0A2540", fontFamily: "Inter", layout: "single" },
  { id: "classic-two", name: "Classic Two", family: "classic", isPremium: false, isReleased: true, bestFor: "executive", accentColor: "#1E3A5F", fontFamily: "Merriweather", layout: "single" },
  { id: "classic-three", name: "Classic Three", family: "classic", isPremium: false, isReleased: true, bestFor: "business", accentColor: "#2D3748", fontFamily: "Open Sans", layout: "single" },
  { id: "classic-four", name: "Classic Four", family: "classic", isPremium: false, isReleased: true, bestFor: "manager", accentColor: "#1A365D", fontFamily: "Roboto", layout: "single" },
  { id: "classic-five", name: "Classic Five", family: "classic", isPremium: false, isReleased: true, bestFor: "business", accentColor: "#2C5282", fontFamily: "Lora", layout: "single" },
  
  // Modern Family (5 free)
  { id: "modern-one", name: "Modern One", family: "modern", isPremium: false, isReleased: true, bestFor: "developer", accentColor: "#14B8A6", fontFamily: "Plus Jakarta Sans", layout: "single" },
  { id: "modern-two", name: "Modern Two", family: "modern", isPremium: false, isReleased: true, bestFor: "designer", accentColor: "#6366F1", fontFamily: "Poppins", layout: "single" },
  { id: "modern-three", name: "Modern Three", family: "modern", isPremium: false, isReleased: true, bestFor: "developer", accentColor: "#10B981", fontFamily: "Outfit", layout: "single" },
  { id: "modern-four", name: "Modern Four", family: "modern", isPremium: false, isReleased: true, bestFor: "startup", accentColor: "#8B5CF6", fontFamily: "Space Grotesk", layout: "single" },
  { id: "modern-five", name: "Modern Five", family: "modern", isPremium: false, isReleased: true, bestFor: "designer", accentColor: "#EC4899", fontFamily: "DM Sans", layout: "single" },
  
  // Professional Family (5 free)
  { id: "professional-one", name: "Professional One", family: "professional", isPremium: false, isReleased: true, bestFor: "executive", accentColor: "#0F172A", fontFamily: "Inter", layout: "single" },
  { id: "professional-two", name: "Professional Two", family: "professional", isPremium: false, isReleased: true, bestFor: "manager", accentColor: "#334155", fontFamily: "Roboto", layout: "single" },
  { id: "professional-three", name: "Professional Three", family: "professional", isPremium: false, isReleased: true, bestFor: "business", accentColor: "#1E293B", fontFamily: "Open Sans", layout: "single" },
  { id: "professional-four", name: "Professional Four", family: "professional", isPremium: false, isReleased: true, bestFor: "executive", accentColor: "#0C4A6E", fontFamily: "Montserrat", layout: "single" },
  { id: "professional-five", name: "Professional Five", family: "professional", isPremium: false, isReleased: true, bestFor: "manager", accentColor: "#064E3B", fontFamily: "Lora", layout: "single" },
  
  // Minimal Family (5 free)
  { id: "minimal-one", name: "Minimal One", family: "minimal", isPremium: false, isReleased: true, bestFor: "student", accentColor: "#374151", fontFamily: "Inter", layout: "single" },
  { id: "minimal-two", name: "Minimal Two", family: "minimal", isPremium: false, isReleased: true, bestFor: "student", accentColor: "#4B5563", fontFamily: "Open Sans", layout: "single" },
  { id: "minimal-three", name: "Minimal Three", family: "minimal", isPremium: false, isReleased: true, bestFor: "student", accentColor: "#6B7280", fontFamily: "Roboto", layout: "single" },
  { id: "minimal-four", name: "Minimal Four", family: "minimal", isPremium: false, isReleased: true, bestFor: "student", accentColor: "#52525B", fontFamily: "DM Sans", layout: "single" },
  { id: "minimal-five", name: "Minimal Five", family: "minimal", isPremium: false, isReleased: true, bestFor: "student", accentColor: "#3F3F46", fontFamily: "Outfit", layout: "single" },
];

// Premium Templates (40) - Only 12-18 released for beta
const premiumTemplates: TemplateInfo[] = [
  // Modern Premium (8) - 4 released
  { id: "modern-prime", name: "Modern Prime", family: "modern", isPremium: true, isReleased: true, bestFor: "developer", accentColor: "#0EA5E9", fontFamily: "Plus Jakarta Sans", layout: "two-column" },
  { id: "modern-flow", name: "Modern Flow", family: "modern", isPremium: true, isReleased: true, bestFor: "designer", accentColor: "#7C3AED", fontFamily: "Poppins", layout: "two-column" },
  { id: "modern-edge", name: "Modern Edge", family: "modern", isPremium: true, isReleased: true, bestFor: "developer", accentColor: "#059669", fontFamily: "Space Grotesk", layout: "single" },
  { id: "modern-clean", name: "Modern Clean", family: "modern", isPremium: true, isReleased: true, bestFor: "startup", accentColor: "#2563EB", fontFamily: "Inter", layout: "single" },
  { id: "modern-grid", name: "Modern Grid", family: "modern", isPremium: true, isReleased: false, bestFor: "designer", accentColor: "#DC2626", fontFamily: "Outfit", layout: "two-column" },
  { id: "modern-focus", name: "Modern Focus", family: "modern", isPremium: true, isReleased: false, bestFor: "developer", accentColor: "#0891B2", fontFamily: "DM Sans", layout: "single" },
  { id: "modern-bold", name: "Modern Bold", family: "modern", isPremium: true, isReleased: false, bestFor: "startup", accentColor: "#C026D3", fontFamily: "Montserrat", layout: "single" },
  { id: "modern-sharp", name: "Modern Sharp", family: "modern", isPremium: true, isReleased: false, bestFor: "developer", accentColor: "#0D9488", fontFamily: "Roboto", layout: "single" },
  
  // Professional Premium (8) - 4 released
  { id: "executive-one", name: "Executive One", family: "professional", isPremium: true, isReleased: true, bestFor: "executive", accentColor: "#0F172A", fontFamily: "Playfair Display", layout: "single" },
  { id: "executive-two", name: "Executive Two", family: "professional", isPremium: true, isReleased: true, bestFor: "executive", accentColor: "#1E3A5F", fontFamily: "Libre Baskerville", layout: "single" },
  { id: "executive-three", name: "Executive Three", family: "professional", isPremium: true, isReleased: false, bestFor: "executive", accentColor: "#0C4A6E", fontFamily: "Merriweather", layout: "single" },
  { id: "executive-four", name: "Executive Four", family: "professional", isPremium: true, isReleased: false, bestFor: "executive", accentColor: "#14532D", fontFamily: "Lora", layout: "single" },
  { id: "corporate-one", name: "Corporate One", family: "professional", isPremium: true, isReleased: true, bestFor: "manager", accentColor: "#1E293B", fontFamily: "Inter", layout: "two-column" },
  { id: "corporate-two", name: "Corporate Two", family: "professional", isPremium: true, isReleased: true, bestFor: "manager", accentColor: "#334155", fontFamily: "Roboto", layout: "two-column" },
  { id: "corporate-three", name: "Corporate Three", family: "professional", isPremium: true, isReleased: false, bestFor: "manager", accentColor: "#0F766E", fontFamily: "Open Sans", layout: "single" },
  { id: "corporate-four", name: "Corporate Four", family: "professional", isPremium: true, isReleased: false, bestFor: "manager", accentColor: "#7E22CE", fontFamily: "Montserrat", layout: "single" },
  
  // Creative Premium (8) - 4 released
  { id: "creative-aura", name: "Creative Aura", family: "creative", isPremium: true, isReleased: true, bestFor: "designer", accentColor: "#F43F5E", fontFamily: "Poppins", layout: "two-column" },
  { id: "creative-vision", name: "Creative Vision", family: "creative", isPremium: true, isReleased: true, bestFor: "designer", accentColor: "#A855F7", fontFamily: "Space Grotesk", layout: "two-column" },
  { id: "creative-spark", name: "Creative Spark", family: "creative", isPremium: true, isReleased: true, bestFor: "designer", accentColor: "#F59E0B", fontFamily: "Outfit", layout: "single" },
  { id: "creative-wave", name: "Creative Wave", family: "creative", isPremium: true, isReleased: true, bestFor: "designer", accentColor: "#06B6D4", fontFamily: "DM Sans", layout: "single" },
  { id: "creative-studio", name: "Creative Studio", family: "creative", isPremium: true, isReleased: false, bestFor: "designer", accentColor: "#84CC16", fontFamily: "Plus Jakarta Sans", layout: "two-column" },
  { id: "creative-pulse", name: "Creative Pulse", family: "creative", isPremium: true, isReleased: false, bestFor: "designer", accentColor: "#EF4444", fontFamily: "Montserrat", layout: "single" },
  { id: "creative-form", name: "Creative Form", family: "creative", isPremium: true, isReleased: false, bestFor: "designer", accentColor: "#3B82F6", fontFamily: "Inter", layout: "single" },
  { id: "creative-craft", name: "Creative Craft", family: "creative", isPremium: true, isReleased: false, bestFor: "designer", accentColor: "#14B8A6", fontFamily: "Roboto", layout: "single" },
  
  // Technical Premium (8) - 4 released
  { id: "tech-prime", name: "Tech Prime", family: "technical", isPremium: true, isReleased: true, bestFor: "developer", accentColor: "#22C55E", fontFamily: "JetBrains Mono", layout: "single" },
  { id: "tech-matrix", name: "Tech Matrix", family: "technical", isPremium: true, isReleased: true, bestFor: "developer", accentColor: "#10B981", fontFamily: "Fira Code", layout: "two-column" },
  { id: "tech-logic", name: "Tech Logic", family: "technical", isPremium: true, isReleased: true, bestFor: "developer", accentColor: "#0EA5E9", fontFamily: "Source Code Pro", layout: "single" },
  { id: "tech-build", name: "Tech Build", family: "technical", isPremium: true, isReleased: true, bestFor: "developer", accentColor: "#6366F1", fontFamily: "IBM Plex Mono", layout: "single" },
  { id: "tech-frame", name: "Tech Frame", family: "technical", isPremium: true, isReleased: false, bestFor: "developer", accentColor: "#8B5CF6", fontFamily: "Roboto Mono", layout: "two-column" },
  { id: "tech-vector", name: "Tech Vector", family: "technical", isPremium: true, isReleased: false, bestFor: "developer", accentColor: "#14B8A6", fontFamily: "Space Mono", layout: "single" },
  { id: "tech-signal", name: "Tech Signal", family: "technical", isPremium: true, isReleased: false, bestFor: "developer", accentColor: "#F97316", fontFamily: "Geist Mono", layout: "single" },
  { id: "tech-code", name: "Tech Code", family: "technical", isPremium: true, isReleased: false, bestFor: "developer", accentColor: "#EC4899", fontFamily: "Fira Code", layout: "single" },
  
  // Minimal Premium (8) - 2 released
  { id: "minimal-soft", name: "Minimal Soft", family: "minimal", isPremium: true, isReleased: true, bestFor: "student", accentColor: "#64748B", fontFamily: "Inter", layout: "single" },
  { id: "minimal-pure", name: "Minimal Pure", family: "minimal", isPremium: true, isReleased: true, bestFor: "student", accentColor: "#71717A", fontFamily: "Open Sans", layout: "single" },
  { id: "minimal-light", name: "Minimal Light", family: "minimal", isPremium: true, isReleased: false, bestFor: "student", accentColor: "#78716C", fontFamily: "Roboto", layout: "single" },
  { id: "minimal-calm", name: "Minimal Calm", family: "minimal", isPremium: true, isReleased: false, bestFor: "student", accentColor: "#57534E", fontFamily: "DM Sans", layout: "single" },
  { id: "minimal-zen", name: "Minimal Zen", family: "minimal", isPremium: true, isReleased: false, bestFor: "student", accentColor: "#44403C", fontFamily: "Outfit", layout: "single" },
];

export const allTemplates: TemplateInfo[] = [...freeTemplates, ...premiumTemplates];

export const templateFamilies = [
  { id: "all", label: "All Templates" },
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "professional", label: "Professional" },
  { id: "creative", label: "Creative" },
  { id: "technical", label: "Technical" },
  { id: "minimal", label: "Minimal" },
];

export const getTemplateById = (id: string): TemplateInfo | undefined => {
  return allTemplates.find((t) => t.id === id);
};

export const getReleasedTemplates = (): TemplateInfo[] => {
  return allTemplates.filter((t) => t.isReleased);
};

export const getFreeTemplates = (): TemplateInfo[] => {
  return allTemplates.filter((t) => !t.isPremium);
};

export const getPremiumTemplates = (): TemplateInfo[] => {
  return allTemplates.filter((t) => t.isPremium);
};
