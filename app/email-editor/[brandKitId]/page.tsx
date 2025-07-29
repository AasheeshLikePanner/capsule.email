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
import { Button  } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import axios from "axios";

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
        const response = await axios.get(`/api/brand-kit/${brandKitId}`);
        setBrandKit(response.data);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandKit();
  }, [brandKitId]);

  const handleUpdateBrandKit = async () => {
    if (!brandKit || !brandKit.id) {
      toast.error("No brand kit selected for update.");
      console.error("No brand kit or brand kit ID found.");
      return;
    }

    const formData = new FormData();

    for (const key in brandKit) {
      if (brandKit.hasOwnProperty(key)) {
        if (key === "logo_primary" && brandKit[key] instanceof File) {
          formData.append(key, brandKit[key]);
        } else if (Array.isArray(brandKit[key])) {
          formData.append(key, JSON.stringify(brandKit[key]));
        } else if (typeof brandKit[key] === "object" && brandKit[key] !== null) {
          formData.append(key, JSON.stringify(brandKit[key]));
        } else {
          formData.append(key, brandKit[key]);
        }
      }
    }

    try {
      const response = await axios.put(`/api/brand-kit/${brandKit.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Brand kit updated successfully!");
    } catch (err: any) {
      console.error("Error updating brand kit:", err.response?.data || err.message || err);
      toast.error(err.response?.data?.error || err.message || "An unexpected error occurred during update.");
    }
  };

  const [activeSection, setActiveSection] = useState("brand-details");
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const populateSectionRefs = () => {
      navItems.forEach((item: any) => {
        if (item.isHeader) {
          item.subItems.forEach((subItem: any) => {
            sectionRefs.current[subItem.id] = document.getElementById(subItem.id);
          });
        } else {
          sectionRefs.current[item.id] = document.getElementById(item.id);
        }
      });
    };

    // Defer population to ensure elements are rendered
    const timeoutId = setTimeout(populateSectionRefs, 0);

    const handleScroll = () => {
      const mainContent = mainContentRef.current;
      if (!mainContent) return;

      const scrollPosition = mainContent.scrollTop;
      let currentActiveId: string = "";

      const allSectionIds = navItems.flatMap((item:any) =>
        item.isHeader ? item.subItems.map((sub:any) => sub.id) : [item.id]
      );

      // Iterate in reverse to find the section closest to the top of the viewport
      for (let i = allSectionIds.length - 1; i >= 0; i--) {
        const sectionId = allSectionIds[i];
        const element = sectionRefs.current[sectionId]; // Use stored ref
        if (element) {
          const elementOffsetTop = element.offsetTop;

          // If the section is visible and its top is at or above the scroll container's top
          // Add a small buffer (e.g., 10px) to make the highlighting feel more natural
          if (elementOffsetTop <= scrollPosition + 10) {
            currentActiveId = sectionId;
            
            break; // Found the highest visible section, so break
          }
          
        }
      }

      if (currentActiveId && activeSection !== currentActiveId) {
        
        setActiveSection(currentActiveId);
      }
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
      handleScroll(); // Call handleScroll once on mount to set initial active section
    }

    return () => {
      clearTimeout(timeoutId);
      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [navItems, activeSection]);

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
    <div className="flex flex-col lg:flex-row h-screen p-4 lg:p-8 gap-4 relative">
      <Toaster />
      <div className="flex flex-grow-[1] flex-shrink-0">
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
                          "flex items-center gap-3 font-medium text-sm whitespace-nowrap rounded-md px-3 py-2 transition-colors duration-200 ease-in-out",
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
                    "flex items-center gap-3 font-medium text-sm whitespace-nowrap rounded-md px-3 py-2 transition-colors duration-200 ease-in-out",
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
        className="overflow-y-auto h-full border-r shadow-sm border-l border-border relative flex-grow-[3] flex-shrink-0"
      >
        <h1 className="text-lg font-medium mb-4 ml-5">{brandKit.kit_name}</h1>
        <BrandKitForm brandKit={brandKit} setBrandKit={setBrandKit} />
      </div>
      </div>
      <div className="h-full lg:w-5/12 flex flex-col relative">
        <div className="flex justify-end mb-4">
          <Button onClick={handleUpdateBrandKit}>Save</Button>
        </div>
        <div className="flex-grow relative overflow-y-auto">
          <MemoizedEmailPreview brandKit={brandKit} className="h-full" />
        </div>
      </div>
    </div>
  );
}
