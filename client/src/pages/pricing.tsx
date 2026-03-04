import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Unlimited resumes & CVs",
  "10 professionally designed templates",
  "Resume & academic CV builder",
  "Real-time live preview",
  "PDF export — no watermarks",
  "ATS-friendly layouts",
  "Auto-save",
  "5 resume templates + 5 CV templates",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-slate-800">100% Free.</span>{" "}
              <span className="text-primary">Always.</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Everything you need to build a standout resume or academic CV — completely free, with no watermarks and no subscriptions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-8 border-primary border-2 shadow-xl">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-primary mb-1">$0</div>
                <div className="text-slate-500">forever · no credit card needed</div>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/onboarding">
                <Button className="w-full" size="lg">
                  Build my resume — free
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
