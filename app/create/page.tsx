"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Palette, Smile, ShoppingCart, Mail, Newspaper, Receipt, X } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { BrandKitDialog } from "@/components/brand-kit-dialog";
import { useRouter } from "next/navigation";


interface BrandKit {
  id: string;
  kit_name: string;
  logo_primary: string | null;
  // Add other brand kit properties as needed
}


export default function CreatePage() {
  const [emailContent, setEmailContent] = useState(""); 
  const [animatedContent, setAnimatedContent] = useState(""); 
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); 
  const [isBrandKitDialogOpen, setIsBrandKitDialogOpen] = useState(false);
  const [selectedBrandKit, setSelectedBrandKit] = useState<BrandKit | null>(null);
  const router = useRouter();

  const [placeholderSuffix, setPlaceholderSuffix] = useState("");
  const [currentSuffixIndex, setCurrentSuffixIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0); 

  const placeholderSuffixes = useMemo(() => [
    "welcome user...",
    "announce...",
    "showcase...",
    "congratulate...",
    "offer...",
    "remind...",
    "gathering feedback on user..."
  ], []);
  const TYPING_SPEED = 100; 
  const DELETING_SPEED = 50; 
  const PAUSE_BEFORE_NEXT = 1500; 

  useEffect(() => {
    const currentFullSuffix = placeholderSuffixes[currentSuffixIndex];

    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      if (charIndex < currentFullSuffix.length) {
        timeoutId = setTimeout(() => {
          setPlaceholderSuffix(currentFullSuffix.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, TYPING_SPEED);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_BEFORE_NEXT);
      }
    } else {
      if (charIndex > 0) {
        timeoutId = setTimeout(() => {
          setPlaceholderSuffix(currentFullSuffix.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, DELETING_SPEED);
      } else {
        setIsDeleting(false);
        setCurrentSuffixIndex((prev) => (prev + 1) % placeholderSuffixes.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, currentSuffixIndex, placeholderSuffixes]);

  useEffect(() => {
    if (animatedContent) { 
      let i = 0;
      if (animatedContent.length > 0) {
        setEmailContent(animatedContent.charAt(0)); 
        i = 1; 
      } else {
        setEmailContent(""); 
      }
      if (typingTimeoutRef.current) {
        clearInterval(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setInterval(() => {
        if (i < animatedContent.length) {
          setEmailContent((prev) => prev + animatedContent.charAt(i));
          i++;
        } else {
          if (typingTimeoutRef.current) {
            clearInterval(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
        }
      }, 20); 
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearInterval(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [animatedContent]); 

  const handleButtonClick = (type: string) => {
    let content = "";
    switch (type) {
      case "welcome":
        content = "Welcome email for greeting a new user. Personalize with their name and thank them for joining. Include a CTA to complete setup.";
        break;
      case "e-commerce":
        content = "Recommendation email featuring four premium coffee products. Highlight one product with a badge and include descriptions, and a CTA to shop now. High-end, luxury, and exclusive style.";
        break;
      case "invite":
        content = "Invitation email for joining a team. Mention the inviter, invitee, and team name. Include both a button and a link to accept the invite. Use black and white colors, Apple UI style, minimal, rounded corners, super modern.";
        break;
      case "newsletter":
        content = "Newsletter email with five movie recommendations. Highlight one movie with a badge and include brief descriptions for each. Cyberpunk style.";
        break;
      case "invoice":
        content = "Invoice email confirming a recent purchase. Include the order number, itemized breakdown, total cost, and a button to download the invoice. Scandinavian Design style.";
        break;
      case "cart":
        content = "Write a reminder email for an abandoned cart.";
        break;
      default:
        content = "";
    }
    setAnimatedContent(content); 
  };

  const handleSendMessage = () => {
    if (emailContent.trim()) {
      const chatId = Date.now().toString();
      const promptData = {
        emailContent,
        brandKit: selectedBrandKit,
      };
      router.push(`/chats/${chatId}?prompt=${encodeURIComponent(JSON.stringify(promptData))}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4">
      <h1 className="text-4xl font-bold text-center mb-3 tracking-tight">Build your dream email</h1>
      <p className="text-lg text-center text-muted-foreground mb-8 max-w-xl">
        Create beautiful email templates using natural language.
      </p>
      
      <div className="w-full max-w-2xl relative rounded-2xl border border-input bg-muted/20 flex flex-col p-4">
        <Textarea
          placeholder={`Write an email to ${selectedBrandKit ? selectedBrandKit.kit_name : placeholderSuffix}`}
          className="w-full h-40 text-base p-3 pr-20 rounded-lg resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          value={emailContent}
          onChange={(e) => {
            if (typingTimeoutRef.current) {
              clearInterval(typingTimeoutRef.current);
              typingTimeoutRef.current = null;
            }
            setAnimatedContent(""); 
            setEmailContent(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <div className="absolute bottom-4 left-4">
          {selectedBrandKit ? (
            <Button
              variant="ghost"
              className="flex items-center gap-1 h-9 rounded-lg px-3 text-sm"
              onClick={() => setSelectedBrandKit(null)}
            >
              <X className="h-4 w-4" />
              {selectedBrandKit.logo_primary && (
                <Image
                  src={selectedBrandKit.logo_primary}
                  alt={`${selectedBrandKit.kit_name} Logo`}
                  width={16}
                  height={16}
                  className="object-contain"
                />
              )}
              {selectedBrandKit.kit_name}
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="flex items-center gap-1 h-9 rounded-lg px-3 text-sm"
              onClick={() => setIsBrandKitDialogOpen(true)}
            >
              <Palette className="h-4 w-4" />
              Brand Kit
            </Button>
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-lg"
            onClick={handleSendMessage}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <BrandKitDialog
        isOpen={isBrandKitDialogOpen}
        onOpenChange={setIsBrandKitDialogOpen}
        onSelectBrandKit={setSelectedBrandKit}
      />
          
      <div className="w-full max-w-3xl flex flex-nowrap justify-center gap-2 mt-4 overflow-x-auto pb-2">
          <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("welcome")}>
            <Smile className="h-4 w-4" />
            Welcome
          </Button>
          <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("e-commerce")}>
            <ShoppingCart className="h-4 w-4" />
            E-commerce
          </Button>
          <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("invite")}>
            <Mail className="h-4 w-4" />
            Invite
          </Button>
          <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("newsletter")}>
            <Newspaper className="h-4 w-4" />
            Newsletter
          </Button>
          <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("invoice")}>
            <Receipt className="h-4 w-4" />
            Invoice
          </Button>
          <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("cart")}>
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Button>
        </div>
    </div>
  );
}