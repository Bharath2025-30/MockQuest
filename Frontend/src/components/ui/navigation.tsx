import {Link} from "react-router-dom";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import MockQuest from "../logos/mockQuest";

interface ComponentItem {
  title: string;
  href: string;
  description: string;
}

interface MenuItem {
  title: string;
  href?: string;
  isLink?: boolean;
  content?: React.ReactNode;
}

interface NavigationProps {
  menuItems?: MenuItem[];
  features?: ComponentItem[];
  logo?: React.ReactNode;
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
  introItems?: {
    title: string;
    href: string;
    description: string;
  }[];
}

export default function Navigation({
  menuItems = [
    {
      title: "Getting started",
      content: "default",
    },
    {
      title: "Features",
      content: "features",
    },
    {
      title: "Documentation",
      isLink: true,
      href: "",
    },
  ],
  features = [
    {
      title: "Live Video Chat",
      href: "",
      description:
        "Crystal-clear HD video calls that replicate real interview environments, ensuring smooth communication and professional practice.",
    },
    {
      title: "Code Editor",
      href: "",
      description:
        "Collaborative, real-time coding with built-in compiler support, designed for technical interviews and pair programming practice.",
    },
    {
      title: "Multi-Language",
      href: "",
      description:
        "Seamless support for multiple languages and regions, making it easy to prepare for interviews across the globe.",
    },
    {
      title: "Easy Collaboration",
      href: "",
      description:
        "Interactive tools for pair programming, instant chat, and reactions — helping candidates and mentors work together effortlessly.",
    },
    {
      title: "AI Assistance",
      href: "",
      description:
        "Smart guidance with instant feedback, personalized tips, and adaptive support to boost confidence and performance.",
    },
  ],

  logo = <MockQuest />,
  logoTitle = "MockQuest",
  logoDescription = "Everything You Need to Succeed. Powerful features designed to make your coding interviews seamless and productive",
  logoHref = "",
  introItems = [
    {
      title: "Live Code Editor",
      href: "",
      description:
        "Collaborate in real-time with syntax highlighting and multi language support",
    },
    {
      title: "Easy Collaboration",
      href: "",
      description: "Share your screen, discuss solutions, and learn from each other in real-time.",
    },
    {
      title: "HD Video Call",
      href: "",
      description: "Crystal clear video and audio for seamless communication during interviews",
    },
  ],
}: NavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to={item.href || ""}>{item.title}</Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="from-muted/30 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href={logoHref}
                          >
                            {logo}
                            <div className="mt-4 mb-2 text-lg font-medium">
                              {logoTitle}
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              {logoDescription}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {introItems.map((intro, i) => (
                        <ListItem key={i} href={intro.href} title={intro.title}>
                          {intro.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : item.content === "features" ? (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {features.map((feature) => (
                        <ListItem
                          key={feature.title}
                          title={feature.title}
                          href={feature.href}
                        >
                          {feature.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
