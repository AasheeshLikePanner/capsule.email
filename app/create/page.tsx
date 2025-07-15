"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Palette, Smile, ShoppingCart, Mail, Newspaper, Receipt } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { BrandKitDialog } from "@/components/brand-kit-dialog";

export default function CreatePage() {
  const [emailContent, setEmailContent] = useState(""); // This will hold the actual content of the textarea
  const [animatedContent, setAnimatedContent] = useState(""); // This will hold the content to be animated
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the typing interval ID
  const [isBrandKitDialogOpen, setIsBrandKitDialogOpen] = useState(false);

  // State for animated placeholder
  const [placeholderSuffix, setPlaceholderSuffix] = useState("");
  const [currentSuffixIndex, setCurrentSuffixIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0); // Index of character in the current suffix

  const placeholderSuffixes = [
    "welcome user...",
    "announce...",
    "showcase...",
    "congratulate...",
    "offer...",
    "remind...",
    "gathering feedback on user..."
  ];
  const TYPING_SPEED = 100; // Speed for typing characters
  const DELETING_SPEED = 50; // Speed for deleting characters
  const PAUSE_BEFORE_NEXT = 1500; // Pause before typing next phrase

  useEffect(() => {
    const currentFullSuffix = placeholderSuffixes[currentSuffixIndex];

    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase
      if (charIndex < currentFullSuffix.length) {
        timeoutId = setTimeout(() => {
          setPlaceholderSuffix(currentFullSuffix.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, TYPING_SPEED);
      } else {
        // Done typing, pause before deleting
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_BEFORE_NEXT);
      }
    } else {
      // Deleting phase
      if (charIndex > 0) {
        timeoutId = setTimeout(() => {
          setPlaceholderSuffix(currentFullSuffix.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, DELETING_SPEED);
      } else {
        // Done deleting, move to next suffix
        setIsDeleting(false);
        setCurrentSuffixIndex((prev) => (prev + 1) % placeholderSuffixes.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, currentSuffixIndex, placeholderSuffixes]); // Dependencies for the animation loop

  useEffect(() => {
    if (animatedContent) { // Only animate if there's content to animate
      let i = 0;
      if (animatedContent.length > 0) {
        setEmailContent(animatedContent.charAt(0)); // Set the first character immediately
        i = 1; // Start animation from the second character
      } else {
        setEmailContent(""); // If animatedContent is empty, clear the input
      }
      // Clear any existing timeout to prevent multiple animations
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
      }, 20); // Adjust typing speed here (milliseconds per character)
    }

    // Cleanup function for useEffect
    return () => {
      if (typingTimeoutRef.current) {
        clearInterval(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [animatedContent]); // Dependency on animatedContent

  const handleButtonClick = (type: string) => {
    let content = "";
    switch (type) {
      case "welcome":
        content = "Write a welcome email for new users.";
        break;
      case "e-commerce":
        content = "Draft an e-commerce promotional email for a new product.";
        break;
      case "invite":
        content = "Create an invitation email for an event.";
        break;
      case "newsletter":
        content = "Generate content for a weekly newsletter.";
        break;
      case "invoice":
        content = "Prepare an email for sending an invoice.";
        break;
      case "cart":
        content = "Write a reminder email for an abandoned cart.";
        break;
      default:
        content = "";
    }
    setAnimatedContent(content); // Set content to be animated
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4">
      <h1 className="text-4xl font-bold text-center mb-3 tracking-tight">Build your dream email</h1>
      <p className="text-lg text-center text-muted-foreground mb-8 max-w-xl">
        Create beautiful email templates using natural language.
      </p>
      
      <div className="w-full max-w-2xl relative rounded-2xl border border-input bg-muted/20 flex flex-col p-4">
        <Textarea
          placeholder={`Write an email to ${placeholderSuffix}`}
          className="w-full h-40 text-base p-3 pr-20 rounded-lg resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          value={emailContent}
          onChange={(e) => {
            // Clear any ongoing animation when user starts typing
            if (typingTimeoutRef.current) {
              clearInterval(typingTimeoutRef.current);
              typingTimeoutRef.current = null;
            }
            setAnimatedContent(""); // Clear animated content
            setEmailContent(e.target.value);
          }}
        />
        <div className="absolute bottom-4 left-4">
          <Button
            variant="ghost"
            className="flex items-center gap-1 h-9 rounded-lg px-3 text-sm"
            onClick={() => setIsBrandKitDialogOpen(true)}
          >
            <Palette className="h-4 w-4" />
            Brand Kit
          </Button>
        </div>
        <div className="absolute bottom-4 right-4">
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-lg"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <BrandKitDialog
        isOpen={isBrandKitDialogOpen}
        onOpenChange={setIsBrandKitDialogOpen}
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