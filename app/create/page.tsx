"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Briefcase, Smile, ShoppingCart, Mail, Newspaper, Receipt, X } from "lucide-react";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { BrandKitDialog } from "@/components/brand-kit-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe } from "@/components/magicui/globe";
import { generateEmailAndCreateChat } from "@/lib/actions/chat";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


interface BrandKit {
  id: string;
  kit_name: string;
  logo_primary: string | null;
}

function CreatePageContent() {
  const [emailContent, setEmailContent] = useState(""); 
  const [animatedContent, setAnimatedContent] = useState(""); 
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); 
  const [isBrandKitDialogOpen, setIsBrandKitDialogOpen] = useState(false);
  const [selectedBrandKit, setSelectedBrandKit] = useState<BrandKit | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("welcome")) {
      setShowWelcomeCard(true);
    }
  }, [searchParams]);

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

  const handleSendMessage = async () => {
    if (emailContent.trim() && !isLoading) {
      setIsLoading(true);
      try {
        const response = await generateEmailAndCreateChat(emailContent, selectedBrandKit, '', '');
        console.log(response);
        
        if (response.chatId) {
          router.push(`/chats/${response.chatId}`);
        } else {
          console.error("No chatId received from API");
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Error sending message:", error);
        const errorMessage = error.message || "AI limit exceeded. Please try again after some time.";
        toast.error(errorMessage);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {showWelcomeCard && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center">
          <Card className="sm:max-w-lg">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setShowWelcomeCard(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Image
                src="/welcome.png"
                alt="Welcome background"
                width={1024}
                height={512}
                className="rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>Welcome to Capsule!</CardTitle>
              <CardDescription>
                We're excited to have you on board. Here are a few things you can do:
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>It's free to use! You can create unlimited brand kits and have unlimited chats with our AI, subject to daily API limits.</p>
              <p className="mt-2">Get started by creating a new email template using natural language.</p>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="relative flex flex-col items-center justify-center p-4 z-10 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-center mb-3 text-white tracking-normal">Build your dream email</h1>
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
            disabled={isLoading}
          />
          <div className="absolute bottom-4 left-4">
            {selectedBrandKit ? (
              <Button
                variant="ghost"
                className="flex items-center gap-1 h-9 rounded-lg px-3 text-sm"
                onClick={() => setSelectedBrandKit(null)}
                disabled={isLoading}
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
                disabled={isLoading}
              >
                <Briefcase className="h-4 w-4" />
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
              disabled={isLoading}
            >
              {isLoading ? (
                <Image src="/loader.svg" alt="loading" width={16} height={16} className="h-7 w-7 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <BrandKitDialog
          isOpen={isBrandKitDialogOpen}
          onOpenChange={setIsBrandKitDialogOpen}
          onSelectBrandKit={setSelectedBrandKit}
        />
            
        <div className="w-full max-w-3xl flex flex-wrap justify-center gap-2 mt-4 pb-2">
            <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("welcome")} disabled={isLoading}>
              <Smile className="h-4 w-4" />
              Welcome
            </Button>
            <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("e-commerce")} disabled={isLoading}>
              <ShoppingCart className="h-4 w-4" />
              E-commerce
            </Button>
            <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("invite")} disabled={isLoading}>
              <Mail className="h-4 w-4" />
              Invite
            </Button>
            <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("newsletter")} disabled={isLoading}>
              <Newspaper className="h-4 w-4" />
              Newsletter
            </Button>
            <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("invoice")} disabled={isLoading}>
              <Receipt className="h-4 w-4" />
              Invoice
            </Button>
            <Button variant="outline" className="rounded-full h-9 px-3 text-sm gap-1 flex-shrink-0 border border-input bg-muted/20 text-white" onClick={() => handleButtonClick("cart")} disabled={isLoading}>
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Button>
          </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[100vh] overflow-hidden -z-0 opacity-50">
        <Globe className="w-full top-auto bottom-0 translate-y-[50%]" />
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePageContent />
    </Suspense>
  );
}