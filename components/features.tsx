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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1: Brand Kit - Wider Card */}
          <div className="group relative col-span-1 md:col-span-2 h-96 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <Image
              src="/screenshots/brandkit.png"
              alt="Brand Kit Feature"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick("/screenshots/brandkit.png")}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">Consistent Branding, Effortlessly</h3>
              <p className="text-lg leading-relaxed drop-shadow-md">
                Define your brand kit once—logos, colors, and fonts—and our AI will apply it perfectly to every email.
              </p>
            </div>
          </div>

          {/* Feature 2: AI Chat Interface - Standard Card */}
          <div className="group relative col-span-1 h-96 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <Image
              src="/screenshots/chat.png"
              alt="AI Chat Interface"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick("/screenshots/chat.png")}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">Conversational Email Creation</h3>
              <p className="text-lg leading-relaxed drop-shadow-md">
                Simply chat with our AI to describe the email you want. It generates stunning designs in real-time.
              </p>
            </div>
          </div>

          {/* Feature 3: Flexible Plans - Standard Card */}
          <div className="group relative col-span-1 h-96 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <Image
              src="/screenshots/pricing.png"
              alt="Pricing Plans"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick("/screenshots/pricing.png")}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">Flexible Plans for Everyone</h3>
              <p className="text-lg leading-relaxed drop-shadow-md">
                Whether you're just starting out or a growing business, we have a pricing plan that fits your needs.
              </p>
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