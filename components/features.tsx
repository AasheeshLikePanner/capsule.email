'use client'
import Image from "next/image";
import { useState } from "react";

export function Features() {
  const [expandedImageSrc, setExpandedImageSrc] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setExpandedImageSrc(src);
  };

  const handleClose = () => {
    setExpandedImageSrc(null);
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Powerful Features to Elevate Your Emails</h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Everything you need to create professional emails that get results.
          </p>
        </div>
        <div className="grid gap-12 items-center">
          {/* Feature 1: Brand Kit */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-3">Consistent Branding, Effortlessly</h3>
              <p className="text-muted-foreground text-lg">
                Define your brand kit once—logos, colors, and fonts—and our AI will apply it perfectly to every email, ensuring brand consistency without the manual work.
              </p>
            </div>
            <div className="md:w-1/2 relative">
              <Image
                src="/screenshots/brandkit.png"
                alt="Brand Kit Feature"
                width={1200}
                height={800}
                className="cursor-pointer transition-transform duration-300 ease-in-out"
                onClick={() => handleImageClick("/screenshots/brandkit.png")}
              />
            </div>
          </div>

          {/* Feature 2: AI Chat Interface */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 md:order-2">
              <h3 className="text-2xl font-bold mb-3">Conversational Email Creation</h3>
              <p className="text-muted-foreground text-lg">
                Simply chat with our AI to describe the email you want. It understands your requirements and generates stunning designs in real-time.
              </p>
            </div>
            <div className="md:w-1/2 md:order-1 relative">
              <Image
                src="/screenshots/chat.png"
                alt="AI Chat Interface"
                width={1200}
                height={800}
                className="cursor-pointer transition-transform duration-300 ease-in-out"
                onClick={() => handleImageClick("/screenshots/chat.png")}
              />
            </div>
          </div>

          {/* Feature 3: Pricing */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-3">Flexible Plans for Everyone</h3>
              <p className="text-muted-foreground text-lg">
                Whether you're just starting out or a growing business, we have a pricing plan that fits your needs. Start for free and upgrade as you grow.
              </p>
            </div>
            <div className="md:w-1/2 relative">
              <Image
                src="/screenshots/pricing.png"
                alt="Pricing Plans"
                width={1200}
                height={800}
                className="cursor-pointer transition-transform duration-300 ease-in-out"
                onClick={() => handleImageClick("/screenshots/pricing.png")}
              />
            </div>
          </div>
        </div>
      </div>

      {expandedImageSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleClose}
        >
          <div className="relative max-w-screen-lg max-h-screen-lg p-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={expandedImageSrc}
              alt="Expanded Feature"
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              onClick={handleClose}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}