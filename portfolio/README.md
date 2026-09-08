# Astro portfolio development

This folder is an isolated start for rebuilding miaotian.space. The original website at the repository root is unchanged. This is a development scaffold, not the finished portfolio.

## Local development

Use Node.js 24 and pnpm. From this directory:

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

The development server prints its local address. Astro produces static files in `dist/`. Fonts are bundled locally.

## Migration findings

- Original site: plain HTML, CSS, jQuery, and Three.js; local fonts, textures, and FBX models.
- Baseline commit: cfce554. Keep it available as a recovery point.
- The original site has root-relative paths in HTML, CSS, and scene loaders. An archive needs path rewriting and verification, not a simple folder move.
- No deployment workflow or CNAME is checked in. Live Pages settings still need verification in GitHub.

## Proposed publication structure

Build the new Astro site at `/`, and copy the preserved old site into the final artifact at `/archive/`, updating its internal paths. Add an Archive website link once that destination works. Preserve the existing tracked source until the archive is verified.

The eventual GitHub Actions workflow should install using the lockfile, build this folder, assemble the archive, and upload the combined static output to Pages. Do not enable deployment until the archive and new portfolio are reviewed. No deployment or Pages-setting changes are included in this scaffold.

The Astro `site` setting currently targets https://agrisurculi.github.io. Update it and add a CNAME only when the custom domain migration is ready. No `base` prefix is needed for the user-site root.

## Homepage and archive preview

The homepage now includes the original three project summaries and local imagery. Work Index, Me, HoloLens, and HoloKit currently link to Squarespace pending case-study migration. The broken Autodesk source URL is replaced with a contact link. Tag text contrast is increased for readability.

`pnpm dev` and `pnpm build` generate `public/archive/` from the tracked original site without modifying its source. The generated copy is ignored by Git and included in Astro output. Known root-relative HTML, CSS, and JavaScript paths are prefixed with `/archive/`. The original site’s runtime and pre-existing broken links require browser review before publication.

### Verification notes

The production build succeeds with 434 archived files. Static HTML link checking found one pre-existing missing file: `projects/human-territory/openVideos.mov`. It is absent from the original repository and has not been invented or removed from the archive. Restore the original video if available. The interactive Three.js scene still requires visual/browser verification before publication.
