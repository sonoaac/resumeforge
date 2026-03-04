import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type ExperienceLevel = "none" | "less3" | "3to5" | "5to10" | "10plus" | null;
type StudentStatus = "yes" | "no" | null;
type EducationLevel = "highschool" | "associates" | "bachelors" | "masters" | "somecollege" | "vocational" | null;

interface OnboardingData {
  experienceLevel: ExperienceLevel;
  isStudent: StudentStatus;
  educationLevel: EducationLevel;
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"intro" | "experience" | "student" | "education">("intro");
  const [data, setData] = useState<OnboardingData>({
    experienceLevel: null,
    isStudent: null,
    educationLevel: null,
  });

  const handleExperienceSelect = (level: ExperienceLevel) => {
    setData({ ...data, experienceLevel: level });
    if (level === "none") {
      setStep("student");
    } else {
      saveAndNavigate({ ...data, experienceLevel: level });
    }
  };

  const handleStudentSelect = (isStudent: StudentStatus) => {
    setData({ ...data, isStudent });
    if (isStudent === "yes") {
      setStep("education");
    } else {
      saveAndNavigate({ ...data, isStudent });
    }
  };

  const handleEducationSelect = (level: EducationLevel) => {
    const finalData = { ...data, educationLevel: level };
    setData(finalData);
    saveAndNavigate(finalData);
  };

  const saveAndNavigate = (onboardingData: OnboardingData) => {
    localStorage.setItem("resumeforge_onboarding", JSON.stringify(onboardingData));
    setLocation("/builder/new");
  };

  return (
    <div className="min-h-screen bg-[#1e3a5f]">
      <header className="border-b border-white/10 bg-[#1e3a5f]">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-white">
            Resume<span className="text-primary">Forge</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                  <h2 className="text-4xl font-bold mb-8">
                    Just three<br />
                    <span className="text-primary">easy</span> steps
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold">
                          <span className="text-primary">Select</span> a template from our library of professional designs
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold">
                          <span className="text-primary">Build</span> your resume with our industry-specific bullet points
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold">
                          <span className="text-primary">Customize</span> the details and wrap it up. You're ready to send!
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="mt-8 w-full md:w-auto px-12"
                    onClick={() => setStep("experience")}
                    data-testid="button-next-intro"
                  >
                    Next
                  </Button>
                </div>

                <div className="hidden md:block">
                  <Card className="p-6 bg-white transform rotate-2 shadow-2xl">
                    <div className="border-b pb-4 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">OMAR DAHAN</h3>
                      <p className="text-sm text-gray-500">Professional Summary</p>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p>Experienced professional with a strong background in delivering results...</p>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {step === "experience" && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="p-8 md:p-12 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
                  How long have you been working?
                </h2>
                <p className="text-center text-gray-500 mb-8">
                  We'll find the best templates for your experience level.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { value: "none" as const, label: "No Experience" },
                    { value: "less3" as const, label: "Less Than 3 Years" },
                    { value: "3to5" as const, label: "3-5 Years" },
                    { value: "5to10" as const, label: "5-10 Years" },
                    { value: "10plus" as const, label: "10+ Years" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={data.experienceLevel === option.value ? "default" : "outline"}
                      size="lg"
                      className="min-w-[140px]"
                      onClick={() => handleExperienceSelect(option.value)}
                      data-testid={`button-experience-${option.value}`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {step === "student" && (
            <motion.div
              key="student"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="p-8 md:p-12 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
                  Are you a student?
                </h2>

                <div className="flex justify-center gap-4">
                  <Button
                    variant={data.isStudent === "yes" ? "default" : "outline"}
                    size="lg"
                    className="min-w-[120px]"
                    onClick={() => handleStudentSelect("yes")}
                    data-testid="button-student-yes"
                  >
                    Yes
                  </Button>
                  <Button
                    variant={data.isStudent === "no" ? "default" : "outline"}
                    size="lg"
                    className="min-w-[120px]"
                    onClick={() => handleStudentSelect("no")}
                    data-testid="button-student-no"
                  >
                    No
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === "education" && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="p-8 md:p-12 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
                  What education level are you currently pursuing?
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  Select the highest level you are working toward so we can organize your resume correctly.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { value: "highschool" as const, label: "High School or GED" },
                    { value: "associates" as const, label: "Associates" },
                    { value: "bachelors" as const, label: "Bachelors" },
                    { value: "masters" as const, label: "Masters or Higher" },
                    { value: "somecollege" as const, label: "Some College" },
                    { value: "vocational" as const, label: "Vocational" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={data.educationLevel === option.value ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleEducationSelect(option.value)}
                      data-testid={`button-education-${option.value}`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                <button 
                  className="block mx-auto mt-4 text-primary hover:underline text-sm"
                  onClick={() => handleEducationSelect(null)}
                  data-testid="button-prefer-not-answer"
                >
                  Prefer not to answer
                </button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
