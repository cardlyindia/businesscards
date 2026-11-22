# Settings

## Cardly promotion popup — `assets/js/config.js`

```js
var SHOW_ADD = "Y";            // "Y" = show the popup, "N" = never show it

var SALKARA_CONFIG = {
  ad: {
    url: "https://cardly.in/starvithura/",
    firstDelaySec: [12, 25],   // first popup: random time 12–25 s after the page opens
    intervalSec: [90, 180],    // later popups: random gap of 90–180 s
    maxPerVisit: 3             // at most 3 popups per visit
  }
};
```

Visitors are never shown the popup while the order list or the ☰ menu is open, while they are typing in the search box, or while they're on another tab.
To see it straight away while testing, open the browser console and run `SalkaraAd.show()`.

## Language switch (English / Malayalam) — `assets/js/i18n.js`

```js
var SHOW_LANGUAGE = false;   // false = hidden, the site is always English
                             // true  = show the EN / മല button (home, menu, PDF pages and the ☰ menu)
```

The Malayalam translations stay in place either way:
- **Dish and category names:** the `"ml"` fields in `assets/data/menu.json`
- **Everything else** (buttons, headings, footer, order list, popup): the `ml:` block in `assets/js/i18n.js`

Have a native speaker read the Malayalam once before switching it on.

## Light / dark mode — `assets/js/theme.js`
- **Default:** the site always starts in the visitor's device setting (light or dark).
- **Manual change:** the round theme button cycles Auto → Light → Dark. The choice lasts only for that visit.
- **Colours:** at the top of `assets/css/style.css`, in the "Theme tokens" section. The brand colours (`--choc`, `--tomato`, `--leaf`, `--sun`) and the light and dark colour sets are kept separately there.

## Contact details and links
Some details appear on more than one page. Change **every** place listed:

| Detail | Where it appears |
|---|---|
| Phone 90206 37099 (`tel:+919020637099`) | `index.html` (Call Us), `menu.html` (footer), `assets/js/nav.js` (☰ menu) |
| Phone 73567 94579 (`tel:+917356794579`) | `menu.html` (footer), `assets/js/nav.js` |
| Google Maps link (`maps.app.goo.gl/RUKr6jaKvM8EMdob9`) | `index.html`, `menu.html` (footer), `assets/js/nav.js` |
| Google review link (`…Salkara+Restaurant…`) | `index.html` (Rate Us), `assets/js/nav.js` (variable `REVIEW`) |
| UPI ID (`paytmqr14c6e4@paytm`) | `index.html` (Pay with UPI), `assets/js/nav.js` |
| Opening hours (5:30 AM – 11:00 PM) | `assets/js/i18n.js` (keys `place`, `hours`, `foot.hoursText`, in English and Malayalam) |
| Contact card for "Save Contact" | `files/salkara.vcf` |

## Promotion text, page text
All visible text that isn't a dish name is in `assets/js/i18n.js` (`ad.*` keys for the Cardly popup).

## Caching
Visitors don't need to do anything when you update the site; see [DEPLOYMENT.md](DEPLOYMENT.md#updates-and-caching).
