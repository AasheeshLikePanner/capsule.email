
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function DarkEmailTemplate() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground rounded-lg shadow-lg">
        <CardHeader className="text-center p-6">
          <div className="flex justify-center mb-4">
            <Image src="/icon.svg" alt="Logo" width={60} height={60} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Inbox, Reimagined.</h1> {/* Changed heading */}
        </CardHeader>
        <CardContent className="text-center p-6 pt-0">
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            Build beautiful AI powered emails to stand out in the market. {/* Changed tagline */}
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-6 rounded-md transition-colors duration-300">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
