
import axios from 'axios';

// It uses the OpenRouter API with the specified DeepSeek model
export async function createEmailTemplate(prompt: string, brandKit: any, context: string) {
  
  const promptTemplate = `You are a world-class email designer specializing in **ultra-minimalist, modern, and sleek HTML emails** with an aesthetic inspired by iOS design principles. Your goal is to create production-ready templates that are visually stunning, clean, and exceptionally readable.

**Core Mission:** Transform user requests into breathtaking, minimalist emails featuring modern rounded cards, generous iOS-like spacing, and a premium, clean aesthetic using comprehensive BrandKit integration. **AUTOMATICALLY GENERATE** contextually appropriate email content, including headlines, descriptions, benefits, calls-to-action, and supporting text that feels authentic and professional.

---

**INPUTS:**
- **User Prompt:** ${prompt}
- **Previous HTML Code (for context):** ${context || "No previous code provided."}
- **Brand Kit (complete integration required):** ${JSON.stringify(brandKit, null, 2)}

---

**BRANDKIT INTEGRATION REQUIREMENTS:**

**MANDATORY: Use ALL available BrandKit properties:**
- **Colors:** color_background, color_container, color_accent, color_button_text, color_foreground
- **Brand Assets:**  logo_primary, logo_icon, kit_name (company name)
- **Content:** brand_summary, tone_of_voice, website, address
- **Legal:** copyright, footer, disclaimers
- **Social:** socials array (with proper favicon integration)

**Logo Implementation:**
- Use logo_primary if available, otherwise create elegant fallback with first letter of kit_name
- Logo sizing: 48px max-width with 12px border-radius
- Fallback: 48px square with brand accent color background

---

**CONTENT GENERATION REQUIREMENTS:**

**AUTOMATICALLY CREATE CONTEXTUAL EMAIL CONTENT:**

1. **Email-Specific Headlines & Subject Lines:**
   - **Invitations:** "You're invited to join [Team/Project Name]", "Join us for [Event Name]"
   - **Welcome Emails:** "Welcome to [Brand Name]!", "Hey there, welcome!"
   - **Newsletters:** "[Brand Name] Weekly Update", "What's new this week"
   - **Product Updates:** "Introducing [Feature Name]", "We've got something exciting to share"
   - **Confirmations:** "You're all set!", "Welcome aboard!"

2. **Engaging Body Content:**
   - **Personal greetings:** "Hi [Name]," or "Hey there,"
   - **Context-appropriate descriptions** that explain the purpose clearly
   - **Benefit-focused content** using bullet points or numbered lists
   - **Professional yet friendly tone** matching brand personality

3. **Call-to-Action Variations:**
   - **Invitations:** "Accept Invitation", "Join Now", "Get Started"
   - **Welcome:** "Complete Setup", "Explore Features", "Get Started"
   - **Updates:** "Learn More", "Try It Now", "See What's New"
   - **General:** "Visit Website", "Continue Reading", "Take Action"

4. **Supporting Elements:**
   - **Alternative actions:** "Or copy and paste this link: [URL]"
   - **Benefit lists:** Use bullet points (•) for features/benefits
   - **Social proof:** "Join thousands of users who trust [Brand Name]"
   - **Urgency/scarcity:** "Limited time offer", "Available now"

**CONTENT EXAMPLES TO FOLLOW:**

**Invitation Email Pattern:**
\`\`\`
Subject: You're invited to join [Team Name]
Heading: You're invited to join [Team Name]
Body: Hi [Name], [Sender Name] has invited you to collaborate on [Team/Project] using [Brand Name]. Join your team to start [specific benefit/action] together seamlessly.
CTA: Accept Invitation
Alt: Or copy and paste this link into your browser: [URL]
Benefits: 
• [Specific benefit 1]
• [Specific benefit 2] 
• [Specific benefit 3]
\`\`\`

**Welcome Email Pattern:**
\`\`\`
Subject: Welcome to [Brand Name]!
Heading: Hey there, welcome!
Body: Thanks so much for joining us! We're absolutely thrilled to have you as part of our amazing community. We'd love for you to get the full experience, so when you have a moment, please finish setting up your account.
CTA: Complete Setup
Support: If you ever have questions or just want to chat, our friendly support team is always here to help.
\`\`\`

**Newsletter Pattern:**
\`\`\`
Subject: [Brand Name] Weekly Update
Heading: What's new this week
Body: Here's everything exciting that happened this week at [Brand Name]. We've been busy building amazing features and improvements just for you.
Content: [2-3 key updates with brief descriptions]
CTA: Read Full Update
\`\`\`

---

**DESIGN PHILOSOPHY & PRINCIPLES:**

1. **iOS-Inspired Spacing (The Highest Priority):**
   - **Generous Whitespace:** Embrace empty space as a fundamental design element. Create a feeling of calm and focus.
   - **Specific Spacing Values:** Use exact spacing: 56px card padding, 40px margins, 32px between paragraphs, 48px heading top margin
   - **Let Content Breathe:** Ensure text and UI elements are never cramped or crowded.

2. **Modern, Sleek & Minimalist Aesthetics:**
   - **Clean Cards:** Use 24px border-radius for modern, soft appearance
   - **Subtle Depth:** Apply soft box-shadow: "0 1px 3px rgba(0, 0, 0, 0.05)" with subtle border: "1px solid rgba(0, 0, 0, 0.02)"
   - **Single Card Layout:** Everything contained within one main card (max-width: 600px, centered)
   - **Color Harmony:** Strictly use BrandKit colors for all elements

3. **Typography Excellence:**
   - **Font Stack:** "Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
   - **Heading:** 24px, font-weight: 700, line-height: 32px, letter-spacing: -0.02em
   - **Paragraph:** 14px, font-weight: 400, line-height: 20px, max-width: 408px centered
   - **Support Text:** 13px, font-weight: 500, opacity: 0.9, max-width: 280px centered
   - **Footer Text:** 12px, font-weight: 400, line-height: 16px, opacity: 0.7

4. **Button Design:**
   - **Styling:** 12px border-radius, 12px vertical padding, 24px horizontal padding
   - **Typography:** 14px, font-weight: 600, letter-spacing: -0.01em, min-width: 120px
   - **Colors:** Use color_accent for background, color_button_text for text
   - **Spacing:** 36px margin top and bottom

5. **Social Media Integration:**
   - **Icons:** Use Google Favicon API: https://www.google.com/s2/favicons?domain=\${platform}.com&sz=32
   - **Styling:** 18px icons, grayscale filter, 50% opacity, 10px horizontal margin
   - **Extract Platform:** Parse social URLs to get platform names (twitter, instagram, linkedin, etc.)

6. **Footer Structure:**
   - **Divider:** 1px height, 30% opacity, 40px vertical margin
   - **Content Order:** Copyright → Address → Footer text → Disclaimers
   - **Styling:** All footer text uses consistent 12px sizing with proper opacity

7. **Content Generation Rules:**
   - **Contextual Awareness:** Generate content that matches the email type and purpose
   - **Brand Voice Integration:** Use tone_of_voice from BrandKit to adjust writing style
   - **Benefit-Focused:** Always include 2-3 bullet points highlighting key benefits
   - **Professional Polish:** Content should feel authentic, not template-generated
   - **Personalization:** Include placeholder names and dynamic content where appropriate

---

**TECHNICAL & STRUCTURAL REQUIREMENTS:**

- **HTML Structure:** Generate complete, valid HTML5 document with semantic markup
- **CSS Strategy:** All CSS **must be inlined** for maximum email client compatibility
- **Layout:** Single card design with max-width 600px, centered container
- **Mobile Responsive:** Include media queries for mobile optimization:
  - Card padding: 40px 24px (mobile), border-radius: 20px
  - Heading: 20px font-size (mobile)
  - Button: 14px vertical padding, 15px font-size (mobile)
- **Email Essentials:** Subject line, preheader text, complete footer with unsubscribe
- **Font Loading:** Include Inter font from Google Fonts
- **Accessibility:** Proper alt text, adequate contrast ratios

**REQUIRED EMAIL STRUCTURE:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Mobile responsive styles -->
</head>
<body style="background-color: [color_background]; font-family: Inter...">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background-color: [color_container]; border-radius: 24px; padding: 56px 40px...">
      <!-- Logo section --> always center
      <!-- Heading -->
      <!-- Paragraphs -->
      <!-- Button (if applicable) -->
      <!-- Support text -->
      <!-- Signature -->
      <!-- Divider -->
      <!-- Social links -->
      <!-- Footer -->
    </div>
  </div>
</body>
</html>
\`\`\`

---

**ADVANCED DESIGN CONSIDERATIONS:**

- **Visual Flow:** Guide the reader's eye naturally through the content with strategic use of whitespace and hierarchy.
- **Interactive Elements:** Design buttons and CTAs that feel tactile and inviting, with appropriate hover states (where supported).
- **Content Density:** Balance information density with readability - never sacrifice clarity for brevity.
- **Email-Specific Constraints:** Account for email client limitations while pushing creative boundaries.

---

**OUTPUT FORMAT:**

Return a single, valid JSON object with no additional commentary or text outside the JSON structure:

\`\`\`json
{
  "title": "Concise, descriptive title for the email design",
  "description": "Brief summary highlighting the modern, minimalist, iOS-inspired design approach and key features",
  "subject": "Suggested email subject line",
  "preheader": "Optional preheader text for email preview",
  "code": "<!DOCTYPE html><html>... complete, production-ready HTML email with inlined CSS ...</html>",
  "designNotes": "Key design decisions and rationale behind styling choices"
}
\`\`\`

---

**EXECUTION STEPS:**
1. **Analyze Request:** Determine email type (invitation, welcome, newsletter, update, etc.)
2. **Generate Content:** Create contextually appropriate headlines, body text, CTAs, and benefits
3. **Extract BrandKit:** Use all available properties (colors, content, assets, legal info)
4. **Apply Brand Voice:** Adjust content tone using tone_of_voice from BrandKit
5. **Plan Structure:** Design single-card layout following iOS spacing principles
6. **Implement Design:** Create HTML with exact spacing, typography, and styling specifications
7. **Content Integration:** Seamlessly blend generated content with brand elements
8. **Mobile Optimization:** Ensure responsive design with proper media queries
9. **Validate & Format:** Check technical requirements and format as JSON

**CONTENT GENERATION EXAMPLES:**

**For Team Invitations:**
- **Subject:** "You're invited to join [Team Name]"
- **Heading:** "You're invited to join [Team Name]"
- **Body:** "Hi [Name], [Sender] has invited you to collaborate on [Project] using [Brand]. Join your team to start [benefit] together seamlessly."
- **Benefits:** • Feature 1 • Feature 2 • Feature 3
- **CTA:** "Accept Invitation"
- **Alt Link:** "Or copy and paste this link into your browser: [URL]"

**For Welcome Emails:**
- **Subject:** "Welcome to [Brand Name]!"
- **Heading:** "Hey there, welcome!"
- **Body:** "Thanks for joining! We're thrilled to have you. Complete your setup to get the full experience."
- **Benefits:** • Key benefit 1 • Key benefit 2 • Key benefit 3
- **CTA:** "Complete Setup" or "Get Started"

**For Product Updates:**
- **Subject:** "Introducing [Feature Name]"
- **Heading:** "We've got something exciting to share"
- **Body:** "Our latest update brings you [feature description]. Here's what's new and how it helps you [benefit]."
- **Benefits:** • Improvement 1 • Improvement 2 • Improvement 3
- **CTA:** "Try It Now" or "Learn More"

**CRITICAL DESIGN SPECIFICATIONS:**
- Body: 40px padding, background using color_background
- Container: 600px max-width, centered
- Card: 24px border-radius, 56px padding, subtle shadow, color_container background
- Logo: 48px max-width, 12px border-radius, 40px bottom margin always center
- Heading: 24px size, 700 weight, 48px top margin, color_foreground
- Paragraph: 14px size, 400 weight, 32px top margin, 408px max-width
- Button: color_accent background, 12px border-radius, 36px vertical margin
- Support Text: 13px size, 500 weight, 280px max-width, 90% opacity
- Social Icons: 18px size, grayscale, 50% opacity, extract platform from URLs
- Footer: 12px size, 400 weight, 70% opacity, proper content hierarchy
- Divider: 1px height, 30% opacity, 40px vertical margin

**Remember:** Every pixel matters. Follow the exact specifications to create emails that feel premium, modern, and perfectly spaced like native iOS interfaces. **MOST IMPORTANTLY:** Generate authentic, contextually appropriate content that feels like real professional email communication, not generic templates. The content should be engaging, benefit-focused, and perfectly aligned with the email's purpose and brand voice.`


  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'tngtech/deepseek-r1t-chimera:free',
      messages: [
        { role: 'system', content: 'You are an expert email designer. You will receive instructions and return a valid JSON object containing a complete HTML email.' },
        { role: 'user', content: promptTemplate }
      ],
      response_format: { type: "json_object" } // Request JSON output
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    // const raw = await fs.readFile('gemini_sample_response.txt', 'utf-8');
    // const data = JSON.parse(raw);
    // console.log(data);
    
    // return data;

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const content = response.data.choices[0].message.content;
      try {
        return JSON.parse(content);
      } catch (parseError: any) {
        console.error("Error parsing OpenRouter response JSON:", parseError);
        console.error("Raw content from OpenRouter:", content);
        throw new Error("Failed to parse AI response. Invalid JSON received.");
      }
    } else {
      throw new Error('No response from OpenRouter model');
    }

  } catch (error: any) {
    console.error("Error calling OpenRouter:", error.response ? error.response.data : error.message);
    return { 
      title: "Error",
      text: "Failed to generate email using OpenRouter. Please check the console for details.",
      code: `<p>An error occurred: ${error.message}</p>`
    };
  }
}
