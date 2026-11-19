# Comfy Chaos website

Marketing site for Comfy Chaos Pty Ltd, a software studio. Static single page, deployed by Vercel: a push to
`main` goes live at https://comfychaos.com.au.

*Clarity in complexity.*

## What is here

- `index.html`: the whole page (styles inline, no framework, no build step)
- `404.html`: the not found page
- `assets/`: images, icons and `site.js` (the page's only script)
- `site.webmanifest`, `robots.txt`, `sitemap.xml`, `vercel.json` (headers, caching and redirects)

## Updating the site

1. Work on a branch. Every branch gets a Vercel preview.
2. Edit `index.html` or the assets. A changed image gets a new file name, because assets are cached.
3. Merge to `main` and push only when the change should be public: that push is the deploy.

`assets/logo-mark.png` must stay where it is. Email signatures load it from the live site.
