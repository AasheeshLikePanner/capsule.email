import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative mx-auto flex min-h-screen w-1/2 flex-col items-center justify-start border-l border-r pt-48">
        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl">
            Stand Out in Every Inbox.
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Create beautiful, AI-powered emails in moments.
          </p>
          {/*
          <div className="mt-12 flex w-full max-w-md items-center space-x-2">
            <Input type="email" placeholder="Email" className="h-9 text-sm" />
            <Button type="submit" variant="default" className="h-9 px-4 text-sm animate-glow">Join Waitlist</Button>
          </div>
          */}
        </div>
      <div className="w-[150%] mt-20 border relative group overflow-hidden">
        <div className="relative transition-opacity transition-transform duration-500 ease-in-out group-hover:opacity-0 scale-100 group-hover:scale-98">
          <Image
            src="/screenshots/chat.png"
            alt="Chat Sidebar Screenshot"
            width={1920}
            height={1280}
            quality={100}
            priority
            draggable={false}
            className="w-full select-none"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="h-20 w-20 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 transition-opacity transition-transform duration-500 ease-in-out opacity-0 group-hover:opacity-100 bg-black scale-102 group-hover:scale-100">
          <iframe
            src="https://player.vimeo.com/video/1107092848?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;color=000000&amp;transparent=0"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title="demo"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
