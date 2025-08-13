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
    <section id="features" className="relative z-10 w-full lg:px-8"> {/* Removed mx-auto and py-16 from inner div */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold tracking-tight mb-4">
          Powerful Features to Elevate Your Emails
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to create, send, and manage stunning email campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16"> {/* Removed py-16 */}
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col gap-4 items-center text-center">
            <div className="w-full h-[550px] flex items-center justify-center ">
              {feature.component}
            </div>
            <h3 className="text-xl font-normal text-muted-foreground mt-3">{feature.title}</h3>
            <p className="font-light text-sm text-muted-foreground/60 -mt-3">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
