'use client';

import Link from "next/link";
import {
  Home,
  PlusCircle,
  Palette,
  CircleUser,
  HelpCircle,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";

interface SidebarProps {
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export function Sidebar({ isExpanded, setExpanded }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/brand-kit", icon: Palette, label: "Brand Kit" },
  ];

  const bottomNavItems = [
    { href: "/help", icon: HelpCircle, label: "Help" },
    { href: "/profile", icon: CircleUser, label: "Profile" },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-[width] ease-in-out duration-300 sm:flex",
        isExpanded ? "w-56" : "w-16"
      )}
    >
      <div
        className={cn(
          "flex items-center",
          isExpanded ? "h-[60px] justify-start px-3" : "h-[60px] justify-center"
        )}
      >
        <Link
          href="#"
          className={cn(
            "group flex items-center gap-2 font-semibold text-white ",
            isExpanded ? "rounded-md px-3 py-2" : "h-9 w-9 shrink-0 justify-center rounded-full bg-primary md:h-8 md:w-8"
          )}
        >
          <Image src="/icon.svg" alt="Brand Co Logo" width={40} height={40}/>
          <span
            className={cn(
              `whitespace-nowrap transition-opacity ease-in-out duration-200`,
              isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
            aria-hidden={!isExpanded}
          >
            Brand Co
          </span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-2">
        <Link
          href="/create"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-accent",
            pathname === "/create" && "bg-accent text-accent-foreground",
            !isExpanded && "justify-center"
          )}
        >
          <PlusCircle className="h-5 w-5 shrink-0" />
          <span
            className={cn(
              `whitespace-nowrap transition-opacity ease-in-out duration-200`,
              isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
            aria-hidden={!isExpanded}
          >
            Create New
          </span>
        </Link>
        <div className="my-2 border-t" />
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-accent",
              pathname === item.href && "bg-accent text-accent-foreground",
              !isExpanded && "justify-center"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                `whitespace-nowrap transition-opacity ease-in-out duration-200`,
                isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              )}
              aria-hidden={!isExpanded}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col gap-2 p-2">
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary",
            isExpanded ? "justify-start" : "justify-center"
          )}
          onClick={() => setExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <PanelLeft className="h-5 w-5 shrink-0" />
          ) : (
            <PanelRight className="h-5 w-5 shrink-0" />
          )}
          <span
            className={cn(
              `whitespace-nowrap transition-opacity ease-in-out duration-200`,
              isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
            aria-hidden={!isExpanded}
          >
            Collapse
          </span>
        </Button>
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-accent",
              !isExpanded && "justify-center"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                `whitespace-nowrap transition-opacity ease-in-out duration-200`,
                isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              )}
              aria-hidden={!isExpanded}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}


