import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer'
import { createBrandedEmailTemplate } from '@/lib/gemini';


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
      await sleep(10000); // Pause for 2 seconds (2000 milliseconds)

    // const emailTemplate = await createBrandedEmailTemplate(brandKitData);
    // const emailTemplate = '```json\n{"fixedData":{"name":"Super Cool Brand","description":"Super Cool Brand specializes in developing innovative and user-centric solutions. We are dedicated to delivering high-quality products that enhance user experience and drive success.","brandSummary":"Super Cool Brand specializes in developing innovative and user-centric solutions.","logo":"https://react.email/static/logo-on-black.png","theme":{"colors":{"background":"#ffffff","container":"#f9f9f9","accent":"#000000","buttonText":"#ffffff","foreground":"#000000"}},"tone":"professional","footer":{"text":"","socials":{"twitter":"https://x.com/reactemail","linkedin":"https://linkedin.com/company/mybrand","facebook":""}}},"component":"import { Html, Head, Body, Container, Section, Text, Img, Button, Hr, Link, Preview } from \'@react-email/components\';export default function WelcomeEmail() {  const fixedData = {\\"name\\":\\"Super Cool Brand\\",\\"description\\":\\"Super Cool Brand specializes in developing innovative and user-centric solutions. We are dedicated to delivering high-quality products that enhance user experience and drive success.\\",\\"brandSummary\\":\\"Super Cool Brand specializes in developing innovative and user-centric solutions.\\",\\"logo\\":\\"https://react.email/static/logo-on-black.png\\",\\"theme\\":{\\"colors\\":{\\"background\\":\\"#ffffff\\",\\"container\\":\\"#f9f9f9\\",\\"accent\\":\\"#000000\\",\\"buttonText\\":\\"#ffffff\\",\\"foreground\\":\\"#000000\\"}},\\"tone\\":\\"professional\\",\\"footer\\":{\\"text\\":\\"\\",\\"socials\\":{\\"twitter\\":\\"https://x.com/reactemail\\",\\"linkedin\\":\\"https://linkedin.com/company/mybrand\\",\\"facebook\\":\\"\\"}}};  const main = {    backgroundColor: fixedData.theme.colors.background,    fontFamily:      \'-apple-system,BlinkMacSystemFont,\\"Segoe UI\\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\\"Helvetica Neue\\",sans-serif\',  };  const container = {    margin: \'0 auto\',    padding: \'20px\',    width: \'100%\',    maxWidth: \'600px\',    backgroundColor: fixedData.theme.colors.container,    borderRadius: \'8px\',    boxShadow: \'0 2px 10px rgba(0,0,0,0.05)\',  };  const logoSection = {    textAlign: \'center\',    paddingBottom: \'20px\',  };  const logo = {    margin: \'0 auto\',    width: \'150px\',    height: \'auto\'  };  const contentSection = {    padding: \'20px 0\',    textAlign: \'left\',  };  const heading = {    color: fixedData.theme.colors.foreground,    fontSize: \'28px\',    fontWeight: \'bold\',    marginBottom: \'15px\',    lineHeight: \'1.2\',  };  const paragraph = {    color: fixedData.theme.colors.foreground,    fontSize: \'16px\',    lineHeight: \'1.5\',    marginBottom: \'20px\',  };  const button = {    padding: \'12px 25px\',    borderRadius: \'5px\',    fontWeight: \'bold\',    textDecoration: \'none\',    textAlign: \'center\',    display: \'inline-block\',    cursor: \'pointer\',    backgroundColor: fixedData.theme.colors.accent,    color: fixedData.theme.colors.buttonText,  };  const hr = {    borderColor: \'#cccccc\',    margin: \'20px 0\',  };  const brandSummarySection = {    padding: \'10px 0 20px 0\',    textAlign: \'center\',    backgroundColor: fixedData.theme.colors.container,  };  const brandSummaryText = {    color: fixedData.theme.colors.foreground,    fontSize: \'14px\',    fontStyle: \'italic\',    padding: \'0 20px\',  };  const footerSection = {    paddingTop: \'20px\',    textAlign: \'center\',  };  const footerText = {    color: \'#888888\',    fontSize: \'12px\',    lineHeight: \'1.5\',  };  const socialLink = {    color: \'#007bff\',    fontSize: \'12px\',    margin: \'0 5px\',    textDecoration: \'underline\',  };  return (    <Html>      <Head />      <Preview>Welcome to ${fixedData.name}!</Preview>      <Body style={main}>        <Container style={container}>          <Section style={logoSection}>            {fixedData.logo && <Img src={fixedData.logo} width=\\"150\\" alt={`${fixedData.name} Logo`} style={logo} />}          </Section>          <Section style={contentSection}>            <Text style={heading}>Welcome to ${fixedData.name}!</Text>            <Text style={paragraph}>${fixedData.description}</Text>            <Button              href=\\"#\\"              style={button}            >              {`${fixedData.tone === \'professional\' ? \'Get Started\' : \'Join Now\'}`}            </Button>          </Section>          <Hr style={hr} />          <Section style={brandSummarySection}>            <Text style={brandSummaryText}>${fixedData.brandSummary}</Text>          </Section>          <Section style={footerSection}>            {fixedData.footer.socials.twitter && (              <Link href={fixedData.footer.socials.twitter} style={socialLink}>Twitter</Link>            )}            {fixedData.footer.socials.github && (              <Link href={fixedData.footer.socials.github} style={socialLink}>GitHub</Link>            )}            {fixedData.footer.text && (              <Text style={footerText}>${fixedData.footer.text}</Text>            )}          </Section>        </Container>      </Body>    </Html>  );}"}\n```'
    return NextResponse.json({brandKitData }, { status: 200 });
  } catch (err) {
    console.error('[Scraper error]', err);
    return NextResponse.json({ error: 'Failed to fetch site info' }, { status: 500 });
  }
}
    const sleep = (ms:any) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };