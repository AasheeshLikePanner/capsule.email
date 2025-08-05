import Image from "next/image";

export function Features() {
  return (
    <section className="w-1/2 mx-auto py-24 border-l border-r">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Powerful Features to Elevate Your Emails</h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Everything you need to create professional emails that get results.
          </p>
        </div>
        <div className="grid gap-24 items-center">
          {/* Feature 1: Brand Kit */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-3">Consistent Branding, Effortlessly</h3>
              <p className="text-muted-foreground text-lg">
                Define your brand kit once—logos, colors, and fonts—and our AI will apply it perfectly to every email, ensuring brand consistency without the manual work.
              </p>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/screenshots/brandkit.png"
                alt="Brand Kit Feature"
                width={1200}
                height={800}
                className="rounded-lg border shadow-lg"
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
            <div className="md:w-1/2 md:order-1">
              <Image
                src="/screenshots/chat.png"
                alt="AI Chat Interface"
                width={1200}
                height={800}
                className="rounded-lg border shadow-lg"
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
            <div className="md:w-1/2">
              <Image
                src="/screenshots/pricing.png"
                alt="Pricing Plans"
                width={1200}
                height={800}
                className="rounded-lg border shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}