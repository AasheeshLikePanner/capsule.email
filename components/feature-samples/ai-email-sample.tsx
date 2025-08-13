"use client";
import { ArrowUp, Bot, User, Briefcase, Terminal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AiEmailSample() {
    return (
        <div className="w-full h-[550px] p-4 border border-border rounded-2xl bg-background flex flex-col gap-4 text-sm overflow-hidden">

            <div className="flex w-full justify-end items-start">
                <div className="max-w-lg">
                    <div className="rounded-2xl px-4 py-3 bg-muted text-muted-foreground shadow-sm">
                        <p className="text-sm">Generate a welcome email.</p>
                    </div>
                    <div className="mt-2 p-2 rounded-2xl bg-muted text-card-foreground border shadow-sm flex items-center space-x-2 max-w-40 ml-auto">
                        <Image src="/icon.svg" alt="Brand Logo" width={24} height={24} className="rounded-full" />
                        <span className="text-sm font-medium">Capsule</span>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-start items-start">
                <Image src="/icon.svg" alt="Bot Icon" width={32} height={32} className="mr-2" />
                <div className="w-60">
                    <div className="rounded-lg w-60 p-3 border text-secondary-foreground shadow-sm mb-2 cursor-pointer hover:bg-accent flex items-center justify-between">
                        <p className="text-sm font-semibold">Welcome Email</p>
                        <Terminal className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm mt-2 text-left">Here is a welcome email for your new users.</p>
                </div>
            </div>
            <div className="flex w-full justify-end items-start">
                <div className="max-w-lg">
                    <div className="rounded-2xl px-4 py-3 bg-muted text-muted-foreground shadow-sm">
                        <p className="text-sm">add silly cat image in it</p>
                    </div>
                    <div className="mt-2 p-2 rounded-2xl bg-muted text-card-foreground border shadow-sm flex items-center space-x-2 max-w-40 ml-auto">
                        <Image src="/icon.svg" alt="Brand Logo" width={24} height={24} className="rounded-full" />
                        <span className="text-sm font-medium">Capsule</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-start">
                <div className="max-w-lg">
                    <div className="flex items-center justify-center p-2">
                        <Image src="/icon.svg" alt="Loading..." width={24} height={24} className="animate-spin" />
                    </div>
                </div>
            </div>

            <div className="relative mt-4">
                <Textarea
                    placeholder="Tell the AI what to change..."
                    className="w-full text-base p-4 pr-14 rounded-xl resize-none border-input bg-card focus-visible:ring-1 focus-visible:ring-offset-0"
                    readOnly
                />
                <div className="absolute bottom-3.5 right-3.5">
                    <Button
                        type="submit"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        disabled>
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
