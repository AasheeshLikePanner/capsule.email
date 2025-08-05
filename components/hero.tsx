import { Navbar } from "./navbar";
import Image from "next/image";

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
        </div>
      <div className="w-[150%] mt-20 border">
        <Image
          src="/screenshots/chat-sidebar.png"
          alt="Chat Sidebar Screenshot"
          width={1920}
          height={1280}
          quality={100}
          priority
          draggable={false}
          className="w-full select-none "
        />
      </div>
    </div>
  );
}
