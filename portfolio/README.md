# Miao Tian portfolio

Astro static portfolio with Home, Work (18 projects and discipline filtering), and Me pages. The original website source remains at the repository root; builds generate a separately linked archive at `/archive/`.

## Development

Use Node.js 24 and pnpm 11.19.0. Inside `portfolio/`:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
node scripts/verify-deployment.mjs
pnpm preview
```

Fonts, thumbnails, and the portrait are stored locally. Individual case studies currently link to their existing external destinations. Keep Squarespace available until those pages are migrated.

## Publishing

`.github/workflows/pages.yml` builds and verifies pull requests targeting `master`. After merge, it deploys `portfolio/dist/` as one GitHub Pages artifact containing the portfolio and archive. In repository Settings → Pages, select **GitHub Actions** as the publishing source. Only `master` can deploy; the workflow can also be dispatched manually from `master`.

The configured site is https://agrisurculi.github.io. Domain and DNS changes are not included. Change the Astro site setting only when the custom-domain migration is ready.

## Archive

`scripts/archive.mjs` copies the original tracked website files to the ignored `public/archive/` folder. It adjusts known root-relative paths, normalizes directory links, and restores the original commented-out homepage header. It does not modify original source files. Baseline commit `cfce554` preserves the old site.

One pre-existing missing video remains: `projects/human-territory/openVideos.mov`. The source repository does not contain it. Restore the original file when available.

To roll back a release, revert its merge through a pull request; the next successful master build deploys the reverted source. The original site's pre-migration revision is retained in Git history.
