"use client"
import { useState, useEffect, useRef, memo } from "react";
import { useParams } from 'next/navigation';
import BrandKitForm from "@/components/brand-kit-form";
import EmailPreview from "@/components/email-preview";
import Image from "next/image";
const MemoizedEmailPreview :any= memo(EmailPreview);
import { cn } from "@/lib/utils";
import { Building, FileText, Palette, Users, BadgeInfo } from 'lucide-react';
import { Suspense } from 'react';

const navItems = [
  {
    id: "brand-details",
    label: "Brand Details",
    icon: Building,
    isHeader: false,
  },
  {
    label: "Content",
    isHeader: true,
    subItems: [
      { id: "legal", label: "Legal", icon: FileText },
      { id: "social", label: "Social", icon: Users },
    ],
  },
  {
    label: "Visuals",
    isHeader: true,
    subItems: [
      { id: "logos", label: "Logos", icon: BadgeInfo },
      { id: "colors", label: "Colors", icon: Palette },
    ],
  },
];


export default function EmailEditorContent() {
  const params = useParams();
  const brandKitId = params.brandKitId as string;

  const [brandKit, setBrandKit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brandKitId) {
      setIsLoading(false);
      setError("Brand Kit ID is missing.");
      return;
    }

    const fetchBrandKit = async () => {
      try {
        const response = await fetch(`/api/brand-kit/${brandKitId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch brand kit: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        
        setBrandKit(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandKit();
  }, [brandKitId]);

  const [activeSection, setActiveSection] = useState("brand-details");
  const mainContentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const mainContent: any = mainContentRef.current;
      if (!mainContent) return;

      const scrollPosition = mainContent.scrollTop;
      let currentActiveId: string = "";

      const allSectionIds = navItems.flatMap((item:any) =>
        item.isHeader ? item.subItems.map((sub:any) => sub.id) : [item.id]
      );

      for (const sectionId of allSectionIds) {
        const element = document.getElementById(sectionId);
        if (
          element &&
          element.offsetTop <= scrollPosition + mainContent.clientHeight / 2
        ) {
          currentActiveId = sectionId;
        }
      }

      setActiveSection(currentActiveId);
    };

    const mainContent: any = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Image
          src="/icon.svg"
          alt="Loading Spinner"
          width={64}
          height={64}
          className="animate-spin"
        />
        <p className="mt-4 text-lg font-semibold text-foreground">Loading brand kit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <p className="text-lg font-semibold">Error: {error}</p>
        <p>Please ensure the Brand Kit ID is valid and try again.</p>
      </div>
    );
  }

  if (!brandKit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-muted-foreground">
        <p className="text-lg font-semibold">Brand Kit not found.</p>
        <p>Please check the URL or create a new brand kit.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 lg:p-8 gap-4">
      <div className="w-1/6 lg:w-64 p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">Email Editor</h1>
        <nav className="space-y-1">
          {navItems.map((item:any) => (
            <div key={item.id || item.label}>
              {item.isHeader ? (
                <div>
                  <h2 className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wider px-3 pt-4 pb-1">
                    {item.label}
                  </h2>
                  <div className="space-y-1">
                    {item.subItems.map((subItem:any) => (
                      <a
                        key={subItem.id}
                        href={`#${subItem.id}`}
                        className={cn(
                          "flex items-center gap-3 font-medium text-sm whitespace-nowrap rounded-md px-3 py-2",
                          activeSection === subItem.id
                            ? "bg-accent text-primary font-semibold"
                            : "text-muted-foreground hover:bg-accent hover:text-primary"
                        )}
                      >
                        <subItem.icon size={16} />
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "flex items-center gap-3 font-medium text-sm whitespace-nowrap rounded-md px-3 py-2",
                    activeSection === item.id
                      ? "bg-accent text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-primary"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </a>
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
