import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { allTemplates, type TemplateInfo } from "@/lib/templates";
import { Crown, Check } from "lucide-react";

const ACCENT_COLORS = [
  "#1e3a5f", "#14B8A6", "#3B82F6", "#8B5CF6", "#EC4899", 
  "#F59E0B", "#10B981", "#6366F1", "#F97316", "#06B6D4"
];

interface OnboardingData {
  experienceLevel: string | null;
  isStudent: string | null;
  educationLevel: string | null;
}

export default function SelectTemplate() {
  const [, setLocation] = useLocation();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo | null>(null);
  const [selectedColor, setSelectedColor] = useState(ACCENT_COLORS[0]);
  const [compareMode, setCompareMode] = useState(false);
  const [filters, setFilters] = useState({
    withPhoto: false,
    withoutPhoto: false,
    oneColumn: false,
    twoColumns: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("resumeforge_onboarding");
    if (stored) {
      setOnboardingData(JSON.parse(stored));
    }
  }, []);

  const getHeadlineText = () => {
    if (!onboardingData?.experienceLevel) {
      return "Best templates for jobseekers";
    }
    switch (onboardingData.experienceLevel) {
      case "none":
        return "Best templates for jobseekers with little experience";
      case "less3":
        return "Best templates for early career professionals";
      case "3to5":
        return "Best templates for mid-level professionals";
      case "5to10":
        return "Best templates for senior professionals";
      case "10plus":
        return "Best templates for executive professionals";
      default:
        return "Best templates for jobseekers";
    }
  };

  const getFilteredTemplates = () => {
    let filtered = allTemplates.filter((t: TemplateInfo) => t.isReleased);
    
    if (filters.oneColumn && !filters.twoColumns) {
      filtered = filtered.filter((t: TemplateInfo) => t.layout === "single");
    } else if (filters.twoColumns && !filters.oneColumn) {
      filtered = filtered.filter((t: TemplateInfo) => t.layout === "two-column");
    }
    
    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();
  const recommendedTemplates = filteredTemplates.slice(0, 3);
  const otherTemplates = filteredTemplates.slice(3);

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    
    localStorage.setItem("resumeforge_selected_template", JSON.stringify({
      templateId: selectedTemplate.id,
      accentColor: selectedColor,
    }));
    
    setLocation("/builder/new");
  };

  const handleChooseLater = () => {
    localStorage.setItem("resumeforge_selected_template", JSON.stringify({
      templateId: "classic-one",
      accentColor: ACCENT_COLORS[0],
    }));
    setLocation("/builder/new");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-[#1e3a5f]">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-white">
            Resume<span className="text-primary">Forge</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {getHeadlineText()}
          </h1>
          <p className="text-muted-foreground">
            You can always change your template later.
          </p>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">COMPARE TEMPLATES</span>
                <Switch
                  checked={compareMode}
                  onCheckedChange={setCompareMode}
                  data-testid="switch-compare"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-3">Filters</h3>
                <button 
                  className="text-sm text-primary hover:underline mb-4"
                  onClick={() => setFilters({ withPhoto: false, withoutPhoto: false, oneColumn: false, twoColumns: false })}
                  data-testid="button-clear-filters"
                >
                  Clear filters
                </button>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">HEADSHOT</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.withPhoto}
                          onCheckedChange={(checked) => setFilters({ ...filters, withPhoto: !!checked })}
                          data-testid="checkbox-with-photo"
                        />
                        <span className="text-sm">With photo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.withoutPhoto}
                          onCheckedChange={(checked) => setFilters({ ...filters, withoutPhoto: !!checked })}
                          data-testid="checkbox-without-photo"
                        />
                        <span className="text-sm">Without photo</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">COLUMNS</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.oneColumn}
                          onCheckedChange={(checked) => setFilters({ ...filters, oneColumn: !!checked })}
                          data-testid="checkbox-one-column"
                        />
                        <span className="text-sm">1 column</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.twoColumns}
                          onCheckedChange={(checked) => setFilters({ ...filters, twoColumns: !!checked })}
                          data-testid="checkbox-two-columns"
                        />
                        <span className="text-sm">2 columns</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTemplates.map((template: TemplateInfo, index: number) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  selectedColor={selectedColor}
                  onSelect={() => setSelectedTemplate(template)}
                  onColorChange={setSelectedColor}
                  recommended={index < 3}
                />
              ))}
              {otherTemplates.map((template: TemplateInfo) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  selectedColor={selectedColor}
                  onSelect={() => setSelectedTemplate(template)}
                  onColorChange={setSelectedColor}
                  recommended={false}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
          <div className="container mx-auto flex justify-end gap-4">
            <Button 
              variant="ghost" 
              onClick={handleChooseLater}
              data-testid="button-choose-later"
            >
              Choose later
            </Button>
            <Button
              onClick={handleUseTemplate}
              disabled={!selectedTemplate}
              data-testid="button-use-template"
            >
              Use this template
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

interface TemplateCardProps {
  template: TemplateInfo;
  isSelected: boolean;
  selectedColor: string;
  onSelect: () => void;
  onColorChange: (color: string) => void;
  recommended: boolean;
}

function TemplateCard({ template, isSelected, selectedColor, onSelect, onColorChange, recommended }: TemplateCardProps) {
  return (
    <div className="space-y-3">
      <Card
        className={`relative cursor-pointer transition-all overflow-hidden ${
          isSelected ? "ring-2 ring-primary" : "hover:shadow-lg"
        }`}
        onClick={onSelect}
        data-testid={`card-template-${template.id}`}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
        
        {template.isPremium && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          </div>
        )}
        
        {recommended && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <Badge className="w-full justify-center bg-[#1e3a5f] text-white">
              RECOMMENDED
            </Badge>
          </div>
        )}

        <div 
          className="aspect-[8.5/11] bg-white p-4"
          style={{ borderLeft: `4px solid ${isSelected ? selectedColor : template.accentColor}` }}
        >
          <div className="h-full flex flex-col">
            <div className="text-center mb-3">
              <div 
                className="text-sm font-bold uppercase tracking-wide"
                style={{ color: isSelected ? selectedColor : template.accentColor }}
              >
                Jessica Claire
              </div>
              <div className="text-[8px] text-gray-400 mt-1">
                Professional Summary
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="h-1.5 bg-gray-100 rounded w-full"></div>
              <div className="h-1.5 bg-gray-100 rounded w-4/5"></div>
              <div className="h-1.5 bg-gray-100 rounded w-3/4"></div>
              
              <div className="pt-2">
                <div 
                  className="text-[8px] font-bold uppercase mb-1"
                  style={{ color: isSelected ? selectedColor : template.accentColor }}
                >
                  Experience
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-100 rounded w-full"></div>
                  <div className="h-1 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-1 bg-gray-100 rounded w-4/5"></div>
                </div>
              </div>
              
              <div className="pt-2">
                <div 
                  className="text-[8px] font-bold uppercase mb-1"
                  style={{ color: isSelected ? selectedColor : template.accentColor }}
                >
                  Skills
                </div>
                <div className="flex flex-wrap gap-1">
                  <div className="h-1 bg-gray-100 rounded w-8"></div>
                  <div className="h-1 bg-gray-100 rounded w-10"></div>
                  <div className="h-1 bg-gray-100 rounded w-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {isSelected && (
        <div className="flex justify-center gap-1.5">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              className={`w-5 h-5 rounded-full transition-transform ${
                selectedColor === color ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.stopPropagation();
                onColorChange(color);
              }}
              data-testid={`button-color-${color.replace("#", "")}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
