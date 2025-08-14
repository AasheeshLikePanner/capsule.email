"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-background text-muted-foreground">
      <div className="max-w-5xl mx-auto flex justify-center items-center">
        <span className="text-5xl font-bold opacity-40 text-fade-y">Capsule.email</span>
      </div>
    </footer>
  );
}
