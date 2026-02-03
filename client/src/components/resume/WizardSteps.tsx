import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface WizardStepsProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function WizardSteps({ steps, currentStep, onStepClick }: WizardStepsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
              isCurrent && "bg-primary text-primary-foreground",
              isCompleted && "bg-primary/10 text-primary",
              !isCurrent && !isCompleted && "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
            data-testid={`wizard-step-${step.id}`}
          >
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-xs",
              isCurrent && "bg-white/20",
              isCompleted && "bg-primary text-white",
              !isCurrent && !isCompleted && "bg-slate-300 text-slate-600"
            )}>
              {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
