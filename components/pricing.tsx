"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from 'next/link';

interface PricingProps {
  userEmail: string | null;
}

export default function Pricing({ userEmail }: PricingProps) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For beginners and hobbyists.",
      features: [
        "20 messages per month",
        "10 test emails per day",
        "2 brand kits",
        "1 public project",
      ],
      cta: "Current Plan",
      isCurrent: true,
    },
    {
      name: "Pro",
      priceMonthly: process.env.NEXT_PUBLIC_PRO_PLAN_MONTHLY_PRICE || "$9",
      description: "For professionals who need more.",
      features: [
        "Unlimited messages per month",
        "Unlimited test emails per day",
        "Unlimited brand kits",
        "Unlimited public projects",
        "Ticket support",
        "Early access to features",
      ],
      cta: "Upgrade to Pro",
      isFeatured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale projects.",
      features: [
        "Flexible messages",
        "Flexible test emails",
        "Flexible brand kits",
        "Priority support",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="relative z-10 w-full              
           min-h-screen flex flex-col items-center justify-center py-20 px-4    
            sm:px-6 lg:px-8 overflow-hidden"> {/* Removed min-h-screen and py-20 */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem] z-0"></div>
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background)))] z-0"></div>
      <div className="relative z-10 w-full max-w-5xl mx-auto"> {/* Content layered on top */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-center lg:items-end">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={cn(
                  "flex flex-col w-full transition-all duration-300 ease-in-out",
                  "rounded-lg lg:rounded-none animate-fade-in-up",
                  index === 0 && "lg:rounded-l-lg",
                  index === plans.length - 1 && "lg:rounded-r-lg",
                  plan.isFeatured
                    ? "bg-muted/50 lg:mb-4"
                    : "bg-muted/20",
                )}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold mb-2 text-primary">{plan.name}</CardTitle>
                  <CardDescription className={cn("text-sm", plan.isFeatured ? "text-foreground/80" : "text-muted-foreground")}>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold my-4 text-primary">
                    {plan.name === "Pro" ? plan.priceMonthly : plan.price}
                    {plan.name === "Pro" && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6 pt-0">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={feature} className="flex items-start text-sm animate-fade-in-up" style={{ animationDelay: `${0.6 + index * 0.1 + featureIndex * 0.05}s` }}>
                        <Check className="w-4 h-4 text-primary mr-3 shrink-0 mt-1" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-4 mt-auto">
                  {plan.name === 'Pro' ? (
                    <Button size="lg" className="w-full font-semibold bg-primary hover:bg-primary/90" asChild>
                      <Link href={userEmail ? `/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRO_PLAN_ID}&customerEmail=${userEmail}` : `/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRO_PLAN_ID}`}>
                        {plan.cta}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className={cn(
                        "w-full font-semibold transition-colors duration-300",
                        "bg-transparent border border-primary text-primary hover:bg-primary/10"
                      )}
                      disabled={plan.isCurrent}
                    >
                      {plan.cta}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
