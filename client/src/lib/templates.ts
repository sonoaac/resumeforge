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

// Single template (all other color variants removed)
const freeTemplates: TemplateInfo[] = [
  { id: "classic-one", name: "Classic One", family: "classic", isPremium: false, isReleased: true, bestFor: "business", accentColor: "#0A2540", fontFamily: "Inter", layout: "single" },
];

export const allTemplates: TemplateInfo[] = [...freeTemplates];

export const templateFamilies = [
  { id: "all", label: "All Templates" },
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
