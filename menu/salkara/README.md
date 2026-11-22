# Salkara: Restaurant · Cafeteria · Juice Hub (Vithura)

Website for Salkara Restaurant, with a digital food menu, the printed menu card (PDF), and contact and payment links.
It is a **static website**: plain HTML, CSS and JavaScript with no database and no build step.
Everything it needs (fonts, icons, PDF viewer, images) is inside this folder, and no CDN is used.
The only outside service is Google Analytics (tag in the `<head>` of every page).

| Page | What it is |
|---|---|
| `index.html` | Home: Food Menu, Menu Card (PDF), Rate Us, Save Contact, Pay with UPI, Call |
| `menu.html` | Web menu: categories, search, popular dishes with photos, order list with total |
| `pdf.html` | The printed menu card (`files/salkara.pdf`) in a built-in viewer |

**Features**
- **Design:** light and dark mode (follows the phone or computer setting), and works on phones, tablets and laptops.
- **Menu:** all dishes and prices come from one file, `assets/data/menu.json`.
- **Browsing:** search, category bar or sidebar, "Popular dishes" strip, and an order list with a running total.
- **Speed:** opens instantly and works offline after the first visit, and updates itself when the site changes.
- **Optional extras:** a Cardly promotion popup and an English / Malayalam switch (currently hidden).

---

## Quick start

| I want to… | Do this | Guide |
|---|---|---|
| Change a price or dish | Edit `assets/data/menu.json` | [docs/EDITING-MENU.md](docs/EDITING-MENU.md) |
| Add a dish photo or mark a dish popular | Add the photo to `assets/img/dishes/`, then update the JSON | [docs/EDITING-MENU.md](docs/EDITING-MENU.md#photos-and-popular-dishes) |
| Replace the printed menu PDF | Overwrite `files/salkara.pdf` | [docs/EDITING-MENU.md](docs/EDITING-MENU.md#replace-the-pdf-menu-card) |
| Turn the Cardly popup on or off | `SHOW_ADD` in `assets/js/config.js` | [docs/SETTINGS.md](docs/SETTINGS.md) |
| Change or turn off Google Analytics | Google tag in the `<head>` of the 3 pages | [docs/SETTINGS.md](docs/SETTINGS.md#google-analytics-g-ged109s1gn) |
| Show or hide the Malayalam switch | `SHOW_LANGUAGE` in `assets/js/i18n.js` | [docs/SETTINGS.md](docs/SETTINGS.md) |
| Change phone numbers, links or hours | See the table of locations | [docs/SETTINGS.md](docs/SETTINGS.md#contact-details-and-links) |
| Preview on this Mac | Double-click `start-server.command` | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#preview-on-your-computer) |
| Put the site online | Upload this whole folder to https hosting | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |

> **Important:** the menu page loads `menu.json`, which browsers won't do from a double-clicked file.
> Always preview with `start-server.command` (or any web server), not by opening `menu.html` directly.

---

## Folder structure

```
salkara/
├── index.html              Home page
├── menu.html               Web menu
├── pdf.html                Menu card viewer
├── sw.js                   Offline cache & auto-update (service worker)
├── manifest.webmanifest    "Add to home screen" details
├── .htaccess               Optional cache settings for Apache hosts
├── start-server.command    Double-click to preview on a Mac
├── files/
│   ├── salkara.pdf         Printed menu card (cover + 3 menu pages)
│   └── salkara.vcf         Contact card for "Save Contact"
├── assets/
│   ├── data/menu.json      ← ALL dishes, prices, Malayalam names, photos
│   ├── js/
│   │   ├── config.js       ← settings: Cardly popup (SHOW_ADD) and its timing
│   │   ├── analytics.js    Google Analytics events for key taps (tag is in each page's <head>)
│   │   ├── i18n.js         ← page text in English & Malayalam, SHOW_LANGUAGE
│   │   ├── menu.js         Builds the menu from menu.json (search, order list…)
│   │   ├── nav.js          ☰ side menu (also holds the Rate Us / Maps links)
│   │   ├── promo.js        Cardly popup
│   │   ├── cache.js        Update notices & "Refresh menu (clear cache)"
│   │   ├── theme.js        Light / dark mode
│   │   └── pdf-viewer.js   Menu card viewer
│   ├── css/style.css       All styling (colours at the top)
│   ├── css/fonts.css       Local fonts
│   ├── fonts/              Poppins, Baloo Chettan 2 (incl. Malayalam), Dancing Script
│   ├── img/                Logo, icons, background, food & drink photos
│   │   └── dishes/         Dish photos used in the menu (square, .webp + .jpg)
│   └── vendor/pdfjs/       PDF viewer library (pdf.js, Apache-2.0)
└── docs/                   Guides (editing, settings, deployment, changelog)
```

## Browser support
Current Chrome, Safari (iPhone/iPad/Mac), Firefox, Edge and Samsung Internet. The scripts are plain ES5 with feature checks.
Older browsers still show the menu; they just skip extras such as offline caching.

## Credits & licences
- Designed & developed by [Star Creations](https://cardly.in/starvithura/)
- [pdf.js](https://mozilla.github.io/pdf.js/) 3.11.174 is used under Apache-2.0 (`assets/vendor/pdfjs/LICENSE.txt`)
- Fonts are used under the SIL Open Font License: Poppins, Baloo Chettan 2 and Dancing Script
- Food and drink photos were taken from Salkara's own printed menu

See [docs/CHANGELOG.md](docs/CHANGELOG.md) for what changed and when.
