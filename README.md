# MT-PSO-Talk SlideApp

Interactive slide workbench for the MT-PSO technical talk.

This repository is the public web app extracted from the private
`MT-PSO-Talk` workspace. The app is published with GitHub Pages and is also
consumed from the private monorepo as a git submodule at `SlideApp/`.

## Local Development

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`.

## Verification

```bash
npm test
npm run build
BASE_PATH=/MT-PSO-Talk-SlideApp/ npm run build:pages
```

## GitHub Pages

The site is deployed from the `main` branch through
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

Expected Pages URL:

`https://zjuzwt.github.io/MT-PSO-Talk-SlideApp/`
