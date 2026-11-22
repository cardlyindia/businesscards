# Preview & deployment

## Preview on your computer

The menu page reads `assets/data/menu.json`, and browsers refuse to do that for a double-clicked file.
**Always preview through a small local web server:**

**Mac:** double-click **`start-server.command`** in this folder.
A Terminal window opens and your browser shows http://localhost:8000. Close the Terminal window to stop the server.
If macOS says the file "can't be opened", right-click it → **Open** → **Open** (only needed the first time).

**Any computer with Python** (Mac, Windows or Linux):
```bash
cd path/to/salkara2
python3 -m http.server 8000
```
Then open http://localhost:8000 (on Windows, use `python` instead of `python3`).

> On localhost the offline cache (service worker) also runs. If you edit a file and don't see the change, reload once more,
> or use ☰ → **Refresh menu (clear cache)**.

---

## Put the site online

1. **Choose hosting with https.** Most hosts include it for free. Any of these will work:
   - **Shared hosting with cPanel** (Hostinger, GoDaddy, etc.): upload the folder's contents to `public_html` (or to a sub-folder such as `public_html/salkara/`).
     The included `.htaccess` sets sensible cache rules on these Apache hosts.
   - **Netlify / Cloudflare Pages / Vercel:** drag and drop the `salkara2` folder; no build settings are needed.
   - **GitHub Pages:** push the folder to a repository and enable Pages.
2. Upload **everything** in `salkara2`, keeping the folder structure. The `docs/` folder and `start-server.command` are optional.
3. Open the site address on your phone and test it:
   - the menu loads, search works, and adding dishes updates the total;
   - the Menu Card page shows the PDF, and Download works;
   - Rate Us, Call and Save Contact work.
4. **Update the QR code:** if your table QR codes point to the old site, point them to the new `…/index.html` (or `…/menu.html` to go straight to the menu).

The site works from any sub-folder because all links are relative.

### Things that need https
- **Offline caching and instant loading** (service worker) only run on `https://` or `localhost`. On plain `http://` the site still works, just without caching.
- **"Pay with UPI"** (`upi://` link) and **Call** (`tel:` link) only do something on phones.

---

## Updates and caching

The site saves itself on visitors' phones so it opens instantly and works offline. Updates reach visitors automatically:

| You change… | Visitors see it… |
|---|---|
| `assets/data/menu.json` (prices, dishes) | on their next page load (always checked online first) |
| an `.html` page | on their next page load (always checked online first) |
| CSS, JS, images or fonts | automatically: the page refreshes itself right after it opens, or quietly while the visitor is on another tab. A small "newer version" notice also appears. |

**Force everyone to start fresh** (after a big redesign): open `sw.js` and change the version, e.g.
```js
var VERSION = "2026-11-22.2";   →   var VERSION = "2026-12-01.1";
```
Every visitor's browser then deletes all saved files and downloads the new ones.

**Manual reset for one phone:** ☰ → **Refresh menu (clear cache)**, or the small link at the bottom of the home page. It keeps the visitor's order list.

**Adding a new file** (for example a new dish photo) needs no cache changes: new files are fetched and saved the first time they're used.
If you add a new *script or stylesheet* that every page needs, also add it to the `PRECACHE` list in `sw.js` so it's available offline right away.

---

## Old site
The previous site is in `SALKARA/salkara/`, with its own updated menu and PDF. The new site does not depend on it.
When the new site is live you can retire the old one, but keep `_backups/` until you're sure.
