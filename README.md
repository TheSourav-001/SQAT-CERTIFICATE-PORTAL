# SQAT Certificate Portal

A static, responsive digital certificate portal for the SQAT AI-Augmented Software Testing workshop. Participants can search their name and view or download the original certificate PDF.

## Project files

- `index.html`, `style.css`, `script.js`: the portal interface and search workflow.
- `certificate-data.js`: generated index of every certificate filename and normalized participant name.
- `assets/sqat-logo.png`: the SQAT logo used by the portal.
- `certificates/`: the 409 original certificate PDFs used by the search results.

The original source folders (`1. CERTIFICATE`, `2. CERTIFICATE`, `3. CERTIFICATE`) are kept in the workspace as well. The deployable copies are in `certificates/`.

## Run locally

From the project root, run:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173` in a browser. A local server is required because browsers do not reliably load static PDF assets from a `file://` URL.

## Add or replace certificates

Place each PDF in `certificates/` using a unique filename. The current index uses the filename without its numeric prefix as the participant name, for example `99_Yeamin.pdf` becomes `Yeamin`. Regenerate `certificate-data.js` when the certificate collection changes so the new file is searchable.

## Deploy

Push the repository to GitHub and enable GitHub Pages with the `main` branch and root folder. Netlify and Vercel can deploy the repository with no build command and the project root as the publish directory. Keep `index.html`, `style.css`, `script.js`, `certificate-data.js`, `assets/`, and `certificates/` at the published root.
