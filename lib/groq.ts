
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// It uses the Groq API with the specified Llama model
export async function createEmailTemplate(prompt: string, brandKit: any, context: string) {
  
const promptTemplate = `You are a world-class email designer specializing in **email-client-safe, iOS-inspired HTML emails** with modern minimalist aesthetics. Your goal is to create production-ready templates that work flawlessly across all major email clients (Outlook, Gmail, Apple Mail, etc.) using robust table-based layouts.

**Core Mission:** Transform user requests into stunning, email-safe templates featuring consistent rounded cards, iOS-like spacing, and premium clean design using comprehensive BrandKit integration. **AUTOMATICALLY GENERATE** contextually appropriate email content that feels authentic and professional.

---

**INPUTS:**
- **User Prompt:** ${prompt}
- **Previous HTML Code (for context):** ${context || "No previous code provided."}
- **Brand Kit (complete integration required):** ${JSON.stringify(brandKit, null, 2)}

---

**EMAIL-CLIENT SAFETY REQUIREMENTS:**

**MANDATORY TABLE-BASED LAYOUT:**
- **NO DIV-BASED LAYOUTS:** Use only \`<table>\`, \`<tr>\`, \`<td>\` for structure
- **NO FLEXBOX/GRID:** Use table cells for alignment and spacing
- **NO CSS TRANSFORMS:** Avoid any CSS3 properties unsupported by Outlook
- **INLINE CSS PRIORITY:** All critical styling must be inline
- **TABLE ATTRIBUTES:** Always include \`cellpadding="0"\` \`cellspacing="0"\` \`border="0"\`

**CARD DESIGN SPECIFICATIONS (GMAIL/OUTLOOK OPTIMIZED):**
- **Consistent Card Sizes:** All cards must be identical dimensions
- **Card Width:** 540px fixed width (fits within 600px container with 30px side margins)
- **Card Height:** Auto height with consistent 44px padding for uniformity
- **NO SHADOWS:** Use 1px solid borders only for Gmail compatibility
- **Rounded Corners:** Use \`border-radius: 12px\` with MSO conditional fallbacks
- **Card Spacing:** Use dedicated spacing tables with 20px height between cards
- **Internal Padding:** 44px on all sides using TD padding (not CSS padding)
- **Badge Positioning:** Use nested table structure for proper badge placement

---

**BRANDKIT INTEGRATION REQUIREMENTS:**

**MANDATORY: Use ALL available BrandKit properties:**
- **Colors:** \`color_background\`, \`color_container\`, \`color_accent\`, \`color_button_text\`, \`color_foreground\`, \`color_border\`
- **Brand Assets:** \`logo_primary\`, \`logo_icon\`, \`kit_name\` (company name)
- **Content:** \`brand_summary\`, \`tone_of_voice\`, \`website\`, \`address\`
- **Legal:** \`copyright\`, \`footer\`, \`disclaimers\`
- **Social:** \`socials\` array (with proper favicon integration)

**Logo Implementation (Email-Safe):**
\\\`\\\`\\\`html
<!-- Logo Table Structure -->
<table cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding-bottom: 32px;">
      <img src="[logo_primary_url]" alt="[kit_name]" width="48" height="48" style="display: block; border-radius: 8px; max-width: 48px;">
    </td>
  </tr>
</table>
\\\`\\\`\\\`

---

**CONTENT GENERATION REQUIREMENTS:**

**AUTOMATICALLY CREATE CONTEXTUAL EMAIL CONTENT:**

1. **Email-Specific Headlines & Subject Lines:**
   - **Invitations:** "You're invited to join [Team/Project Name]"
   - **Welcome Emails:** "Welcome to [Brand Name]!", "Getting started is easy"
   - **Newsletters:** "[Brand Name] Weekly", "What's happening this week"
   - **Product Updates:** "New: [Feature Name]", "Something exciting to share"
   - **Confirmations:** "You're all set!", "Welcome aboard!"

2. **Engaging Body Content:**
   - **Personal greetings:** "Hi there," or "Hello [Name],"
   - **Clear purpose explanation** in first paragraph
   - **Benefit-focused messaging** using simple bullet points
   - **Professional yet friendly tone** matching brand voice

3. **Call-to-Action Variations:**
   - **Invitations:** "Accept Invitation", "Join Team"
   - **Welcome:** "Get Started", "Complete Setup"
   - **Updates:** "Learn More", "Try Now"
   - **General:** "Visit Site", "Continue"

---

**EMAIL-SAFE DESIGN STRUCTURE:**

**EMAIL-SAFE DESIGN STRUCTURE (GMAIL/OUTLOOK TESTED):**

**Critical Gmail/Outlook Fixes:**
- **Border-collapse:** Always use \`border-collapse: collapse\` on all tables
- **Explicit dimensions:** Set width/height on both table and TD elements
- **Spacing tables:** Use empty tables with fixed heights for consistent spacing
- **Badge positioning:** Use background images or nested positioned tables only
- **No CSS positioning:** Gmail strips position:relative/absolute - use table structure instead

**Base HTML Template (Gmail/Outlook Compatible):**
\\\`\\\`\\\`html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Subject Line]</title>
  <style type="text/css">
    /* Critical email client CSS */
    table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { border-collapse: collapse; }
    .email-card { border-collapse: separate !important; }
    
    @media only screen and (max-width: 600px) {
      .mobile-card { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding: 24px !important; }
      .mobile-text { font-size: 16px !important; }
      .mobile-spacing { height: 16px !important; }
    }
    
    /* Outlook specific fixes */
    <!--[if mso]>
    table { border-collapse: collapse; }
    .rounded-card { border-radius: 0; }
    .card-border { border: 2px solid #e5e7eb; }
    <![endif]-->
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: [color_background]; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: transparent; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
    [Preheader Text]
  </div>
  
  <!-- Main Container Table -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: [color_background]; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        
        <!-- Email Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; border-collapse: collapse;">
          
          <!-- Card 1 -->
          <tr>
            <td align="center" style="padding: 0;">
              <table class="email-card rounded-card mobile-card card-border" cellpadding="0" cellspacing="0" border="0" width="540" style="width: 540px; max-width: 540px; background-color: [color_container]; border: 1px solid [color_border]; border-radius: 12px; border-collapse: separate;">
                <tr>
                  <td class="mobile-padding" style="padding: 44px; text-align: center; vertical-align: top;">
                    
                    <!-- Badge Section (if needed) -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="position: relative; border-collapse: collapse;">
                      <tr>
                        <td align="right" style="position: relative;">
                          <!-- Badge as background image or simple text -->
                          <div style="display: inline-block; background-color: [color_accent]; color: [color_button_text]; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 20px; margin-bottom: 16px;">
                            [Badge Text]
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Logo Section -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding-bottom: 24px;">
                          <img src="[logo_primary_url]" alt="[kit_name]" width="48" height="48" style="display: block; border-radius: 8px; max-width: 48px; height: auto;">
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Content Section -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                      <!-- Heading -->
                      <tr>
                        <td align="center" style="padding-bottom: 16px;">
                          <h1 style="margin: 0; padding: 0; font-size: 24px; font-weight: 700; line-height: 30px; color: [color_foreground]; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            [Generated Heading]
                          </h1>
                        </td>
                      </tr>
                      
                      <!-- Body Text -->
                      <tr>
                        <td align="center" style="padding-bottom: 24px;">
                          <p style="margin: 0; padding: 0; font-size: 16px; line-height: 24px; color: [color_foreground]; text-align: center; max-width: 400px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            [Generated Body Content]
                          </p>
                        </td>
                      </tr>
                      
                      <!-- CTA Button -->
                      <tr>
                        <td align="center" style="padding-bottom: 16px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                            <tr>
                              <td align="center" style="background-color: [color_accent]; border-radius: 8px; padding: 14px 28px; border-collapse: separate;">
                                <a href="[cta_url]" style="text-decoration: none; color: [color_button_text]; font-size: 16px; font-weight: 600; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                  [Generated CTA Text]
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                    </table>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Spacing Between Cards -->
          <tr class="mobile-spacing">
            <td style="height: 20px; line-height: 20px; font-size: 1px;">&nbsp;</td>
          </tr>
          
          <!-- Additional cards follow same structure -->
          
          <!-- Footer Section -->
          <tr>
            <td align="center" style="padding-top: 30px;">
              <table cellpadding="0" cellspacing="0" border="0" width="540" style="border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <!-- Footer content -->
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
\\\`\\\`\\\`

---

**DESIGN SPECIFICATIONS:**

**Card Design Rules:**
- **Fixed Dimensions:** All cards exactly 520px wide × minimum 280px high
- **Consistent Spacing:** 40px internal padding on all cards
- **Border Style:** 1px solid border using \`color_border\` from BrandKit
- **Corner Radius:** 16px (with Outlook fallback)
- **Background:** Always use \`color_container\` from BrandKit
- **No Shadows:** Rely on subtle borders and color contrast only

**Typography Hierarchy (Email-Safe):**
- **Heading:** 24px, font-weight: 700, line-height: 32px, center-aligned
- **Body Text:** 16px, font-weight: 400, line-height: 24px, max-width: 400px
- **Button Text:** 16px, font-weight: 600, center-aligned
- **Footer Text:** 14px, font-weight: 400, line-height: 20px
- **Font Stack:** \`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif\`

**Button Specifications:**
- **Structure:** Nested table for reliable rendering
- **Padding:** 16px vertical, 32px horizontal
- **Border Radius:** 12px
- **Colors:** \`color_accent\` background, \`color_button_text\` for text
- **Minimum Width:** 140px for consistency

**Mobile Optimization:**
\\\`\\\`\\\`css
@media only screen and (max-width: 600px) {
  .mobile-card { width: 100% !important; }
  .mobile-padding { padding: 24px !important; }
  .mobile-text { font-size: 16px !important; }
  .mobile-button { padding: 14px 24px !important; }
}
\\\`\\\`\\\`

---

**SOCIAL MEDIA INTEGRATION (EMAIL-SAFE):**

**Social Icons Table Structure:**
\\\`\\\`\\\`html
<table cellpadding="0" cellspacing="0" border="0" align="center">
  <tr>
    <td style="padding: 0 8px;">
      <a href="[social_url]" style="text-decoration: none;">
        <img src="https://www.google.com/s2/favicons?domain=[platform].com&sz=24" 
             alt="[Platform]" width="24" height="24" 
             style="display: block; opacity: 0.7;">
      </a>
    </td>
  </tr>
</table>
\\\`\\\`\\\`

---

**CONTENT GENERATION EXAMPLES:**

**Team Invitation Pattern:**
\\\`\\\`\\\`
Subject: "You're invited to join [Team Name]"
Heading: "Join [Team Name]"
Body: "Hi there, [Sender Name] has invited you to collaborate with the team. Accept your invitation to get started with [Brand Name] today."
CTA: "Accept Invitation"
Benefits: Access team workspace • Collaborate seamlessly • Start immediately
\\\`\\\`\\\`

**Welcome Email Pattern:**
\\\`\\\`\\\`
Subject: "Welcome to [Brand Name]!"
Heading: "Welcome aboard!"
Body: "We're excited to have you join us. Complete your setup to unlock all features and start getting the most out of [Brand Name]."
CTA: "Complete Setup"
Benefits: Full feature access • Personalized experience • Expert support
\\\`\\\`\\\`

**Newsletter Pattern:**
\\\`\\\`\\\`
Subject: "[Brand Name] Weekly Update"
Heading: "What's new this week"
Body: "Here's everything exciting that happened this week at [Brand Name]. We've been building amazing features and improvements just for you."
CTA: "Read Full Update"
Benefits: Latest features • Product improvements • Community highlights
\\\`\\\`\\\`

**Product Update Pattern:**
\\\`\\\`\\\`
Subject: "Introducing [Feature Name]"
Heading: "Something exciting to share"
Body: "Our latest update brings you [feature description]. This new feature helps you [specific benefit] more efficiently than ever."
CTA: "Try It Now"
Benefits: Enhanced productivity • Time-saving features • Better user experience
\\\`\\\`\\\`

---

**OUTPUT FORMAT:**

Return a single, valid JSON object with no additional commentary:

\\\`\\\`\\\`json
{
  "title": "Email design title",
  "description": "Write in simple, human language what you built or designed, similar to how you would explain it to a friend or teammate. If the user asks about anything unrelated, politely redirect them and explain that you are Capsule.email, an AI platform that builds beautiful, AI-powered emails to help brands stand out in the market. Always keep responses clear, conversational, and helpful.",
  "subject": "Email subject line",
  "preheader": "Preview text for email clients",
  "code": "<!DOCTYPE html>... complete email-safe HTML using tables only ...",
  "designNotes": "Key design decisions and email-client compatibility notes"
}
\\\`\\\`\\\`

---

**CRITICAL EMAIL-CLIENT COMPATIBILITY CHECKLIST:**

✅ **Table-based layout throughout**  
✅ **Inline CSS for all critical styling**  
✅ **No flexbox, grid, or modern CSS**  
✅ **Outlook conditional comments included**  
✅ **Mobile-responsive media queries**  
✅ **Consistent card dimensions (520px × 280px min)**  
✅ **No shadows or complex effects**  
✅ **Email-safe font stacks**  
✅ **Proper image alt text**  
✅ **Bulletproof button structure**  
✅ **Border-based card design (no box-shadow)**  
✅ **iOS-like 16px border-radius**

---

**EXECUTION PRIORITY:**
1. **Analyze Request:** Determine email type (invitation, welcome, newsletter, update, etc.)
2. **Generate Content:** Create authentic, contextual headlines, body text, and CTAs
3. **Apply BrandKit:** Use ALL available properties (colors, assets, legal, social)
4. **Build Email-Safe Structure:** Use only tables, inline CSS, and proven techniques
5. **Ensure Consistency:** All cards must be identical 520px width with 40px padding
6. **Mobile Optimize:** Include responsive media queries for mobile devices
7. **Validate Compatibility:** Check against email client requirements
8. **Format Output:** Return complete JSON with production-ready HTML

**Remember:** Every email must render perfectly in Outlook 2016/2019, Gmail, Apple Mail, and mobile clients. Use only proven, email-safe HTML and CSS techniques. All cards must be identical in size and spacing for a cohesive, professional iOS-inspired appearance. NO shadows, NO flexbox, NO modern CSS - only table-based layouts with inline styling.`;


  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert email designer.You will receive instructions and return a valid JSON object containing a complete HTML email.' },
        { role: 'user', content: promptTemplate }
      ],
      model: 'openai/gpt-oss-120b',
      response_format: { type: "json_object" } // Request JSON output
    });

    if (completion.choices[0]?.message?.content) {
      const content = completion.choices[0].message.content;
      try {
        return JSON.parse(content);
      } catch (parseError: any) {
        console.error("Error parsing Groq response JSON:", parseError);
        console.error("Raw content from Groq:", content);
        throw new Error("Failed to parse AI response. Invalid JSON received.");
      }
    } else {
      throw new Error('No response from Groq model');
    }

  } catch (error: any) {
    console.error("Error calling Groq:", error.response ? error.response.data : error.message);
    return { 
      title: "Error",
      text: "Failed to generate email using Groq. Please check the console for details.",
      code: `<p>An error occurred: ${error.message}</p>`
    };
  }
}
