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
  const {
    kit_name,
    website,
    copyright,
    address,
    footer,
    disclaimers,
    socials,
    logo_primary,
    color_background,
    color_container,
    color_accent,
    color_button_text,
    color_foreground,
  } = brandKit;

  return (
    <div className="email-body w-full h-full rounded-3xl">
      <style>{`
          .email-body {
            background-color: ${color_background || "#fafafa"};
            font-family: "Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            line-height: 1.5;
            font-weight: 400;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .card {
            background-color: ${color_container || "#ffffff"};
            border-radius: 24px;
            padding: 56px 40px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.02);
          }
          .logos-section {
            margin-bottom: 40px;
          }
          .logo {
            max-width: 48px;
            height: auto;
            margin: 0 auto;
            border-radius: 12px;
          }
          .logo-fallback {
            width: 48px;
            height: 48px;
            background-color: ${color_accent || "#007AFF"};
            border-radius: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          }
          .logo-text {
            color: ${color_button_text || "#ffffff"};
            font-size: 18px;
            font-weight: 600;
            margin: 0;
          }
          .heading {
            font-size: 24px;
            font-weight: 700;
            color: ${color_foreground || "#000000"};
            margin: 48px auto 0 auto;
            padding: 0;
            line-height: 32px;
            letter-spacing: -0.02em;
            text-align: center;
          }
          .paragraph {
            font-size: 14px;
            color: ${color_foreground || "#000000"};
            margin: 32px auto 0 auto;
            padding: 0;
            line-height: 20px;
            max-width: 408px;
            text-align: center;
          }
          .button {
            background-color: ${color_accent || "#007AFF"};
            color: ${color_button_text || "#ffffff"};
            padding: 12px 24px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            display: inline-block;
            margin: 36px 0;
            border: none;
            cursor: pointer;
            min-width: 120px;
          }
          .support-text {
            font-size: 13px;
            color: ${color_foreground || "#666666"};
            margin: 36px 0 32px 0;
            line-height: 1.4;
            font-weight: 500;
            opacity: 0.9;
            max-width: 280px;
            margin-left: auto;
            margin-right: auto;
          }
          .signature {
            margin: 32px 0 40px 0;
          }
          .signature-text {
            font-size: 14px;
            color: ${color_foreground || "#666666"};
            margin: 0 0 6px 0;
            font-weight: 400;
            opacity: 0.8;
          }
          .company-name {
            font-size: 14px;
            color: ${color_foreground || "#000000"};
            font-weight: 400;
            margin: 0;
          }
          .divider {
            height: 1px;
            background-color: ${color_foreground || "#e0e0e0"};
            border: none;
            margin: 40px 0;
            opacity: 0.3;
          }
          .social-section {
            margin: 20px 0;
          }
          .social-link {
            display: inline-block;
            margin: 0 10px;
            opacity: 0.5;
            transition: opacity 0.2s ease;
          }
          .social-icon {
            width: 18px;
            height: 18px;
            filter: grayscale(100%);
            border-radius: 3px;
          }
          .footer {
            margin: 24px 0 0 0;
            text-align: center;
          }
          .footer-text {
            font-size: 12px;
            color: ${color_foreground || "#999999"};
            margin: 6px auto 0 auto;
            padding: 0;
            line-height: 16px;
            opacity: 0.7;
            max-width: 400px;
            text-align: center;
          }

          @media (max-width: 600px) {
            .container {
              padding: 20px 10px !important;
            }
            .card {
              padding: 40px 20px !important;
              border-radius: 16px !important;
            }
            .heading {
              font-size: 20px !important;
              line-height: 28px !important;
              margin-top: 32px !important;
            }
            .paragraph {
              font-size: 13px !important;
              line-height: 18px !important;
              margin-top: 24px !important;
              max-width: 100% !important;
            }
            .button {
              padding: 10px 20px !important;
              font-size: 13px !important;
              margin: 28px 0 !important;
            }
            .support-text {
              font-size: 12px !important;
              margin: 28px 0 !important;
            }
            .signature {
              margin: 24px 0 32px 0 !important;
            }
          }
        `}</style>
      <div className="container">
        <div className="card">
          <div className="logos-section">
            {logo_primary ? (
              <img
                src={logo_primary}
                alt={`${kit_name} logo`}
                className="logo"
              />
            ) : (
              <div className="logo-fallback">
                <span className="logo-text">
                  {kit_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <p className="heading">
            Hey there, welcome!
          </p>
          
          <p className="paragraph">
            Thanks so much for joining us! We're absolutely thrilled to have you as part of our amazing community.
          </p>
          <p className="paragraph">
            We'd love for you to get the full experience, so when you have a moment, please finish setting up your account.
          </p>

          {website && (
            <a href={website} className="button">
              Visit our Website!
            </a>
          )}

          <p className="support-text">
            If you ever have questions or just want to chat, our friendly support team is always here to help.
          </p>

          <div className="signature">
            <p className="signature-text">Cheers,</p>
            <p className="company-name">
              Your friends at {kit_name}
            </p>
          </div>

          <hr className="divider" />

          {socials && socials.length > 0 && (
            <div className="social-section">
              {socials.map((socialUrl, index) => {
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
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${platform}.com&sz=32`}
                      alt={platform}
                      className="social-icon"
                    />
                  </a>
                );
              })}
            </div>
          )}

          <div className="footer">
            {copyright && (
              <p className="footer-text">{copyright}</p>
            )}
            {address && (
              <p className="footer-text">{address}</p>
            )}
            {footer && (
              <p className="footer-text">{footer}</p>
            )}
            {disclaimers && (
              <p className="footer-text">{disclaimers}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;