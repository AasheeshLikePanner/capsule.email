import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer'
import { createBrandedEmailTemplate } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';


export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid URL' }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    const result = await page.evaluate(() => {
      const get = (selector: string, attr = 'content') =>
        document.querySelector(selector)?.getAttribute(attr) || '';

      const getColor = (selector: string, prop = 'color') => {
        const el = document.querySelector(selector);
        return el ? window.getComputedStyle(el)[prop as any] : null;
      };

      const extractFooterText = () => {
        const footer = document.querySelector('footer');
        if (!footer) return '';
        return footer.innerText.trim().replace(/\s+/g, ' ').slice(0, 500);
      };

      const extractSocials = () => {

        const links = Array.from(document.querySelectorAll('footer a[href]')) as HTMLAnchorElement[];
        links.push(...Array.from(document.querySelectorAll('header a[href]')) as HTMLAnchorElement[]);
        const s = Array.from(document.querySelectorAll('header a[href]')) as HTMLAnchorElement[];

        const socials: Record<string, string> = {};
        links.forEach(link => {
          const href = link.href;
          if (href.includes('facebook.com')) socials.facebook = href;
          else if (href.includes('twitter.com')) socials.twitter = href;
          else if (href.includes('instagram.com')) socials.instagram = href;
          else if (href.includes('linkedin.com')) socials.linkedin = href;
          else if (href.includes('github.com')) socials.github = href;

        });
        return socials;
      };

      const title = get('meta[property="og:site_name"]') || document.title || '';
      const description =
        get('meta[name="description"]') || get('meta[property="og:description"]') || '';

      const logo =
        get('link[rel="icon"]', 'href') ||
        get('meta[property="og:image"]', 'content') ||
        get('link[rel="apple-touch-icon"]', 'href') ||
        '';
      return {
        title,
        description,
        logo,
        theme: {
          background: getColor('body', 'background-color'),
          container: getColor('main') || getColor('.container'),
          accent: getColor('a') || getColor('button'),
          buttonText: getColor('button', 'color'),
          foreground: getColor('body') || getColor('p')
        },
        footer: {
          text: extractFooterText(),
          socials: extractSocials()
        }
      };
    });

    await browser.close();

    const fullLogo = result.logo?.startsWith('http') ? result.logo : new URL(result.logo, url).href;

    const brandKitData = {
      name: result.title.trim(),
      description: result.description.trim(),
      logo: fullLogo,
      theme: result.theme,
      tone: 'professional',
      footer: {
        ...result.footer,
        copyright: result.footer.text.match(/©[^.]+/)?.[0]?.trim() || '',
        address: result.footer.text.match(/\d{1,5}[\w\s,.]+(?:India|USA|UK|Street|Avenue|Road)/i)?.[0] || '',
        disclaimers: result.footer.text.match(/(terms|disclaimer|rights|reserved).{0,100}/i)?.[0] || ''
      }
    };
    // await sleep(10000); // Pause for 2 seconds (2000 milliseconds)
    console.log(brandKitData);


    const rawFixedBrandKitString: any = await createBrandedEmailTemplate(brandKitData);
    console.log(rawFixedBrandKitString);
    

    const cleanedString = cleanJSONBlock(rawFixedBrandKitString);
    const parsedFixedBrandKit = JSON.parse(cleanedString);

    const fixedBrandKit = parsedFixedBrandKit.fixedData;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('brandkits')
      .insert([
        {
          user_id: user.id,
          kit_name: fixedBrandKit.name,
          website: url, // Using description for website as website field is not in fixedData
          brand_summary: fixedBrandKit.brandSummary,
          address: fixedBrandKit.footer.address,
          tone_of_voice: fixedBrandKit.tone,
          copyright: fixedBrandKit.footer.copyright,
          footer: fixedBrandKit.footer.text,
          disclaimers: fixedBrandKit.footer.disclaimers,
          socials: Object.values(fixedBrandKit.footer.socials),
          logo_primary: fixedBrandKit.logo,
          logo_icon: fixedBrandKit.logo, // Assuming logo_icon is same as logo_primary
          color_background: fixedBrandKit.theme.background,
          color_container: fixedBrandKit.theme.container,
          color_accent: fixedBrandKit.theme.accent,
          color_button_text: fixedBrandKit.theme.buttonText,
          color_foreground: fixedBrandKit.theme.foreground,
        },
      ])
      .select();

    if (error) {
      console.error('[Supabase insert error]', error);
      return NextResponse.json({ error: 'Failed to save brand kit' }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (err) {
    console.error('[Scraper error]', err);
    return NextResponse.json({ error: 'Failed to fetch site info' }, { status: 500 });
  }
}
const sleep = (ms: any) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


function cleanJSONBlock(raw: string): string {
  return raw
    .replace(/```json\s*/, "")
    .replace(/```$/, "")
    .trim();
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { data: brandKits, error } = await supabase
    .from('brandkits')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('[Supabase fetch error]', error);
    return NextResponse.json({ error: 'Failed to fetch brand kits' }, { status: 500 });
  }

  return NextResponse.json(brandKits, { status: 200 });
}


