# Kray Music

A production-ready static website for Kray Music built with React, TypeScript, React Router, Zustand, CSS Modules, and Decap CMS.

## Features

- Responsive pages for home, artists, artist details, events, services, radio, and contact routes
- Global floating audio player with queue, playback, shuffle, repeat, volume, and seek controls
- Content-driven CMS collections for artists, tracks, events, services, homepage, contacts, and radio
- SEO metadata, lazy loading, scroll restoration, responsive layouts, and accessible navigation

## Local development

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open the site at `http://localhost:5173/`

## Decap CMS

The CMS is available at `/admin/`.

### GitHub OAuth

1. Create a GitHub OAuth App in your GitHub account.
2. Set the callback URL to `https://your-domain.com/auth/github/callback`.
3. Update `admin/config.yml` with your repository and branch.
4. Deploy the site with a serverless auth endpoint or use the Netlify option below.

### Netlify Identity + Git Gateway

1. Create a site on Netlify and enable Identity.
2. Enable Git Gateway.
3. Configure the backend section in `admin/config.yml` to use Git Gateway.
4. Deploy and visit `/admin/` to sign in.

## Media uploads

Images and audio are stored under the public folder and can be uploaded from the CMS through the configured media folder.

## Deployment

### GitHub Pages

- Build with `npm run build`
- Deploy the contents of `dist/` to GitHub Pages

### Netlify

- Connect the repository and set the build command to `npm run build`
- Publish directory: `dist`

### Vercel

- Import the repository and use the standard Vite build settings
- Build command: `npm run build`
- Output directory: `dist`
