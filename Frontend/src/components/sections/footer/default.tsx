import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Footer,
  FooterBottom,
} from "../../ui/footer";
import { ModeToggle } from "../../ui/mode-toggle";
import MockQuest from "../../logos/mockQuest";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showModeToggle?: boolean;
  className?: string;
}

export default function FooterSection({
  logo = <MockQuest/>,
  name = "Mock Quest",
  copyright = "© 2025 Bharath Mokara. All rights reserved",
  policies = [
    { text: "Privacy Policy", href: "" },
    { text: "Terms of Service", href: "" },
  ],
  showModeToggle = false,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-background w-full px-4 py-6", className)}>
      <div className="max-w-container mx-auto relative">
        <Footer>
          <FooterBottom>
            {/* Mobile and Desktop Layout */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
              {/* Left Side: Logo and Copyright */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                {/* Logo and Name */}
                <div className="flex items-center gap-2">
                  {logo}
                  <h3 className="text-xl font-bold">{name}</h3>
                </div>

                {/* Copyright */}
                <div className="text-sm text-muted-foreground">{copyright}</div>
              </div>

              {/* Right Side: Policies and Mode Toggle */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {policies.map((policy, index) => (
                  <a
                    key={index}
                    href={policy.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {policy.text}
                  </a>
                ))}
                {showModeToggle && <ModeToggle />}
              </div>
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
