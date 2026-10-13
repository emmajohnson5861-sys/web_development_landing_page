# Algofort landing page

A responsive Algofort web development landing composition built with Vite, HTML, CSS, and JavaScript.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Use `npm run build` to create the production files in `dist/`.

## Customize

- Edit the headline, story, links, and figures in `index.html`.
- Edit layout, video masking, and motion in `src/hero.css`.
- Edit the mobile menu and count animation in `src/main.js`.
- Edit the estimate form layout in `src/estimate.css` and its preview behavior in `src/estimate.js`.
- Heading typography is shared in `src/typography.css`: DM Sans, one responsive scale for section headings, and one for card headings.
- Edit the reference-inspired footer in `src/footer.css`. Its newsletter is a UI preview and does not send or store emails.
- The supplied `reel-teaser.mp4` is copied to `public/media/reel-teaser.mp4` so both video placements use the same production asset.

The figures shown are 10+ years of experience and 200+ delivered projects from [Algofort's home page](https://www.algofort.com/), plus 15+ industry domains from its [website development page](https://www.algofort.com/website-development-services/). Navigation and buttons currently lead to the live Algofort website.

The project estimate form is UI-only. Browser validation and project selections work, but the preview does not send or store submissions. A destination can be connected later.

The portfolio features four fictional design concepts. Their generated website mockups are stored in `public/media/work/`; they are not screenshots of live client websites.
