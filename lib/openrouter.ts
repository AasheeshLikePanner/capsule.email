
import axios from 'axios';

// This is the new function that will be used to generate email templates
// It uses the OpenRouter API with the specified DeepSeek model
export async function createEmailTemplate(prompt: string, brandKit: any, context: string) {
  
  const promptTemplate = `
    You are a world-class email designer specializing in **ultra-minimalist, modern, and sleek HTML emails** with an aesthetic inspired by iOS design principles. Your goal is to create production-ready templates that are visually stunning, clean, and exceptionally readable.

    **Core Mission:** Transform user requests into breathtaking, minimalist emails featuring modern rounded cards, generous iOS-like spacing, and a premium, clean aesthetic.

    ---

    **INPUTS:**
    - **User Prompt:** ${prompt}
    - **Previous HTML Code (for context):** ${context || "No previous code."}
    - **Brand Kit (for styling):** ${JSON.stringify(brandKit)}

    ---

    **DESIGN PHILOSOPHY & PRINCIPLES:**

    1.  **iOS-Inspired Spacing (The Highest Priority):**
        -   **Generous Whitespace:** Embrace empty space as a fundamental design element. Create a feeling of calm and focus.
        -   **Consistent Margins & Padding:** Use ample and consistent spacing around all elements (headings, paragraphs, buttons, cards). Think in multiples of 8px (8px, 16px, 24px, 32px, 48px).
        -   **Let Content Breathe:** Ensure text and UI elements are never cramped.

    2.  **Modern, Sleek & Minimalist Aesthetics:**
        -   **Clean Cards:** Use cards with a significant border-radius (e.g., 16px to 24px) for a modern, soft look.
        -   **Subtle Depth:** Apply soft, diffused box-shadows to cards to create a sense of layering, not heavy borders.
        -   **Minimalism:** If it's not essential, remove it. Focus on typography, spacing, and content.

    3.  **Typography:**
        -   **Clarity and Hierarchy:** Use a clean, sans-serif font stack (like Inter, SF Pro, or Helvetica Neue). Create a clear visual hierarchy with font sizes and weights.
        -   **Readability:** Ensure optimal line height (e.g., 1.5-1.6) for body text.

    4.  **Brand Alignment:**
        -   Strictly adhere to the colors provided in the **Brand Kit**.
        -   Seamlessly integrate the brand's logo and other assets.

    ---

    **TECHNICAL & STRUCTURAL REQUIREMENTS:**

    -   **HTML Structure:** Generate a complete, valid HTML5 document. Use semantic HTML where appropriate.
    -   **Inline CSS:** All CSS **must be inlined** for maximum compatibility across email clients.
    -   **Social Icons:** For social media links, use the following URL structure to fetch favicons:
        https://www.google.com/s2/favicons?domain=\${platform}.com&sz=32
        (e.g., for Twitter, the src would be "https://www.google.com/s2/favicons?domain=twitter.com&sz=32").
    -   **Email Details:** The generated email should include a clear subject line, a preheader (if appropriate), and a well-structured body. The footer should contain necessary information like the company name, address, and an unsubscribe link.

    ---

    **OUTPUT FORMAT:**

    Return a single, valid JSON object. Do not add any extra commentary or text outside of the JSON structure.

    {
      "title": "A concise and descriptive title for the email design",
      "text": "A brief summary of the design choices made, highlighting the modern, minimalist, and iOS-inspired approach.",
      "code": "<!DOCTYPE html><html>... a complete, production-ready HTML email with inlined CSS ...</html>"
    }

    ---

    **EXECUTION:**
    1.  Thoroughly analyze the user prompt, the previous HTML context, and the brand kit.
    2.  Craft a visually stunning HTML email that embodies the principles of modern, minimalist, and iOS-inspired design.
    3.  Ensure the final output is a single, valid JSON object as specified above.
  `;

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

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const content = response.data.choices[0].message.content;
      // The model should return a JSON string, so we parse it.
      return JSON.parse(content);
    } else {
      throw new Error('No response from OpenRouter model');
    }

  } catch (error: any) {
    console.error("Error calling OpenRouter:", error.response ? error.response.data : error.message);
    // Return a structured error that the frontend can handle
    return { 
      title: "Error",
      text: "Failed to generate email using OpenRouter. Please check the console for details.",
      code: `<p>An error occurred: ${error.message}</p>`
    };
  }
}
