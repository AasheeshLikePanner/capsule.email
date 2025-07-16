import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function createBrandedEmailTemplate(data: { name: string; description: string; logo: string; theme: { background: string | null; container: string | null; accent: string | null; buttonText: string | null; foreground: string | null; }; tone: string; footer: { text: string; socials: Record<string, string>; copyright: string; address: string; disclaimers: string; }; }) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, {});

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


//  const prompt = `You are an expert React Email generator and brand data validator. You are given a JSON object containing brand metadata. You must return a valid JSON object with exactly two keys: fixedData and component.

// Your task is divided into two parts and must follow these rules strictly.

// PART 1: fixedData

// You must clean the brand data carefully and safely. Return the cleaned version under the key fixedData. Follow these rules:

// 1. Never erase or reset a valid value. Keep all valid strings, objects, or empty strings exactly as they are.
// 2. Only fix individual values that are clearly broken.
// 3. Never hallucinate or invent any new value.

// FIELD RULES:

// - name:
//   - If it contains suffixes like ".com", "- UI", "by Resend", "/ homepage", or trailing slashes, remove only those suffixes.
//   - Do NOT rename the brand. Do NOT generate a new name.

// - description:
//   - Keep as-is unless it has clear grammar issues.
//   - Only make small, safe fixes (e.g. punctuation).
//   - Do NOT rewrite or generate new text.
//   - if not present genrate accoridng to name short and simple

// - logo:
//   - Preserve exactly as-is. Never change or invent a logo.

// - theme:
//   - or each theme field (background, container, accent, buttonText, foreground), do not touch the value if it already exists.
//       Only replace the individual color if:
//       It is missing 

// - tone:
//   - If missing, add: "tone": "professional"

// - footer:
//   - Preserve all valid values.
//   - Leave any missing field as an empty string or empty object.
//   - Never generate or modify social links or text.

// - brandSummary:
//   - Add a new key: "brandSummary"
//   - It should be a one-line professional summary using only the cleaned name and description.
//   - If needed, look up the brand name or domain to write it better.
//   - Never invent features or hallucinate functionality.
//   - If no clear info is found, just write a general safe summary.

// PART 2: component

// You must generate a complete valid React component email using only react-email components. Return the code as a string under the key component.

// Rules for this React email:

// 1. You must use only the following official components:
//    Html, Head, Body, Container, Section, Text, Img, Button, Hr, Link, Preview

// 2. Do not use:
//    - Raw HTML
//    - className
//    - style tags
//    - Tailwind
//    - External CSS
//    - Fragment (<></>)
//    - Invalid props

// 3. Styling must be inline style objects only, using valid React syntax.
//    Example: style={{ backgroundColor: '#ffffff', padding: '20px' }}

// 4. The component must be complete and valid:
//    - Start with import statements from @react-email/components
//    - Use: export default function WelcomeEmail() { return (...) }

// 5. The email layout must include:
//    - Logo at the top (Img)
//    - A welcome heading using the cleaned brand name
//    - A short paragraph using the cleaned description
//    - A CTA Button saying “Get Started” or “Join Now” using theme.accent and theme.buttonText
//    - A “Brand Summary” section with fixedData.brandSummary
//    - A footer:
//      - Use footer.text
//      - Render any valid socials (e.g., twitter, github) using Link components

// OUTPUT FORMAT:

// Return a single JSON object with only two keys:

// {
//   "fixedData": { ...fixed and cleaned input... },
//   "component": "import { Html, Head, Body, Container, Section, Text, Img, Button, Link, Hr, Preview } from '@react-email/components'; export default function WelcomeEmail() { return ( ... ) }"
// }

// ❌ DO NOT return:
// - JSX-only
// - Markdown
// - Code fences
// - Formatting
// - \n or \\
// - Comments or explanation

// ✅ Only return clean raw JSON with fixedData and component.
// SAMPLE INPUT:
// ${JSON.stringify(data)}
// `;