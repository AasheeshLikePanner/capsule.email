
                    "use client";
import { Building, Users, BadgeInfo, Palette, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image"; // Import Image component

export default function BrandKitSample() {
  return (
    <div className="w-full h-[550px] p-4 border border-border rounded-2xl bg-background flex flex-col gap-4 text-sm overflow-hidden">
        <div className="flex-grow overflow-y-auto pr-2"> {/* Added overflow-y-auto and pr-2 for scrollbar */}
            <div className="space-y-4 mb-4">
                <div className="flex items-center gap-2"><Building size={16} /> Brand Details</div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="kit_name" className="text-xs text-muted-foreground">Kit Name</Label>
                        <Input id="kit_name" value="Capsule" readOnly className="h-8 rounded-md" />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="website" className="text-xs text-muted-foreground">Website</Label>
                        <Input id="website" value="https://capsule.email" readOnly className="h-8 rounded-md" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="brand_summary" className="text-xs text-muted-foreground">Brand Summary</Label>
                    <Textarea id="brand_summary" value="The best way to create and send beautiful emails." readOnly className="rounded-md" />
                </div>
                <div>
                    <Label htmlFor="address" className="text-xs text-muted-foreground">Address</Label>
                    <Input id="address" value="123 Email St, Suite 456, Internet City, IC 78901" readOnly className="h-8 rounded-md" />
                </div>
                <div>
                    <Label htmlFor="tone_of_voice" className="text-xs text-muted-foreground">Tone of Voice</Label>
                    <Input id="tone_of_voice" value="Friendly, Professional, Innovative" readOnly className="h-8 rounded-md" />
                </div>
            </div>

            <div className="space-y-4 mb-4">
                <div className="flex items-center gap-2"><FileText size={16} /> Legal</div>
                <div>
                    <Label htmlFor="copyright" className="text-xs text-muted-foreground">Copyright</Label>
                    <Input id="copyright" value="© 2024 Capsule.email. All rights reserved." readOnly className="h-8 rounded-md" />
                </div>
                <div>
                    <Label htmlFor="footer" className="text-xs text-muted-foreground">Footer</Label>
                    <Textarea id="footer" value="This email was sent by Capsule.email. You are receiving this email because you signed up for our service." readOnly className="rounded-md" />
                </div>
                <div>
                    <Label htmlFor="disclaimers" className="text-xs text-muted-foreground">Disclaimers</Label>
                    <Textarea id="disclaimers" value="Prices and availability are subject to change without notice. Terms and conditions apply." readOnly className="rounded-md" />
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2"><Users size={16} /> Social</div>
                <div className="flex items-center gap-2">
                    <Input value="https://twitter.com/capsule" readOnly className="h-8 rounded-md flex-1" />
                    <Button variant="ghost" size="icon" disabled><Users size={16} /></Button>
                </div>
                <div className="flex items-center gap-2">
                    <Input value="https://linkedin.com/company/capsule" readOnly className="h-8 rounded-md flex-1" />
                    <Button variant="ghost" size="icon" disabled><Users size={16} /></Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 mb-4">
                <div className="w-full space-y-2">
                    <div className="flex items-center gap-2"><BadgeInfo size={16} /> Logo</div>
                    <div className="relative h-24 w-24 rounded-xl border border-dashed flex items-center justify-center bg-muted/40">
                        <Image src="/icon.svg" alt="Capsule Logo" width={64} height={64} className="object-contain" />
                    </div>
                </div>
                <div className="w-full space-y-2">
                    <div className="flex items-center gap-2"><Palette size={16} /> Colors</div>
                    <div className="grid grid-cols-2 items-center justify-items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-16 h-16 rounded-full bg-blue-500 border border-border shadow-md"></div>
                            <span className="text-xs text-muted-foreground">Accent</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-16 h-16 rounded-full bg-gray-200 border border-border shadow-md"></div>
                            <span className="text-xs text-muted-foreground">Background</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-16 h-16 rounded-full bg-white border border-border shadow-md"></div>
                            <span className="text-xs text-muted-foreground">Container</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-16 h-16 rounded-full bg-black border border-border shadow-md"></div>
                            <span className="text-xs text-muted-foreground">Button Text</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
            