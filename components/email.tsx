import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface BrandKit {
  kitName: string;
  colors: {
    background: string;
    container: string;
    foreground: string;
    accent: string;
    buttonText: string;
    muted: string;
  };
  logos?: {primary: string};
  brandSummary?: string;
  website?: string;
  socials?: Array<{
    platform: string;
    url: string;
  }>;
  copyright?: string;
  footer?: string;
  disclaimers?: string;
  address?: string;
}

export const Email = ({ brandKit }: { brandKit: BrandKit }) => {
  const styles = {
    body: {
      backgroundColor: brandKit.colors.background || "#fafafa",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      margin: "0",
      padding: "40px 20px",
      WebkitTextSizeAdjust: "100%",
      lineHeight: "1.5",
      fontWeight: "400",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textRendering: "optimizeLegibility" as const,
    },

    container: {
      maxWidth: "600px",
      margin: "0 auto",
    },

    card: {
      backgroundColor: brandKit.colors.container || "#ffffff",
      borderRadius: "24px",
      padding: "56px 40px",
      textAlign: "center" as const,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      border: "1px solid rgba(0, 0, 0, 0.02)",
    },

    logosSection: {
      marginBottom: "40px",
    },

    logos: {
      maxWidth: "48px",
      height: "auto",
      margin: "0 auto",
      borderRadius: "12px",
    },

    logosFallback: {
      width: "48px",
      height: "48px",
      backgroundColor: brandKit.colors.accent || "#007AFF",
      borderRadius: "14px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
    },

    logosText: {
      color: brandKit.colors.buttonText || "#ffffff",
      fontSize: "18px",
      fontWeight: "600",
      margin: "0",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },

    // Heading styles - Image 1 specifications
    heading: {
      fontSize: "24px",
      fontWeight: "700",
      color: brandKit.colors.foreground || "#000000",
      margin: "48px auto 0 auto",
      padding: "0",
      border: "0px solid rgb(39, 39, 42)",
      lineHeight: "32px",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontStyle: "normal",
      letterSpacing: "-0.02em",
      textAlign: "center" as const,
    },

    // Paragraph styles - Image 2 specifications
    paragraph: {
      fontSize: "14px",
      fontStyle: "normal",
      color: brandKit.colors.foreground || "#000000",
      margin: "32px auto 0 auto",
      padding: "0",
      border: "0px solid rgb(39, 39, 42)",
      lineHeight: "20px",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontWeight: "400",
      opacity: 1,
      display: "block",
      width: "408px",
      height: "40px",
      maxWidth: "408px",
      textAlign: "center" as const,
    },

    button: {
      backgroundColor: brandKit.colors.accent || "#007AFF",
      color: brandKit.colors.buttonText || "#ffffff",
      padding: "12px 24px",
      borderRadius: "12px",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "14px",
      display: "inline-block",
      margin: "36px 0",
      border: "none",
      cursor: "pointer",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      letterSpacing: "-0.01em",
      minWidth: "120px",
    },

    supportText: {
      fontSize: "13px",
      color: brandKit.colors.muted || "#666666",
      margin: "36px 0 32px 0",
      lineHeight: "1.4",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontWeight: "500",
      opacity: 0.9,
      maxWidth: "280px",
      marginLeft: "auto",
      marginRight: "auto",
    },

    signature: {
      margin: "32px 0 40px 0",
    },

    signatureText: {
      fontSize: "14px",
      color: brandKit.colors.muted || "#666666",
      margin: "0 0 6px 0",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontWeight: "400",
      opacity: 0.8,
    },

    companyName: {
      fontSize: "14px",
      color: brandKit.colors.foreground || "#000000",
      fontWeight: "400",
      margin: "0",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },

    divider: {
      height: "1px",
      backgroundColor: brandKit.colors.muted || "#e0e0e0",
      border: "none",
      margin: "40px 0",
      opacity: 0.3,
    },

    socialSection: {
      margin: "20px 0",
    },

    socialLink: {
      display: "inline-block",
      margin: "0 10px",
      opacity: 0.5,
      transition: "opacity 0.2s ease",
    },

    socialIcon: {
      width: "18px",
      height: "18px",
      filter: "grayscale(100%)",
      borderRadius: "3px",
    },

    // Footer styles - Image 3 specifications
    footer: {
      margin: "24px 0 0 0",
      textAlign: "center" as const,
    },

    footerText: {
      fontSize: "12px",
      color: brandKit.colors.muted || "#999999",
      margin: "6px auto 0 auto",
      padding: "0",
      border: "0px solid rgb(39, 39, 42)",
      lineHeight: "16px",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontWeight: "400",
      fontStyle: "normal",
      opacity: 0.7,
      display: "block",
      width: "auto",
      maxWidth: "400px",
      height: "auto",
      textAlign: "center" as const,
    },

    // Mobile styles
    mobileCard: {
      padding: "40px 24px",
      borderRadius: "20px",
    },

    mobileHeading: {
      fontSize: "20px",
      width: "auto",
      height: "auto",
    },

    mobileParagraph: {
      fontSize: "14px",
      width: "auto",
      height: "auto",
    },

    mobileButton: {
      padding: "14px 24px",
      fontSize: "15px",
    },

    mobileFooterText: {
      width: "auto",
      height: "auto",
    },
  };

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <style>{`
          @media (max-width: 600px) {
            .card { 
              padding: 40px 24px !important; 
              border-radius: 20px !important;
            }
            .heading { 
              font-size: 20px !important; 
              margin-bottom: 24px !important;
              width: auto !important;
              height: auto !important;
            }
            .paragraph { 
              font-size: 14px !important; 
              max-width: 100% !important;
              width: auto !important;
              height: auto !important;
            }
            .button { 
              padding: 14px 24px !important; 
              font-size: 15px !important; 
            }
            .supportText {
              max-width: 100% !important;
            }
            .footerText {
              width: auto !important;
              height: auto !important;
            }
          }
        `}</style>
      </Head>
      <Preview>Hey there, welcome to {brandKit.kitName}!</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          
          {/* Single Card */}
          <Section style={styles.card} className="card">
            
            {/* logos */}
            <Section style={styles.logosSection}>
              {brandKit.logos?.primary ? (
                <Img
                  src={brandKit.logos?.primary}
                  alt={`${brandKit.kitName} logos`}
                  style={styles.logos}
                />
              ) : (
                <div style={styles.logosFallback}>
                  <Text style={styles.logosText}>
                    {brandKit.kitName.charAt(0).toUpperCase()}
                  </Text>
                </div>
              )}
            </Section>

            {/* Content */}
            <Text style={styles.heading} className="heading">
              Hey there, welcome!
            </Text>
            
            <Text style={styles.paragraph} className="paragraph">
              Thanks so much for joining us! We're absolutely thrilled to have you as part of our amazing community.
            </Text>
             {/* At {brandKit.kitName}, we believe in delivering exceptional experiences. */}
            <Text style={styles.paragraph} className="paragraph">
              We'd love for you to get the full experience, so when you have a moment, please finish setting up your account.
            </Text>

            {brandKit.website && (
              <Button href={brandKit.website} style={styles.button} className="button">
                Let's Get Started!
              </Button>
            )}

            <Text style={styles.supportText}>
              If you ever have questions or just want to chat, our friendly support team is always here to help.
            </Text>

            <Section style={styles.signature}>
              <Text style={styles.signatureText}>Cheers,</Text>
              <Text style={styles.companyName}>
                Your friends at {brandKit.kitName}
              </Text>
            </Section>

            {/* Divider */}
            <Hr style={styles.divider} />

            {/* Social Links */}
            {brandKit.socials && brandKit.socials.length > 0 && (
              <Section style={styles.socialSection}>
                {brandKit.socials.map((social, index) => (
                  <Link
                    key={index}
                    href={social.url}
                    style={styles.socialLink}
                    target="_blank"
                  >
                    <Img
                      src={`https://www.google.com/s2/favicons?domain=${social.platform}.com&sz=32`}
                      alt={social.platform}
                      style={styles.socialIcon}
                    />
                  </Link>
                ))}
              </Section>
            )}

            {/* Footer */}
            <Section style={styles.footer}>
              {brandKit.copyright && (
                <Text style={styles.footerText} className="footerText">{brandKit.copyright}</Text>
              )}
              {brandKit.address && (
                <Text style={styles.footerText} className="footerText">{brandKit.address}</Text>
              )}
              {brandKit.footer && (
                <Text style={styles.footerText} className="footerText">{brandKit.footer}</Text>
              )}
              {brandKit.disclaimers && (
                <Text style={styles.footerText} className="footerText">{brandKit.disclaimers}</Text>
              )}
            </Section>

          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default Email;