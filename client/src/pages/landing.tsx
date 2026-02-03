import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, Target, Sparkles, ArrowUp, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const stats = [
    { value: "30%", label: "Higher chance of getting a job" },
    { value: "42%", label: "Higher response rate from recruiters" },
  ];

  const features = [
    {
      icon: FileText,
      title: "Professional Templates",
      description: "Customize the design and format of your resume to reflect your personal brand.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Target,
      title: "ATS Optimized",
      description: "Add expert-backed content that targets skills valued by employers in your industry.",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: Sparkles,
      title: "Easy Export",
      description: "Download your resume in PDF or DOCX format with just one click.",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  const companies = [
    "Google", "Amazon", "Microsoft", "Apple", "Meta"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">Resume</span>
                  <span className="text-primary">Forge</span>
                  <br />
                  <span className="text-slate-300">Resume Builder</span>
                </h1>
                <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                  Create your perfect resume from any device with our free Resume Builder. Access ATS-friendly templates and expert tips to get hired fast.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Link href="/templates" data-testid="button-view-templates">
                    <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 w-full sm:w-auto">
                      View templates
                    </Button>
                  </Link>
                  <a href="/api/login" data-testid="button-build-resume">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      Build my resume today
                    </Button>
                  </a>
                </div>

                <div className="space-y-3">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 justify-center lg:justify-start"
                    >
                      <ArrowUp className="w-5 h-5 text-primary" />
                      <span className="text-white font-semibold">{stat.value}</span>
                      <span className="text-slate-400">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="mt-6 flex items-center gap-2 justify-center lg:justify-start"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-400">EXCELLENT</span>
                    <div className="flex">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">17,339 reviews on Trustpilot</span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-64 h-80 bg-white rounded-lg shadow-2xl transform -rotate-6 opacity-90">
                    <div className="p-4">
                      <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                      <div className="h-3 w-24 bg-slate-100 rounded mb-4" />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-5/6 bg-slate-100 rounded" />
                        <div className="h-2 w-4/5 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-8 left-8 w-64 h-80 bg-white rounded-lg shadow-2xl transform rotate-3">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full" />
                        <div>
                          <div className="h-4 w-24 bg-slate-800 rounded mb-1" />
                          <div className="h-3 w-20 bg-slate-300 rounded" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-slate-200 rounded" />
                        <div className="h-3 w-5/6 bg-slate-200 rounded" />
                        <div className="h-2 w-16 bg-primary/30 rounded mt-4" />
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-100 rounded" />
                          <div className="h-2 w-4/5 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-16 left-16 w-64 h-80 bg-white rounded-lg shadow-2xl">
                    <div className="p-4 border-l-4 border-primary">
                      <div className="h-5 w-40 bg-slate-800 rounded mb-2" />
                      <div className="h-3 w-32 bg-primary/50 rounded mb-4" />
                      <div className="space-y-2 mb-4">
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-5/6 bg-slate-100 rounded" />
                        <div className="h-2 w-4/5 bg-slate-100 rounded" />
                      </div>
                      <div className="h-3 w-24 bg-slate-700 rounded mb-2" />
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-3/4 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-6 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              <span className="text-sm text-slate-500">Our customers have been hired at:</span>
              {companies.map((company) => (
                <span key={company} className="text-slate-700 font-semibold text-lg">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-slate-800">42% Higher</span>{" "}
                <span className="text-primary">Recruiter Response Rate</span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our Resume Builder helps you craft tailored applications that stand out to recruiters, earning more responses and accelerating your job search.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <a href="/api/login" data-testid="button-create-resume">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Create a new resume
                </Button>
              </a>
              <Link href="/templates" data-testid="button-browse-templates">
                <Button variant="outline" size="lg">
                  Browse templates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-white">Search Professionally Written</span>
                <br />
                <span className="text-primary">Resume Templates</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                Our resume templates are crafted to showcase sought-after skills and experience in your industry. Choose one for your job title and customize it to your liking.
              </p>

              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for resume templates by job title or industry"
                    className="w-full px-4 py-3 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="input-template-search"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {["Customer Service", "Personal Trainer", "Nurse", "Teacher", "Developer", "Designer", "Manager"].map((job) => (
                  <span
                    key={job}
                    className="px-4 py-2 bg-white/10 rounded-full text-sm text-white border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                    data-testid={`tag-${job.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {job}
                  </span>
                ))}
              </div>

              <Link href="/templates" data-testid="button-view-all-templates">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  View all 60+ resume templates
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-slate-800">Why Choose</span>{" "}
                <span className="text-primary">ResumeForge</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "60+ Templates", description: "Professional designs for every industry" },
                { title: "ATS Friendly", description: "Optimized to pass applicant tracking systems" },
                { title: "Easy to Use", description: "Build your resume in under 10 minutes" },
                { title: "Export Options", description: "Download as PDF or DOCX instantly" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-slate-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                >
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
