'use client'
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react"; // Import useState
import DotPattern from "./dot-pattern";

export function Hero() {
  const [isPlaying, setIsPlaying] = useState(false); // Add isPlaying state

  return (
    <div className="relative mx-auto flex min-h-screen w-1/2 flex-col items-center justify-start border-l border-r pt-48">
      <DotPattern opacity={0.5}/>
        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <div className="mb-4">
            <div className="inline-block bg-secondary text-secondary-foreground py-1 px-3 rounded-full text-sm animate-shine">
              Everything free, unlimited free to use
            </div>
          </div>
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
      <div className="w-[150%] mt-20 border relative overflow-hidden" style={{ paddingBottom: '76%' }}> {/* Increased paddingBottom very little */}
        {!isPlaying ? ( // Conditionally render image and play button
          <div className="absolute inset-0 cursor-pointer flex items-center justify-center " onClick={() => setIsPlaying(true)}>
            <Image
              src="/screenshots/chat.png"
              alt="Chat Sidebar Screenshot"
              width={1920}
              height={1280}
              quality={100}
              priority
              draggable={false}
              className="w-full select-none" // Removed h-full and object-cover
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#2b2a2a] opacity-50  rounded-full p-4"> {/* Changed background to gray */}
                  <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 24 24"> {/* Adjusted size */}
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
          </div>
        ) : ( // Conditionally render video
          <div className="absolute inset-0">
            <iframe
              src="https://player.vimeo.com/video/1107092848?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=0&amp;color=000000&amp;transparent=0"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="demo"
              className="w-full h-full"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
