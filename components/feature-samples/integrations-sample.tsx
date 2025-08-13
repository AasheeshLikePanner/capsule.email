"use client";
import { Zap, Mail, Users } from "lucide-react";

export default function IntegrationsSample() {
  return (
    <div className="w-full p-4 border border-border rounded-lg bg-background flex items-center justify-around gap-2">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="p-3 rounded-full bg-primary/10">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <span>Zapier</span>
      </div>
      <div className="w-8 h-1 border-t border-dashed border-muted-foreground"></div>
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="p-3 rounded-full bg-primary/10">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <span>Email</span>
      </div>
      <div className="w-8 h-1 border-t border-dashed border-muted-foreground"></div>
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="p-3 rounded-full bg-primary/10">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <span>CRM</span>
      </div>
    </div>
  );
}

