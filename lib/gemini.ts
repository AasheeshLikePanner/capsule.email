import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, {});

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

export async function createEmailTemplate(prompt: string) {
  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()));
      }
      controller.close();
    },
  });

  return stream;
}