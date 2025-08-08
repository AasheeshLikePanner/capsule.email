'use server';

import { getBrowser } from '@/lib/puppeteer-browser';
import { improvteBrandKit } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';
import axios from 'axios';

function cleanJSONBlock(raw: string): string {
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    return match[0];
  }
  return raw;
}

export async function createBrandKit(url: string) {
  if (!url || typeof url !== 'string') {
    throw new Error('Missing or invalid URL');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const browser = await getBrowser();

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    // @ts-ignore
    // await page.waitForTimeout(2000); // Wait for 2 seconds to ensure all content is loaded
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });
    const result = await page.evaluate(() => {
      const get = (selector: string, attr = 'content') =>
        document.querySelector(selector)?.getAttribute(attr) || '';

      const getColor = (selector: string, prop = 'color') => {
        const el = document.querySelector(selector);
        return el ? window.getComputedStyle(el)[prop as any] : null;
      };

      // Enhanced logo extraction function
      const extractHighResLogo = () => {
        const logoSources = [];

        // 1. Look for structured data (JSON-LD)
        const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        for (const script of jsonLdScripts) {
          try {
            const data = JSON.parse(script.textContent || '');
            if (data.logo) {
              logoSources.push({
                url: typeof data.logo === 'string' ? data.logo : data.logo.url,
                source: 'json-ld',
                priority: 10
              });
            }
            if (data.image) {
              logoSources.push({
                url: typeof data.image === 'string' ? data.image : data.image.url,
                source: 'json-ld-image',
                priority: 8
              });
            }
          } catch (e) {
            // Skip invalid JSON-LD
          }
        }

        // 2. Look for common logo selectors with high priority
        const logoSelectors = [
          'img[alt*="logo" i]',
          'img[class*="logo" i]',
          'img[id*="logo" i]',
          '.logo img',
          '#logo img',
          'header img[src*="logo" i]',
          'nav img[src*="logo" i]',
          '.navbar img',
          '.header img',
          '.brand img',
          '.site-logo img',
          '[class*="brand"] img'
        ];

        logoSelectors.forEach((selector, index) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((img:any) => {
            if (img.src && img.src !== '') {
              logoSources.push({
                url: img.src,
                source: `css-selector-${selector}`,
                priority: 9 - index * 0.1,
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height
              });
            }
          });
        });

        // 3. Look for SVG logos (vector graphics - best quality)
        const svgLogos = document.querySelectorAll('svg[class*="logo" i], svg[id*="logo" i], .logo svg, #logo svg');
        svgLogos.forEach(svg => {
          // Try to convert SVG to data URL or find if it has xlink:href
          const svgData = new XMLSerializer().serializeToString(svg);
          logoSources.push({
            url: `data:image/svg+xml;base64,${btoa(svgData)}`,
            source: 'svg-inline',
            priority: 11,
            width: svg.getAttribute('width') || 200,
            height: svg.getAttribute('height') || 200
          });
        });

        // 4. Look for high-res favicons and touch icons
        const iconSelectors = [
          'link[rel="apple-touch-icon-precomposed"]',
          'link[rel="apple-touch-icon"]',
          'link[rel="icon"][sizes]',
          'link[rel="shortcut icon"][sizes]',
          'meta[property="og:image"]',
          'meta[name="twitter:image"]'
        ];

        iconSelectors.forEach((selector, index) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            const href = element.getAttribute('href') || element.getAttribute('content');
            if (href) {
              const sizes = element.getAttribute('sizes');
              let priority = 5 - index * 0.1;
              let dimensions = { width: 0, height: 0 };

              if (sizes && sizes !== 'any') {
                const [width, height] = sizes.split('x').map(Number);
                dimensions = { width, height };
                // Higher priority for larger icons
                if (width >= 192) priority += 2;
                else if (width >= 96) priority += 1;
              }

              logoSources.push({
                url: href,
                source: `meta-${element.getAttribute('rel') || element.getAttribute('property')}`,
                priority,
                ...dimensions
              });
            }
          });
        });

        // 5. Look for common logo file patterns in the first few images
        const allImages = Array.from(document.querySelectorAll('img')).slice(0, 20);
        allImages.forEach(img => {
          if (img.src && (
            img.src.includes('logo') ||
            img.src.includes('brand') ||
            img.src.includes('header') ||
            (img.alt && img.alt.toLowerCase().includes('logo'))
          )) {
            logoSources.push({
              url: img.src,
              source: 'pattern-match',
              priority: 6,
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height
            });
          }
        });

        // Sort by priority and filter duplicates
        const uniqueLogos = logoSources
          .filter((logo, index, self) => 
            index === self.findIndex(l => l.url === logo.url)
          )
          .sort((a, b) => b.priority - a.priority);

        return uniqueLogos;
      };

      const extractFooterText = () => {
        const footer = document.querySelector('footer');
        if (!footer) return '';
        return footer.innerText.trim().replace(/\s+/g, ' ').slice(0, 500);
      };

      const extractSocials = () => {
        const links = Array.from(document.querySelectorAll('footer a[href]')) as HTMLAnchorElement[];
        links.push(...Array.from(document.querySelectorAll('header a[href]')) as HTMLAnchorElement[]);

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

      // Get multiple logo candidates
      const logoSources = extractHighResLogo();

      return {
        title,
        description,
        logoSources, // Return all logo sources instead of just one
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

    

    // Process logo sources and select the best one
    const processedLogos = await Promise.all(
      result.logoSources.slice(0, 5).map(async (logoSource:any) => {
        try {
          let fullUrl = logoSource.url;
          
          // Convert relative URLs to absolute
          if (!fullUrl.startsWith('http') && !fullUrl.startsWith('data:')) {
            fullUrl = new URL(fullUrl, url).href;
          }

          // For data URLs (SVG), return as is
          if (fullUrl.startsWith('data:')) {
            return {
              ...logoSource,
              url: fullUrl,
              isHighRes: true
            };
          }

          // Check if the image is accessible and get its dimensions
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

          const response = await axios.head(fullUrl, {
            signal: controller.signal
          }).catch(() => null);

          clearTimeout(timeoutId);

          if (response && response.status === 200) {
            const contentType = response.headers['content-type'];
            const isVector = contentType?.includes('svg');
            const contentLength = parseInt(response.headers['content-length'] || '0');
            
            return {
              ...logoSource,
              url: fullUrl,
              isHighRes: isVector || (logoSource.width || 0) >= 100 || contentLength > 10000,
              contentType,
              fileSize: contentLength
            };
          }
          
          return null;
        } catch (error) {
          console.error('Error processing logo:', error);
          return null;
        }
      })
    );

    // Select the best logo
    const validLogos = processedLogos.filter(Boolean);
    const bestLogo = validLogos.find((logo:any) => logo.isHighRes) || validLogos[0];

    const brandKitData = {
      name: result.title.trim(),
      description: result.description.trim(),
      logo: bestLogo?.url || '',
      logoSources: validLogos, // Include all valid logos for reference
      theme: result.theme,
      tone: 'professional',
      footer: {
        ...result.footer,
        copyright: result.footer.text.match(/©[^.]+/)?.[0]?.trim() || '',
        address: result.footer.text.match(/\d{1,5}[\w\s,.]+(?:India|USA|UK|Street|Avenue|Road)/i)?.[0] || '',
        disclaimers: result.footer.text.match(/(terms|disclaimer|rights|reserved).{0,100}/i)?.[0] || ''
      }
    };

    console.log('Brand kit data with logo sources:', brandKitData);

    const rawFixedBrandKitString: any = await improvteBrandKit(brandKitData);
    console.log(rawFixedBrandKitString);

    const cleanedString = cleanJSONBlock(rawFixedBrandKitString);
    const parsedFixedBrandKit = JSON.parse(cleanedString);
    const fixedBrandKit = parsedFixedBrandKit.fixedData;

    const { data, error } = await supabase
      .from('brandkits')
      .insert([
        {
          user_id: user.id,
          kit_name: fixedBrandKit.name,
          website: url,
          brand_summary: fixedBrandKit.brandSummary,
          address: fixedBrandKit.footer.address,
          tone_of_voice: fixedBrandKit.tone,
          copyright: fixedBrandKit.footer.copyright,
          footer: fixedBrandKit.footer.text,
          disclaimers: fixedBrandKit.footer.disclaimers,
          socials: Object.values(fixedBrandKit.footer.socials),
          logo_primary: fixedBrandKit.logo,
          logo_icon: fixedBrandKit.logo,
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
      throw new Error('Failed to save brand kit');
    }

    return data[0];
  } catch (err) {
    console.error('[Scraper error]', err);
    throw new Error('Failed to fetch site info');
  }
}

export async function getBrandKits() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: brandKits, error } = await supabase
    .from('brandkits')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('[Supabase fetch error]', error);
    throw new Error('Failed to fetch brand kits');
  }

  return brandKits;
}

export async function getBrandKitById(brandKitId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: brandKit, error } = await supabase
    .from('brandkits')
    .select('*')
    .eq('id', brandKitId)
    .eq('user_id', user.id)
    .single(); // Use .single() to get a single record

  if (error) {
    console.error('[Supabase fetch by ID error]', error);
    throw new Error('Failed to fetch brand kit by ID');
  }

  return brandKit;
}

export async function deleteBrandKit(brandKitId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('brandkits')
    .delete()
    .eq('id', brandKitId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[Supabase delete error]', error);
    throw new Error('Failed to delete brand kit');
  }

  return { success: true };
}

export async function createEmptyBrandKit() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('brandkits')
    .insert([
      {
        user_id: user.id,
        kit_name: 'New Brand Kit',
        website: '',
        brand_summary: '',
        address: '',
        tone_of_voice: '',
        copyright: '',
        footer: '',
        disclaimers: '',
        socials: [],
        logo_primary: '',
        logo_icon: '',
        color_background: '',
        color_container: '',
        color_accent: '',
        color_button_text: '',
        color_foreground: '',
      },
    ])
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase insert empty brand kit error]', error);
    throw new Error('Failed to create empty brand kit');
  }

  return data.id;
}