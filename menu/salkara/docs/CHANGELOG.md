# Changelog

## 2026-11-22: Salkara 2 (new site)

**Menu**
- The full menu from the November 2026 printed menu: 170 dishes in 16 categories, including the new **Arabic** and **Kuzhi Mandi** sections, and new items such as Puttu, Omelette Double, Beef Curry, Meals and Pothi Meals.
- All menu data moved into `assets/data/menu.json` (English and Malayalam names, prices, photos, popular flags).
- The printed menu card PDF was rebuilt from the new menu pages (cover + 3 pages, about 4 MB).

**Design**
- New responsive design for phones, tablets and laptops, with light and dark mode that follows the device.
- Brand colours from the printed menu (chocolate, tomato red, leaf green, gold), food photos, an orange-to-pink "Juice Hub" panel, and a script accent font.
- "Popular dishes" photo strip, plus dish photos in the list.
- Fonts, icons and the PDF viewer are stored locally, with no CDN.

**Features**
- Search, a category bar (phones and tablets) or sidebar (laptops), and an order list with total.
- ☰ side menu on the menu and PDF pages: Home, Menu, Menu Card, Rate Us, Find Us, Call, Save Contact, UPI, theme, Refresh menu.
- Cardly promotion popup at random intervals, turned on or off with `SHOW_ADD` in `config.js`.
- English / Malayalam switch, built in but hidden for now (`SHOW_LANGUAGE = false` in `i18n.js`).
- Offline caching with automatic updates (`sw.js`), plus a manual "Refresh menu (clear cache)" option.
- New Google Maps and Google review links.

**Not changed**
- The old site in `SALKARA/salkara/` keeps working on its own. Its menu and PDF were updated earlier the same day, and backups are in `_backups/`.
