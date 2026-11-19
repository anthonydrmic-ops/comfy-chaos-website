# Comfy Chaos website: hard rules

Repo: `C:/dev/COMFY CHAOS WEBSITE` (public GitHub repo anthonydrmic-ops/comfy-chaos-website). How we work lives in
the brain (`C:/dev/BRAIN`); this file holds only what is true for this project. Running list `docs/STATUS.md`, plan
and briefs `docs/PLAN.md` (both local only: `docs/` is gitignored because the repo is public).

- **A push to `main` is a live production deploy.** Vercel (project `comfy-chaos-website`) builds every push to
  `main` straight to https://comfychaos.com.au. Ask Anthony before every push to `main`. Other branches get a
  Vercel preview only, which is fine.
- GitHub Pages also still builds `main` (a duplicate copy at anthonydrmic-ops.github.io). Turning it off is Anthony's.
- Static single page (`index.html`, `404.html`, `assets/`). No framework, no build step.
- Every file in the repo is served publicly by Vercel unless `.vercelignore` lists it.
- Never link or name the hidden WellSafe tool page (its path lives in the REST training platform repo) until Adrian
  says launch. FrontFoot is live at https://frontfoot.restgroup.com.au and may be linked.
- Copy: no em dashes, no Oxford commas, minimal hyphenation, Australian English. Real product screenshots only,
  never generated people, logos or testimonials.
