import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Microscope, GraduationCap, Globe } from "lucide-react";

type CVRole = "researcher" | "professor" | "postdoc" | "phd" | "other";

const roles: { id: CVRole; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "researcher",  label: "Researcher",           description: "Postdoctoral or industry research",      icon: <Microscope  className="w-6 h-6" /> },
  { id: "professor",   label: "Professor / Faculty",  description: "Academic faculty position",              icon: <BookOpen    className="w-6 h-6" /> },
  { id: "postdoc",     label: "Postdoctoral Fellow",  description: "Transitioning from PhD",                 icon: <GraduationCap className="w-6 h-6" /> },
  { id: "phd",         label: "PhD Student",          description: "Graduate student applying for programs", icon: <GraduationCap className="w-6 h-6" /> },
  { id: "other",       label: "Other Academic",       description: "Other academic or research role",        icon: <Globe       className="w-6 h-6" /> },
];

export default function CVOnboardingPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<CVRole | null>(null);

  const handleRoleSelect = (role: CVRole) => {
    setSelectedRole(role);
    setTimeout(() => {
      localStorage.setItem("resumeforge_cv_onboarding", JSON.stringify({ role }));
      setLocation("/cv-builder/new");
    }, 300);
  };

  const steps = [
    // Step 0: intro
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <BookOpen className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-3">Build Your Academic CV</h1>
      <p className="text-slate-600 max-w-md mx-auto mb-8">
        A CV (Curriculum Vitae) is the standard document for academic positions, research roles, and grant applications. It's comprehensive — no length limit.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 text-left mb-8 max-w-xl mx-auto">
        {[
          { label: "Publications",   desc: "Journal articles, conference papers, books" },
          { label: "Research",       desc: "Research positions & project descriptions" },
          { label: "Teaching",       desc: "Courses taught and teaching philosophy" },
        ].map((item) => (
          <div key={item.label} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="font-semibold text-slate-800 mb-1">{item.label}</p>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
      <Button size="lg" onClick={() => setStep(1)} className="gap-2">
        Get started <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>,

    // Step 1: role
    <motion.div
      key="role"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">What best describes you?</h2>
      <p className="text-slate-500 text-center mb-6">We'll pre-fill your CV with the most relevant sample content.</p>
      <div className="space-y-3 max-w-md mx-auto">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
              selectedRole === role.id
                ? "border-primary bg-primary/5"
                : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {role.icon}
            </div>
            <div>
              <p className="font-medium text-slate-800">{role.label}</p>
              <p className="text-sm text-slate-500">{role.description}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl p-8 shadow-lg">
        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </Card>
    </div>
  );
}
