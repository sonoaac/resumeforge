import { Link } from "wouter";
import { FileText } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    resumes: [
      { label: "Resume Builder", href: "/builder" },
      { label: "Resume Templates", href: "/templates" },
      { label: "Resume Examples", href: "/templates" },
    ],
    resources: [
      { label: "Career Center", href: "#" },
      { label: "Resume Tips", href: "#" },
    ],
    support: [
      { label: "About Us", href: "#" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQs", href: "#" },
      { label: "Contact", href: "#" },
    ],
  };

  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="footer-link-home">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">
                Resume<span className="text-primary">Forge</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              ResumeForge's professional templates are designed to help you create your perfect resume and reach your career goals.
            </p>
            <a href="/builder" className="inline-block" data-testid="footer-button-build">
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-md font-medium transition-colors">
                Build my resume
              </button>
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Resumes</h3>
            <ul className="space-y-3">
              {footerLinks.resumes.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Facebook"
                data-testid="footer-social-facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="X"
                data-testid="footer-social-x"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
                data-testid="footer-social-linkedin"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Instagram"
                data-testid="footer-social-instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <Link href="#" className="hover:text-white transition-colors" data-testid="footer-link-privacy">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors" data-testid="footer-link-terms">
                Terms & Conditions
              </Link>
              <span>&copy; {currentYear} ResumeForge. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
