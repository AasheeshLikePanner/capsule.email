'use client';

import { CodeTabs } from "@/components/code-tabs";



const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-card p-6 rounded-lg shadow-sm">
    <h2 className="text-2xl font-semibold tracking-tight text-card-foreground mb-4">{title}</h2>
    <div className="space-y-3 text-muted-foreground leading-relaxed">
      {children}
    </div>
  </section>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start space-x-2">
    <span className="text-primary mt-1">•</span>
    <p>{children}</p>
  </li>
);


import { nodeCode } from '@/lib/code-examples/node-code';
import { pythonCode } from '@/lib/code-examples/python-code';

export default function HelpPage() {
  const codeTabs = [
    { id: 'node', label: 'Node.js', language: 'javascript' as const, code: nodeCode },
    { id: 'python', label: 'Python', language: 'python' as const, code: pythonCode },
  ];

  return (
    <div className="w-full bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div>
          {/* Main Content */}
          <main className="w-full">
            <header className="mb-16 text-center">
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-tight">
                Help & Documentation
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
                A complete guide to help you get the most out of Capsule.email.
              </p>
            </header>

            <div className="space-y-12">
              <Section title="What is Capsule.email?">
                <p>
                  Capsule.email is an AI-powered tool designed to help developers and teams create fully responsive, brand-consistent HTML email templates with ease. It solves the painful, time-consuming process of coding and testing emails, which often break across different clients and devices. Instead of writing HTML from scratch, you can simply chat with our AI to generate the perfect template in seconds.
                </p>
                <p>
                  It's built for developers, SaaS teams, and product builders who need to send reliable transactional or marketing emails without getting bogged down in the complexities of email design. Just generate, copy the clean HTML, and use it in any application or email service.
                </p>
              </Section>

              <Section title="What is a BrandKit?">
                <p>
                  A BrandKit is a smart, centralized system that stores your brand's visual identity. It ensures every email you generate is perfectly on-brand, without any manual effort.
                </p>
                <p>You can create a BrandKit in two ways:</p>
                <ul className="space-y-3">
                  <ListItem><strong>Auto-Generated:</strong> Simply paste your website's URL. Our backend intelligently fetches your theme colors, logos, brand name, social media links, and even infers a tone of voice from your content.</ListItem>
                  <ListItem><strong>Manual:</strong> Build your BrandKit from scratch by providing your assets and brand guidelines directly.</ListItem>
                </ul>
                <p>
                  Once created, the BrandKit automatically styles every AI-generated email to match your brand. This means no more uploading logos, managing hex codes, or writing footer copy for each template. It's branding, baked right in.
                </p>
              </Section>

              <Section title="Using HTML Email Templates">
                <h3 className="text-xl font-semibold text-foreground mb-3">Copying the HTML</h3>
                <p>
                  In the email editor, you'll find a "Copy HTML" button. This copies the entire, clean, and responsive HTML to your clipboard, ready to be saved as a file (e.g., <code className="bg-muted/50 text-muted-foreground rounded-md px-1.5 py-1 text-sm">welcome-email.html</code>) in your project.
                </p>
                <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Using Variables</h3>
                <p>
                  Capsule supports dynamic content through variable placeholders using the <code className="bg-muted/50 text-muted-foreground rounded-md px-1.5 py-1 text-sm">{"{{variable_name}}"}</code> syntax. This allows you to reuse a single template for multiple recipients or scenarios.
                </p>
                <p>
                  For example, a password reset email might contain <code className="bg-muted/50 text-muted-foreground rounded-md px-1.5 py-1 text-sm">{"{{reset_link}}"}</code> and <code className="bg-muted/50 text-muted-foreground rounded-md px-1.5 py-1 text-sm">{"{{user_name}}"}</code>. In your backend code, you'll replace these placeholders with real data before sending the email.
                </p>
              </Section>

              <Section title="Code Examples">
                <p>
                  Here’s how you can use a downloaded template in your code.
                </p>
                <CodeTabs tabs={codeTabs} />
              </Section>

              <Section title="Best Practices">
                <ul className="space-y-3">
                  <ListItem><strong>Always Use Variables:</strong> Avoid hardcoding names, links, or other data. Use placeholders like <code className="bg-muted/50 text-muted-foreground rounded-md px-1.5 py-1 text-sm">{"{{recipient_name}}"}</code> to keep templates reusable and your code clean.</ListItem>
                  <ListItem><strong>Centralize Branding via BrandKit:</strong> Let the BrandKit handle your logos, colors, and footers. This ensures consistency and makes brand updates effortless.</ListItem>
                  <ListItem><strong>Reuse Templates:</strong> A single, well-designed template can often serve multiple purposes. For example, a generic "Notification" template can be used for password resets, new follower alerts, and more, just by changing the text via variables.</ListItem>
                </ul>
              </Section>

              

              <Section title="Summary">
                <p>Capsule.email helps you ship beautiful emails, faster.</p>
                <ul className="space-y-3">
                  <ListItem><strong>AI-Powered Generation:</strong> Go from a simple prompt to a complete email in seconds.</ListItem>
                  <ListItem><strong>Clean, Responsive HTML:</strong> No more broken layouts. Our templates work everywhere.</ListItem>
                  <ListItem><strong>Branding Baked In:</strong> Your brand's look and feel are automatically applied to every email.</ListItem>
                  <ListItem><strong>Use Any Tech Stack:</strong> Copy the HTML and use it with Node.js, Python, Ruby, or any other language or framework.</ListItem>
                </ul>
              </Section>
            </div>
          </main>

          
        </div>
      </div>
    </div>
  );
}

