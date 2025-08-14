"use client";
import AiEmailSample from "./feature-samples/ai-email-sample";
import BrandKitSample from "./feature-samples/brand-kit-sample";
import ResponsiveSample from "./feature-samples/responsive-sample";
import PreviewSample from "./feature-samples/preview-sample";
import CombinedResponsivePreviewSample from "./feature-samples/combined-responsive-preview-sample"; // New import
export default function Features() {
  const features = [
    {
      title: "AI-Powered Email Generation",
      description: "Craft compelling emails in seconds with intelligent AI assistance.",
      component: <AiEmailSample />,
    },
    {
      title: "Custom Brand Kits",
      description: "Maintain brand consistency with customizable color palettes, fonts, and logos.",
      component: <BrandKitSample />, 
    },
    {
      title: "Responsive & Real-time Previews", // New title for combined feature
      description: "Ensure your emails look great on any device with real-time previews.", // New description
      component: <CombinedResponsivePreviewSample />, // New component
    },
  ];

  return (
    <section id="features" className="relative z-10 w-full items-center justify-center lg:px-8 pt-20"> {/* Removed mx-auto and py-16 from inner div */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold tracking-tight mb-4">
          Powerful Features to Elevate Your Emails
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to create, send, and manage stunning email campaigns.
        </p>
      </div>

      <div className="flex flex-col gap-24 py-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center justify-center gap-20 p-12 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full md:w-1/2 h-[550px] flex items-center justify-center">
              {feature.component}
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h3 className="text-3xl font-normal tracking-tight mb-3">{feature.title}</h3>
              <p className="text-base text-muted-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
