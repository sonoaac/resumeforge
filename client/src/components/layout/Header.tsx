import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-navy-900">
                Resume<span className="text-primary">Forge</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    href="/builder"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/builder") ? "text-primary" : "text-muted-foreground"
                    }`}
                    data-testid="link-builder"
                  >
                    Builder
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
                    }`}
                    data-testid="link-dashboard"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" data-testid="link-user-profile">
                  <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      {user?.firstName || "User"}
                    </span>
                  </div>
                </Link>
                <a href="/api/logout" data-testid="button-logout">
                  <Button variant="outline" size="sm">
                    Logout
                  </Button>
                </a>
              </div>
            ) : (
              <>
                <a href="/api/login" data-testid="button-login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </a>
                <a href="/api/login" data-testid="button-signup">
                  <Button size="sm">
                    Free Account
                  </Button>
                </a>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium py-2 transition-colors ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    href="/builder"
                    className="text-sm font-medium py-2 text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-builder"
                  >
                    Builder
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium py-2 text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-dashboard"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                {isAuthenticated ? (
                  <a href="/api/logout" data-testid="mobile-button-logout">
                    <Button variant="outline" className="w-full">
                      Logout
                    </Button>
                  </a>
                ) : (
                  <>
                    <a href="/api/login" data-testid="mobile-button-login">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </a>
                    <a href="/api/login" data-testid="mobile-button-signup">
                      <Button className="w-full">
                        Free Account
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
