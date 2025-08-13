"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-background text-muted-foreground">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Image src="/icon.svg" alt="Logo" width={30} height={30} />
          <span className="text-lg font-medium text-foreground">Capsule.email</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </nav>
        <p className="text-sm">&copy; {new Date().getFullYear()} Capsule.email. All rights reserved.</p>
      </div>
    </footer>
  );
}
