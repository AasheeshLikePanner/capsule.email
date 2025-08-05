# Capsule.email

**Build beautiful AI-powered emails to stand out in the market.**  
Create stunning email templates with your brand’s style in seconds – powered by AI.


https://github.com/user-attachments/assets/80c4a169-8efb-4a9c-be1d-716d00765903


[Higher qulaity demo](https://vimeo.com/1107092848)


## Why I Built This

I really love open source.  
That's why I decided to make Capsule.email open for everyone to use, host, and contribute to.

Right now, I don’t have the funds to buy a domain or cover AI credits – so instead of limiting access, I’m sharing everything.  
You can self-host it and use it however you like.

If you find it useful, consider contributing or spreading the word.


## Features

- AI-powered email generation
- BrandKit support (logo, colors, tone, footer, etc.)
- Chat-based interface to generate emails
- Save, edit, and reuse email templates
- Desktop & mobile previews
- Copy raw HTML to use anywhere
- Shareable public chat sessions
- Fully open source and self-hostable




## How to Use

### 1. Install dependencies

```bash
bun install
````

### 2. Setup environment variables

Create a `.env.local` file in the root and add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_GEMINI_API_KEY=
OPENROUTER_API_KEY=
RESEND_API_KEY=
NEXT_DISABLE_ERROR_OVERLAY=true
```

### 3. Set up Supabase
1. **Go to Supabase** → Auth → Providers → Enable **Google**.
2. Supabase will show you the **Authorized redirect URI** — copy it.
3. Now go to the [Google Cloud Console Auth page](https://console.cloud.google.com/auth/overview).
4. Click “Create credentials” → **OAuth Client ID** → choose **Web application**.
5. In “Authorized redirect URIs”, paste the URI from Supabase (e.g., `https://your-project.supabase.co/auth/v1/callback`).
6. After creating, you'll get a **Client ID** and **Client Secret** — copy them.
7. Add those to your `.env.local`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

Done — now Supabase can use Google login properly.

### 4. Setup Resend

* Create an account at [resend.com](https://resend.com/)
* Get your **API key** and add it to `.env.local`

### 5. Setup OpenRouter

* Create an account at [openrouter.ai](https://openrouter.ai/)
* Get your **API key** and add it to `.env.local`


## Contributions Welcome

Here’s how you can help:

- Improve the landing page UI
- Enhance the Help page
- Polish the overall design and UX
- Refactor or improve backend logic
- Strengthen security and authentication flow

Feel free to open issues, submit pull requests.


## License

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)  
Use it freely for personal or educational purposes, with attribution.  
Commercial use is not allowed.

