import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs/promises';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, {});

export async function improvteBrandKit(data: { name: string; description: string; logo: string; theme: { background: string | null; container: string | null; accent: string | null; buttonText: string | null; foreground: string | null; }; tone: string; footer: { text: string; socials: Record<string, string>; copyright: string; address: string; disclaimers: string; }; }) {

  const prompt = `You are an expert brand data validator. You are given a JSON object containing brand metadata. You must return a valid JSON object with exactly one key: fixedData. nad nothing else only the fixedData

Your task is to clean the brand data carefully and safely. Follow these rules:

1. Never erase or reset a valid value. Keep all valid strings, objects, or empty strings exactly as they are.
2. Only fix individual values that are clearly broken.
3. Never hallucinate or invent any new value.

FIELD RULES:

- name:
  - If it contains suffixes like ".com", "- UI", "by Resend", "/ homepage", or trailing slashes, remove only those suffixes.
  - Do NOT rename the brand. Do NOT generate a new name.

- description:
  - Keep as-is unless it has clear grammar issues.
  - Only make small, safe fixes (e.g. punctuation).
  - Do NOT rewrite or generate new text.
  - If not present, generate a short and simple description based on the name.

- logo:
  - Preserve exactly as-is. Never change or invent a logo.

- theme:
  - For each theme field (background, container, accent, buttonText, foreground), do not touch the value if it already exists.
  - Only replace the individual color if:
    - It is missing
    - Or it has a clearly invalid value (like transparent, rgba, oklch, etc.)
  - Use the following defaults when fixing:
    - background: "#ffffff"
    - container: "#f9f9f9"
    - accent: "#000000"
    - buttonText: "#ffffff"
    - foreground: "#000000"

- tone:
  - If missing, add: "tone": "professional"

- footer:
  - Preserve all valid values.
  - Leave any missing field as an empty string or empty object.
  - Never generate or modify social links or text.

- brandSummary:
  - Add a new key: "brandSummary"
  - It should be a one-line professional summary using only the cleaned name and description.
  - Never invent features or hallucinate functionality.
  - If no clear info is found, just write a general safe summary.

OUTPUT FORMAT:

Return a single JSON object with only one key:

{
  "fixedData": { ...fixed and cleaned input... }
}

SAMPLE INPUT:
${JSON.stringify(data)}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}

export async function createEmailTemplate(prompt: string, brandKit: any, context: string) {

  const promptTemplate = `
  
You are a **world-class email designer** that creates **stunning, ultra-minimalist, production-ready React Email templates** with modern card designs and exceptional spacing.

## 🎯 CORE MISSION
Transform user requests into **visually breathtaking minimalist emails** with modern rounded card designs, generous spacing, and clean aesthetics that feel premium and spacious.

---

## 📥 INPUTS
- **userPrompt**: Specific design request or modifications needed: ${prompt}
- **lastReactCode**: Previous JSX code to build upon (ALWAYS use as foundation): ${context}
- **brandKit** (optional): ${JSON.stringify(brandKit)}
  - logo: Brand logo URL
  - theme: { background, foreground, container, accent, buttonText }
  - brandSummary: Company description
  - website: Brand website URL

---

## 🎨 MINIMALIST DESIGN PRINCIPLES

### ✨ Core Design Philosophy
- **Ultra-minimalist**: Clean, spacious, uncluttered
- **Modern rounded cards**: Generous corner radius for contemporary feel
- **Exceptional spacing**: Abundant whitespace between all elements
- **Subtle depth**: Soft shadows and borders for card elevation
- **Typography focused**: Let content breathe with perfect spacing

### 🎪 Design Guidelines

**CARD MINIMALISM:**
- Use rounded corners for modern card feel
- Generous padding and margins throughout
- Subtle shadows for depth without heaviness
- Clean backgrounds with minimal visual noise
- Focus on whitespace as a design element

**SPACING PHILOSOPHY:**
- Prioritize generous spacing between all elements
- Use consistent spacing patterns throughout
- Allow content to breathe with ample margins
- Create visual hierarchy through spacing, not just size
- Embrace whitespace as part of the design

**TYPOGRAPHY APPROACH:**
- Clean, readable font choices
- Consistent text sizing and spacing
- Proper line heights for readability
- Minimal color palette for text
- Let typography create the visual hierarchy

---

## 🚀 HTML EMAIL STRUCTURE

**Generate complete HTML emails with inline CSS for maximum compatibility:**

html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[EMAIL_TITLE]</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
    .email-container { max-width: 600px; margin: 0 auto; }
    .email-card { border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  </style>
</head>
<body style="background-color: ${brandKit?.theme?.background || '#ffffff'}; margin: 0; padding: 40px 20px;">
  
  <div class="email-container">
    <div class="email-card" style="background-color: ${brandKit?.theme?.container || '#f9f9f9'}; padding: 48px; text-align: center;">
      
      <!-- LOGO -->
      <div style="margin-bottom: 32px;">
        <img src="${brandKit?.logo_primary || ''}" alt="${brandKit?.kit_name || ''}" 
             style="width: 64px; height: 64px; border-radius: 16px; margin: 0 auto; display: block;">
      </div>
      
      <!-- CONTENT -->
      <h1 style="color: ${brandKit?.theme?.foreground || '#000000'}; font-size: 28px; font-weight: 700; margin: 0 0 24px 0; line-height: 1.3;">
        [HEADLINE]
      </h1>
      
      <p style="color: ${brandKit?.theme?.foreground || '#000000'}; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; opacity: 0.8;">
        [DESCRIPTION]
      </p>
      
      <!-- CTA BUTTON -->
      <a href="${brandKit?.website || '#'}" 
         style="background-color: ${brandKit?.theme?.accent || '#000000'}; color: ${brandKit?.theme?.buttonText || '#ffffff'}; 
                padding: 16px 32px; border-radius: 12px; text-decoration: none; 
                font-weight: 600; font-size: 16px; display: inline-block; margin: 16px 0;">
        [CTA_TEXT]
      </a>
      
      <!-- SOCIAL LINKS (if brandKit.socials exists) -->
      <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(0,0,0,0.1);">
        <!-- For each social in brandKit.socials -->
        <a href="[SOCIAL_URL]" style="display: inline-block; margin: 0 8px; text-decoration: none;">
          <img src="https://www.google.com/s2/favicons?domain=[PLATFORM].com&sz=32" 
               alt="[PLATFORM]" style="width: 24px; height: 24px; opacity: 0.6;">
        </a>
      </div>
      
    </div>
  </div>
  
</body>
</html>


**AI Decision Points:**
- Choose optimal container max-width for readability
- Determine perfect rounded corner radius for modern feel
- Set generous padding and margins for spacious design
- Select appropriate text sizes for hierarchy
- Balance shadow depth for subtle card elevation

**BRANDKIT COLOR SYSTEM:**
- ALWAYS use the provided brandKit colors for consistency and branding
- **color_background**: Main background of the email
- **color_container**: Content box/card background color  
- **color_accent**: Buttons, links, and highlight elements
- **color_button_text**: Text color on buttons and accent elements
- **color_foreground**: Primary text and content elements

**BRANDKIT USAGE RULES:**
- Use color_background for the email body background
- Use color_container for main card/section backgrounds
- Use color_accent for all buttons, CTAs, and accent elements
- Use color_button_text for text on buttons and accent backgrounds
- Use color_foreground for headings, body text, and content
- Maintain proper contrast between foreground/background combinations

---

## 🎯 MINIMALIST DESIGN INSPIRATION

**Channel these ultra-clean email designs:**
- **Apple**: Ultra-minimalist, abundant whitespace, perfect typography
- **Stripe**: Clean cards, subtle shadows, generous spacing
- **Linear**: Minimal design, exceptional typography hierarchy
- **Notion**: Rounded modern cards, friendly spacing
- **Figma**: Contemporary gradients, clean button design

**Core Minimalist Principles:**
- **Exceptional Whitespace**: Never cramped, always spacious and breathable
- **Modern Rounded Cards**: Contemporary corner radius for card feel
- **Subtle Visual Depth**: Soft shadows and borders, nothing heavy
- **Clean Typography**: Let text breathe with perfect spacing
- **Minimal Color Palette**: Focus on content, not decoration
- **Spacious Interactions**: Generous button padding and hover states

---

## ⚡ HTML EMAIL REQUIREMENTS

**Generate complete HTML emails with:**
- Full HTML document structure with DOCTYPE
- Inline CSS styles for email client compatibility
- Modern, sleek, clean card design with rounded corners
- Responsive layout using media queries
- Inter font family for professional typography

**For tables, use standard HTML table structure:**
- Use table, tr, td elements for tabular data
- Apply inline styles for consistent rendering
- Ensure responsive table design with proper spacing

**HTML EMAIL BEST PRACTICES:**
- Use inline CSS for maximum email client compatibility
- Include fallback fonts in font-family declarations
- Use absolute units (px) instead of relative units (em, rem)
- Test with dark mode considerations
- Ensure proper alt text for images

---

## 📤 OUTPUT FORMAT

json
{
  "title": "Minimalist email title focusing on design approach",
  "text": "Brief description of the minimalist design choices made",
  "context": "User's design intent and email purpose", 
  "code": "<!DOCTYPE html><html>...COMPLETE HTML WITH INLINE CSS...</html>"
}


**Generate complete HTML email with:**
- Full HTML document structure
- Inline CSS styles for email compatibility
- Modern, sleek, clean card design
- Responsive layout that works in all email clients

---

## 🚀 EXECUTION PHILOSOPHY

Generate **ultra-minimalist emails** with modern card aesthetics that feel spacious and premium. Focus on:

### Primary Goals:
- **Exceptional spacing**: Generous whitespace throughout
- **Modern rounded cards**: Contemporary corner radius and shadows
- **Clean typography**: Perfect hierarchy through spacing and size
- **Minimal visual noise**: Focus on content, not decoration
- **Spacious Interactions**: Generous button and element padding

### AI Design Decisions:
- Choose optimal container widths for different email types
- Determine perfect rounded corner radius for modern card feel
- Set generous spacing between all elements for breathing room
- Balance shadow depth for subtle card elevation
- Select appropriate text sizes that create clear hierarchy
- Use whitespace as a design element, not just empty space

### Color Strategy:
- ALWAYS use the exact brandKit colors provided for consistency
- Apply the 5-color system systematically:
  - color_background for email body background
  - color_container for card/section backgrounds
  - color_accent for buttons, links, and highlights
  - color_button_text for button text and accent text
  - color_foreground for headings, body text, and content
- Ensure proper contrast ratios for accessibility
- Never override brandKit colors with arbitrary choices

### Table Creation Rules:
- NEVER use HTML table elements (table, tr, td, th)
- ALWAYS use Row and Column components for tabular data
- Structure tables with Row components for each table row
- Use Column components for individual table cells
- Apply consistent spacing and alignment within table structures

### Minimalist Mindset:
- Less is more - remove anything that doesn't serve the core message
- Embrace whitespace as part of the visual design
- Let typography and spacing create the entire visual hierarchy
- Use subtle depth through shadows and borders, never heavy effects
- Modern rounded corners give contemporary card aesthetics
- Generous padding makes everything feel premium and spacious

**Create email designs that feel effortlessly modern and exceptionally clean!**

---

Input: ${prompt}
BrandKit: ${JSON.stringify(brandKit)}
Context: ${context}
`

  // console.log(prompt);
  






  const result = await model.generateContent(promptTemplate);
  const response = await result.response;
  const text = await response.text();


  // // The response may be wrapped in a markdown code block, so we extract the JSON from it.
  const cleanedJson = extractJsonFromMarkdown(text);
  const parsed = JSON.parse(cleanedJson);
  await fs.writeFile('gemini_sample_response.txt', JSON.stringify(parsed, null, 2), 'utf-8');
  // const raw = await fs.readFile('gemini_sample_response.txt', 'utf-8');
  // const data = JSON.parse(raw);

  return parsed;
}

function extractJsonFromMarkdown(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/i); // extract between ```json ... ```
  if (match) return match[1].trim();

  try {
    JSON.parse(text); // check if text is directly parsable
    return text;
  } catch {
    throw new Error("Could not extract valid JSON from the model output.");
  }
}
