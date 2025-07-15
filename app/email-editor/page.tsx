"use client";
import { useState, useEffect, useRef, memo } from "react";
import BrandKitForm from "@/components/brand-kit-form";
import EmailPreview from "@/components/email-preview";
const MemoizedEmailPreview = memo(EmailPreview);
import { cn } from "@/lib/utils";
import { Building, FileText, Palette, Users, BadgeInfo } from 'lucide-react';

 const navItems = [
    { id: "brand-details", label: "Brand Details", icon: Building },
    {
      id: "content",
      label: "Content",
      subItems: [
        { id: "legal", label: "Legal", icon: FileText },
        { id: "social", label: "Social", icon: Users },
      ],
    },
    {
      id: "visuals",
      label: "Visuals",
      subItems: [
        { id: "logos", label: "Logos", icon: BadgeInfo },
        { id: "colors", label: "Colors", icon: Palette },
      ],
    },
  ];

export default function EmailEditor() {
  const [brandKit, setBrandKit] = useState({
    kitName: "Notch Clipboard",
    website: "https://notchclip.vercel.app/",
    brandSummary:
      " Notch Clipboard is a modern, minimalist clipboard management tool with a clean design aesthetic. The brand emphasizes simplicity and efficiency with a focus on fast and easy clipboard access. The visual style features a white/light background with subtle gradients, rounded corners, and a sophisticated color palette dominated by dark grays and blacks for text and UI elements.",
    address: "123 Main Street, City, Country",
    toneOfVoice: "Friendly",
    copyright: "Add your copyright notice",
    footer: "Add standard footer text that appears in every email",
    disclaimers: "Add any disclaimers or legal information needed",
    socials: "",
    logos: {
      primary: "https://notchclip.vercel.app/icon.png",
      icon: "",
    },
    colors: {
      background: "#ffffff",
      container: "#f0f0f0",
      accent: "#000000",
      buttonText: "#ffffff",
      foreground: "#000000",
    },
  });

  const [activeSection, setActiveSection] = useState("brand-details");
  const mainContentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const mainContent:any = mainContentRef.current;
      if (!mainContent) return;

      const scrollPosition = mainContent.scrollTop;
      let currentActiveId = "";

      // Iterate through all possible section IDs (including sub-items)
      const allSectionIds = navItems.flatMap(item =>
        item.subItems ? [item.id, ...item.subItems.map(sub => sub.id)] : [item.id]
      );

      for (const sectionId of allSectionIds) {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition + mainContent.clientHeight / 2) {
          currentActiveId = sectionId;
        }
      }

      // Determine the section to highlight in the nav
      setActiveSection(currentActiveId);
    };

    const mainContent:any = mainContentRef.current;
    mainContent.addEventListener("scroll", handleScroll);

    return () => {
      mainContent.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]);

 

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 lg:p-8 gap-4">
      <div className="w-1/6 lg:w-64 p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">Email Editor</h1>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <div key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap",
                  activeSection === item.id
                    ? "text-foreground font-semibold"
                    : item.id === "brand-details"
                      ? "text-sm text-muted-foreground hover:text-foreground"
                      : "text-xs text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon ? <item.icon size={16}/> : <div className="w-4 h-4"/>}
                {item.label}
              </a>
              {item.subItems && (
                <div className="ml-6 mt-2 space-y-3">
                  {item.subItems.map((subItem) => (
                    <a
                      key={subItem.id}
                      href={`#${subItem.id}`}
                      className={cn(
                        "flex items-center gap-2 font-semibold text-base hover:text-foreground whitespace-nowrap",
                        activeSection === subItem.id ? "text-foreground font-semibold" : "text-muted-foreground"
                      )}
                    >
                      <subItem.icon size={20}/>
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div
        ref={mainContentRef}
        className="flex-grow-[2] overflow-y-auto h-full rounded-lg shadow-sm border-l border-border"
      >
        <h1 className="text-lg font-medium mb-4 ml-5">Brand Name</h1>
        <BrandKitForm brandKit={brandKit} setBrandKit={setBrandKit} />
      </div>
      <div className="w-full lg:w-5/12 rounded-xl shadow-sm border-l border-border">
        <MemoizedEmailPreview brandKit={brandKit} />
      </div>
    </div>
  );
}
