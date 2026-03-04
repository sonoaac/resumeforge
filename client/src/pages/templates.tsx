import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { allTemplates, templateFamilies, type TemplateInfo } from "@/lib/templates";
import { motion } from "framer-motion";

function TemplateCard({ template }: { template: TemplateInfo }) {
  const isComingSoon = !template.isReleased;

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

      <div
        className="aspect-[3/4] bg-gradient-to-b from-slate-50 to-slate-100 p-4 relative overflow-hidden"
        style={{ borderLeft: `4px solid ${template.accentColor}` }}
      >
        <div className="h-full bg-white rounded shadow-sm p-3 text-left">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: `${template.accentColor}20` }}
            />
            <div>
              <div 
                className="h-2.5 w-20 rounded" 
                style={{ backgroundColor: template.accentColor }}
              />
              <div className="h-1.5 w-16 bg-slate-300 rounded mt-1" />
            </div>
          </div>
          <div className="space-y-1.5 mt-3">
            <div className="h-1.5 w-full bg-slate-200 rounded" />
            <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
            <div className="h-1.5 w-4/5 bg-slate-200 rounded" />
          </div>
          <div 
            className="h-1.5 w-16 rounded mt-3" 
            style={{ backgroundColor: `${template.accentColor}60` }}
          />
          <div className="space-y-1 mt-2">
            <div className="h-1 w-full bg-slate-100 rounded" />
            <div className="h-1 w-3/4 bg-slate-100 rounded" />
          </div>
          {template.layout === "two-column" && (
            <div className="absolute right-3 top-12 w-12 space-y-2">
              <div className="h-1 w-full bg-slate-200 rounded" />
              <div className="h-1 w-3/4 bg-slate-200 rounded" />
              <div className="h-1 w-full bg-slate-200 rounded" />
            </div>
          )}
        </div>

        {!isComingSoon && (
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Link href={`/builder?template=${template.id}`} data-testid={`button-use-template-${template.id}`}>
              <Button className="bg-primary hover:bg-primary/90">
                Use Template
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-slate-800">{template.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-slate-500 capitalize">{template.family}</span>
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
