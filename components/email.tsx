import React from "react";

interface BrandKit {
  id: string;
  user_id: string;
  kit_name: string;
  website: string;
  brand_summary: string;
  address: string;
  tone_of_voice: string;
  copyright: string;
  footer: string;
  disclaimers: string;
  socials: string[];
  logo_primary: string;
  logo_icon: string;
  color_background: string;
  color_container: string;
  color_accent: string;
  color_button_text: string;
  color_foreground: string;
  created_at: string;
}

export const Email = ({ brandKit }: { brandKit: BrandKit }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    body: {
      backgroundColor: brandKit.color_background || "#fafafa",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      margin: "0",
      padding: "40px 20px",
      WebkitTextSizeAdjust: "100%",
      lineHeight: "1.5",
      fontWeight: "400",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textRendering: "optimizeLegibility",
    },

    container: {
      maxWidth: "600px",
      margin: "0 auto",
    },

    card: {
      backgroundColor: brandKit.color_container || "#ffffff",
      borderRadius: "24px",
      padding: "56px 40px",
      textAlign: "center",
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
      backgroundColor: brandKit.color_accent || "#007AFF",
      borderRadius: "14px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
    },

    logosText: {
      color: brandKit.color_button_text || "#ffffff",
      fontSize: "18px",
      fontWeight: "600",
      margin: "0",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },

    heading: {
      fontSize: "24px",
      fontWeight: "700",
      color: brandKit.color_foreground || "#000000",
      margin: "48px auto 0 auto",
      padding: "0",
      border: "0px solid rgb(39, 39, 42)",
      lineHeight: "32px",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontStyle: "normal",
      letterSpacing: "-0.02em",
      textAlign: "center",
    },

    paragraph: {
      fontSize: "14px",
      fontStyle: "normal",
      color: brandKit.color_foreground || "#000000",
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
      textAlign: "center",
    },

    button: {
      backgroundColor: brandKit.color_accent || "#007AFF",
      color: brandKit.color_button_text || "#ffffff",
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
      color: brandKit.color_foreground || "#666666",
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
      color: brandKit.color_foreground || "#666666",
      margin: "0 0 6px 0",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontWeight: "400",
      opacity: 0.8,
    },

    companyName: {
      fontSize: "14px",
      color: brandKit.color_foreground || "#000000",
      fontWeight: "400",
      margin: "0",
      fontFamily: '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },

    divider: {
      height: "1px",
      backgroundColor: brandKit.color_foreground || "#e0e0e0",
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

    footer: {
      margin: "24px 0 0 0",
      textAlign: "center",
    },

    footerText: {
      fontSize: "12px",
      color: brandKit.color_foreground || "#999999",
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
      textAlign: "center",
    },
  };

  return (
    <div style={styles.body} className="rounded-3xl w-full h-full">
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logosSection}>
            {brandKit.logo_primary ? (
              <img
                src={brandKit.logo_primary}
                alt={`${brandKit.kit_name} logos`}
                style={styles.logos}
              />
            ) : (
              <div style={styles.logosFallback}>
                <span style={styles.logosText}>
                  {brandKit.kit_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <p style={styles.heading}>
            Hey there, welcome!
          </p>
          
          <p style={styles.paragraph}>
            Thanks so much for joining us! We're absolutely thrilled to have you as part of our amazing community.
          </p>
          <p style={styles.paragraph}>
            We'd love for you to get the full experience, so when you have a moment, please finish setting up your account.
          </p>

          {brandKit.website && (
            <a href={brandKit.website} style={styles.button}>
              Visit our Website!
            </a>
          )}

          <p style={styles.supportText}>
            If you ever have questions or just want to chat, our friendly support team is always here to help.
          </p>

          <div style={styles.signature}>
            <p style={styles.signatureText}>Cheers,</p>
            <p style={styles.companyName}>
              Your friends at {brandKit.kit_name}
            </p>
          </div>

          <hr style={styles.divider} />

          {brandKit.socials && brandKit.socials.length > 0 && (
            <div style={styles.socialSection}>
              {brandKit.socials.map((socialUrl, index) => {
                let url;
                try {
                  url = new URL(socialUrl);
                } catch (e) {
                  return null; // Skip invalid URLs
                }
                const hostname = url.hostname;
                const domainParts = hostname.split('.');
                const platform = domainParts.length > 1 ? domainParts[domainParts.length - 2] : domainParts[0];

                return (
                  <a
                    key={index}
                    href={socialUrl}
                    style={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${platform}.com&sz=32`}
                      alt={platform}
                      style={styles.socialIcon}
                    />
                  </a>
                );
              })}
            </div>
          )}

          <div style={styles.footer}>
            {brandKit.copyright && (
              <p style={styles.footerText}>{brandKit.copyright}</p>
            )}
            {brandKit.address && (
              <p style={styles.footerText}>{brandKit.address}</p>
            )}
            {brandKit.footer && (
              <p style={styles.footerText}>{brandKit.footer}</p>
            )}
            {brandKit.disclaimers && (
              <p style={styles.footerText}>{brandKit.disclaimers}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
