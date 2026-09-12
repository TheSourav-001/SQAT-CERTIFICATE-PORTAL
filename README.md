# SQAT Certificate Portal

Official digital certificate lookup portal for the **AI Augmented Software Testing: A Hands on Workshop with Industry Expert** programme, organised by the Software Quality Assurance & Testing Club (SQAT), Department of Software Engineering, Daffodil International University.

The portal allows participants to search the official participant list by name, preview their participation certificate, open the original PDF, and download it for their records.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Technology](#technology)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Run locally](#run-locally)
- [How to use](#how-to-use)
- [How certificate search works](#how-certificate-search-works)
- [Managing certificates](#managing-certificates)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Privacy and security](#privacy-and-security)
- [Accessibility and compatibility](#accessibility-and-compatibility)
- [Credits](#credits)
- [License](#license)

## Overview

This is a static, responsive web application. It has no server-side application, database, API, authentication layer, package manager, or build step. Certificate metadata is loaded from `certificate-data.js`, while the original certificate documents are served from the `certificates/` directory.

The current distribution contains **409 certificate PDFs**:

- `1. CERTIFICATE/`: 152 source certificates
- `2. CERTIFICATE/`: 147 source certificates
- `3. CERTIFICATE/`: 110 source certificates
- `certificates/`: 409 deployable certificate PDFs

The three numbered folders are retained as source/reference folders. The live portal reads only from `certificates/` and `certificate-data.js`.

## Features

- Responsive layout for desktop, tablet, and mobile screens
- Official SQAT and DIU programme information
- Participant-name certificate lookup
- Case-insensitive name matching
- Normalisation of extra spaces and `.`, `_`, and `-` separators
- Inline PDF certificate preview
- Open-in-new-tab certificate viewing
- Direct certificate download
- Clear empty-input, loading, and not-found states
- Keyboard-focus styles and semantic labels
- Reduced-motion support for users who prefer less animation
- Contact information for certificate-related support

## Technology

- HTML5
- CSS3 with responsive media queries and custom properties
- Vanilla JavaScript using standard browser APIs
- Static PDF files
- Google Fonts: DM Sans and Space Grotesk
- No external JavaScript framework or runtime dependency

## Project structure

```text
SQAT PORTAL/
├── index.html                 # Main page and portal content
├── style.css                  # Layout, visual design, and responsive styles
├── script.js                  # Search, result states, preview, and download links
├── certificate-data.js        # Search index for participant names and PDF paths
├── assets/
│   └── sqat-logo.png          # Logo used by the deployed portal
├── certificates/              # Deployable certificate PDFs
├── 1. CERTIFICATE/            # Original/source certificate collection
├── 2. CERTIFICATE/            # Original/source certificate collection
├── 3. CERTIFICATE/            # Original/source certificate collection
├── ORGANIZATION LOGO/         # Source organisation logo asset
├── LICENSE                    # Project licensing terms
└── README.md                  # Project documentation
```

## Requirements

For local development, install one of the following:

- Python 3.x, or
- Any static-file HTTP server

No `npm install`, dependency installation, compilation, or environment variable is required.

## Run locally

Open PowerShell in the project root and run:

```powershell
python -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

Use an HTTP server instead of opening `index.html` directly with a `file://` URL. Serving the project over HTTP ensures that the browser can load the JavaScript data file and embedded PDF resources consistently.

To stop the server, return to PowerShell and press `Ctrl+C`.

## How to use

1. Open the portal in a browser.
2. Enter the participant's full name as printed on the certificate.
3. Select **Find my certificate**.
4. Review the certificate in the embedded preview.
5. Select **View certificate** to open the PDF or **Download certificate** to save it.

For the best result, use the spelling shown on the certificate. Letter case and repeated spaces do not affect matching.

## How certificate search works

At page load, `certificate-data.js` creates `window.certificateIndex`. Each record contains:

```javascript
{
	name: "Participant Name",
	normalizedName: "participant name",
	file: "certificates/1_Participant%20Name.pdf"
}
```

When a participant submits a name, `script.js`:

1. Applies Unicode NFKC normalisation.
2. Converts the input to lowercase.
3. Converts `.`, `_`, and `-` to spaces.
4. Removes unsupported punctuation.
5. Collapses repeated whitespace.
6. Compares the result with `normalizedName`.

The search is performed in the browser against the locally loaded index. No participant name is sent to a server by this project. If more than one record has the same normalised name, the current implementation displays the first matching record in the index.

## Managing certificates

### Add a certificate

1. Copy the PDF into `certificates/`.
2. Give the file a unique filename. A numeric prefix is recommended for consistency, for example:

	 ```text
	 410_Participant Name.pdf
	 ```

3. Add a corresponding record to `certificate-data.js`:

	 ```javascript
	 {
		 "name": "Participant Name",
		 "normalizedName": "participant name",
		 "file": "certificates/410_Participant%20Name.pdf"
	 }
	 ```

4. URL-encode spaces and special characters in the `file` value. The path must match the real PDF filename exactly.
5. Test the name through the local portal before deployment.

### Replace or remove a certificate

- Replace the PDF while preserving its path, or update the `file` value in `certificate-data.js`.
- When removing a certificate, remove both the PDF and its matching data record.
- Avoid duplicate records unless multiple certificate files intentionally belong to the same participant.
- Preserve valid JavaScript syntax and the surrounding array structure.

### Data quality checklist

Before publishing an updated collection, confirm that:

- Every `file` path points to an existing PDF.
- Every participant has a `name` and `normalizedName`.
- `normalizedName` follows the same normalisation rules used by `script.js`.
- Filenames are unique and URL-safe.
- A sample of new and existing names returns the expected certificate.
- The total PDF count and index count are consistent.

This repository does not currently include an automatic certificate-index generator. If certificate volume changes frequently, adding a small generation script would reduce manual data-entry errors.

## Deployment

This project can be deployed as-is from the repository root because it is a static site.

### GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings > Pages**.
3. Select **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder.
5. Save and wait for GitHub Pages to publish the site.

### Netlify or Vercel

Use the repository root as the publish directory. Leave the build command empty because this project has no build step. The deployed root must contain:

```text
index.html
style.css
script.js
certificate-data.js
assets/
certificates/
```

### Deployment checklist

- Confirm that `index.html` is at the published root.
- Confirm that `certificate-data.js` loads before `script.js`.
- Confirm that the `assets/` and `certificates/` directories are included in the deployment.
- Test a known participant name on the deployed URL.
- Test both PDF preview and download on desktop and mobile browsers.
- Verify that the support email and telephone links are current.

## Troubleshooting

### The page is blank or the search does nothing

Make sure the project is running through an HTTP server and that the browser console does not show a missing `certificate-data.js` error. Confirm that both `certificate-data.js` and `script.js` are at the same level as `index.html`.

### A certificate cannot be found

Check the spelling, then compare the submitted name with the `name` and `normalizedName` fields in `certificate-data.js`. Also confirm that the PDF path is correct and URL-encoded.

### The preview does not load

Check that the PDF exists under `certificates/`, that its filename matches the index entry, and that the hosting provider serves PDF files. Some browser privacy settings or extensions may also block embedded PDF viewers; use **View certificate** as a fallback.

### Download opens instead of saving

The `download` attribute is controlled by the browser and hosting environment. If the PDF opens in a new tab, use the browser's built-in download control.

## Privacy and security

This is a public static certificate portal. Certificate PDFs placed in `certificates/` are publicly accessible to anyone who knows or discovers their URL. Do not upload confidential documents or personal information that is not intended for public distribution.

The portal performs name matching locally in the browser and does not include analytics, authentication, or a backend service. Review certificate content and contact details before every public deployment.

## Accessibility and compatibility

The interface uses semantic headings, form labels, descriptive image text, live result messaging, visible keyboard-focus states, and a reduced-motion media query. PDF preview support depends on the browser's built-in PDF viewer. Current browsers with JavaScript enabled are required for certificate lookup.

## Credits

- **Organisation:** Software Quality Assurance & Testing Club (SQAT)
- **Department:** Department of Software Engineering
- **Institution:** Daffodil International University
- **Programme:** AI Augmented Software Testing: A Hands on Workshop with Industry Expert
- **Developer:** Sourav Dipto Apu ([GitHub](https://github.com/TheSourav-001))
- **Support:** `sqatclub@diu.edu.bd`
- **Phone:** `+880 1714 403230`
- **Alternate phone:** `+880 1560 068361`

## License

Refer to [LICENSE](LICENSE) for the applicable licensing terms.
