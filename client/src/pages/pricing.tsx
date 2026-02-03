import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  buttonText: string;
  buttonVariant: "default" | "outline";
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with your job search",
    features: [
      "1 resume",
      "20 free templates",
      "Real-time preview",
      "PDF export with watermark",
      "Auto-save",
      "Basic ATS checks",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline",
  },
  {
    name: "Export Pack",
    price: "$14.99",
    period: "one-time",
    description: "Remove watermark and export your resume professionally",
    features: [
      "Everything in Free",
      "Clean PDF export (no watermark)",
      "All 60 templates",
      "ATS optimization tips",
      "Priority support",
    ],
    badge: "Popular",
    highlighted: true,
    buttonText: "Buy Export Pack",
    buttonVariant: "default",
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "Unlimited access for serious job seekers",
    features: [
      "Everything in Export Pack",
      "Unlimited resumes",
      "DOCX export",
      "Public resume links",
      "Duplicate resumes for each job",
      "Cover letter builder",
      "Advanced ATS analysis",
    ],
    badge: "Best Value",
    buttonText: "Start Pro Monthly",
    buttonVariant: "default",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your job search needs. Start free and upgrade when you're ready to export.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 h-full flex flex-col relative ${
                    tier.highlighted
                      ? "border-primary border-2 shadow-lg"
                      : "border-slate-200"
                  }`}
                >
                  {tier.badge && (
                    <Badge
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 ${
                        tier.badge === "Best Value"
                          ? "bg-amber-500"
                          : "bg-primary"
                      }`}
                    >
                      {tier.badge === "Best Value" ? (
                        <Crown className="w-3 h-3 mr-1" />
                      ) : (
                        <Zap className="w-3 h-3 mr-1" />
                      )}
                      {tier.badge}
                    </Badge>
                  )}

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">
                      {tier.name}
                    </h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-800">
                        {tier.price}
                      </span>
                      <span className="text-slate-500">{tier.period}</span>
                    </div>
                    <p className="text-slate-600 text-sm mt-2">
                      {tier.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/api/login"
                    data-testid={`button-pricing-${tier.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <Button
                      variant={tier.buttonVariant}
                      className="w-full"
                      size="lg"
                    >
                      {tier.buttonText}
                    </Button>
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-slate-600">4.8/5 from 17,000+ reviews</span>
            </div>
            <p className="text-slate-500 text-sm">
              30-day money-back guarantee on all paid plans
            </p>
          </motion.div>

          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-2xl mx-auto space-y-6">
              {[
                {
                  q: "Can I try ResumeForge for free?",
                  a: "Yes! Our free plan includes 1 resume, 20 templates, and PDF export with a small watermark. No credit card required.",
                },
                {
                  q: "What's the difference between Export Pack and Pro?",
                  a: "Export Pack is a one-time purchase for clean PDF exports. Pro is a monthly subscription that adds unlimited resumes, DOCX export, public links, and more.",
                },
                {
                  q: "Can I cancel my Pro subscription anytime?",
                  a: "Absolutely! Cancel anytime through your account settings. You'll keep access until the end of your billing period.",
                },
                {
                  q: "Are the templates ATS-friendly?",
                  a: "Yes, all our templates are designed to pass Applicant Tracking Systems. We also provide ATS optimization tips to improve your chances.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 border border-slate-200"
                >
                  <h3 className="font-semibold text-slate-800 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
