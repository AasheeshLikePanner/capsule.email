import chromium from '@sparticuz/chromium';
import puppeteer, { Browser } from 'puppeteer-core';

let browserInstance: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    console.log('Launching new Puppeteer browser instance...');

    const executablePath = await chromium.executablePath();

    const options = {
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ],
      executablePath,
      headless: process.env.NODE_ENV === 'production' ? (chromium as any).headless : true,
      ignoreHTTPSErrors: true,
    };

    browserInstance = await puppeteer.launch(options as any);

    // Optional: Add a listener to log when the browser disconnects
    browserInstance.on('disconnected', () => {
      console.error('Puppeteer browser disconnected. Re-initializing on next request.');
      browserInstance = null; // Allow re-initialization
    });
  }
  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    console.log('Puppeteer browser closed.');
  }
}

// You might want to call closeBrowser on application shutdown (e.g., in a global cleanup hook if your framework supports it)
// For Next.js, this might be tricky as serverless functions are stateless. 
// However, for a long-running server, this is crucial.
