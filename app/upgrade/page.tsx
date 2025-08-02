"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function UpgradePage() {
  const [isYearly, setIsYearly] = useState(false);

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
      priceMonthly: "$9",
      priceYearly: "$90",
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
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-background text-foreground p-4 sm:p-8 transition-colors duration-300 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem] z-0"></div>
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background)))] z-0"></div>
      <div className="relative z-10 w-full max-w-5xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Pricing Plans
          </h1>
          <p className="text-md text-muted-foreground max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Choose the plan that fits your needs. No hidden fees, ever.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <span className={cn("font-medium transition-colors text-sm", !isYearly ? "text-primary" : "text-muted-foreground")}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            id="billing-cycle"
            aria-label="Switch between monthly and yearly billing"
          />
          <span className={cn("font-medium transition-colors text-sm", isYearly ? "text-primary" : "text-muted-foreground")}>
            Yearly (Save 16%)
          </span>
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
                  <div className="text-3xl font-bold my-4 text-primary">
                    {plan.name === "Pro" ? (isYearly ? plan.priceYearly : plan.priceMonthly) : plan.price}
                    {plan.name === "Pro" && (
                      <span className="text-sm font-normal text-muted-foreground">
                        {isYearly ? "/year" : "/month"}
                      </span>
                    )}
                  </div>
                  <CardDescription className={cn("text-sm", plan.isFeatured ? "text-foreground/80" : "text-muted-foreground")}>{plan.description}</CardDescription>
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
                  <Button
                    size="lg"
                    className={cn(
                      "w-full font-semibold transition-colors duration-300",
                      plan.isFeatured ? "bg-primary hover:bg-primary/90" : "bg-transparent border border-primary text-primary hover:bg-primary/10",
                    )}
                    disabled={plan.isCurrent}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}