# Editing the menu

All dishes, prices, categories, Malayalam names and dish photos are in one file:

```
assets/data/menu.json
```

Open it in any text editor (TextEdit in *plain text* mode, VS Code, Notepad++, etc.), make your change, save it, and upload it.
Visitors see the change on their **next page load**, because the site always checks this file online first. You don't need to clear any cache.

---

## 1. Change a price

Find the dish and change the number:

```json
{ "en": "Chicken Biriyani", "ml": "ചിക്കൻ ബിരിയാണി", "price": 150 },
```
→
```json
{ "en": "Chicken Biriyani", "ml": "ചിക്കൻ ബിരിയാണി", "price": 160 },
```

- Prices are plain numbers in rupees: no `₹` sign and no quotes.
- Use `null` for items without a fixed price. They show as **"Daily rate"**, like the fish and prawns:
  `{ "en": "Fish Fry", "ml": "മീൻ ഫ്രൈ", "price": null },`

## 2. Add a dish

Copy an existing line inside the right category and change it. Watch the commas:
every line in a list ends with a comma **except the last one**.

```json
"items": [
  { "en": "Tea", "ml": "ചായ", "price": 12 },
  { "en": "Lemon Tea", "ml": "ലെമൺ ടീ", "price": 15 },     ← new line
  { "en": "Coffee", "ml": "കാപ്പി", "price": 20 }
]
```

| Field | Required | Meaning |
|---|---|---|
| `en` | yes | English name, shown on the site |
| `ml` | yes | Malayalam name, used when the Malayalam switch is on. If you're unsure, copy the English text. |
| `price` | yes | Rupees as a number, or `null` for "Daily rate" |
| `photo` | no | A photo in `assets/img/dishes/`: `"name.jpg"` (single file), or `"name"` for a `.webp` + `.jpg` pair |
| `popular` | no | `true` shows the dish in the "Popular dishes" strip (it needs a `photo`) |

> Don't give two dishes in the **same category** exactly the same English name. The order list uses
> the category and English name together to tell dishes apart.

## 3. Remove a dish
Delete its line, then make sure the line before the closing `]` has **no** comma after it.

## 4. Rename a dish
Change `en` (and `ml`). If a visitor already has that dish in their order list, it simply drops off their list.

## 5. Add or change a category

Each category looks like this:

```json
{
  "id": "rice",
  "group": "food",
  "name": { "en": "Rice", "ml": "റൈസ് & ബിരിയാണി" },
  "items": [ … ]
}
```

| Field | Meaning |
|---|---|
| `id` | Short unique code: lowercase letters and hyphens only, e.g. `"kuzhi-mandi"`. It's also used in links, e.g. `menu.html#rice` |
| `group` | `"food"` (the Kitchen section) or `"drinks"` (the orange/pink Juice Hub panel) |
| `name` | Category title in English and Malayalam |
| `note` | Optional message shown under the title, e.g. the fish "Daily rate" note: `"note": { "en": "…", "ml": "…" }` |

Categories appear on the site in the order they are listed in the file. Keep all `"food"` categories together, followed by all `"drinks"` categories.

---

## Photos and popular dishes

1. Prepare a **square** photo (about 360 × 360 pixels, under ~100 KB) and copy it into `assets/img/dishes/`,
   e.g. `chicken-biriyani.jpg`.
2. Add the file name to the dish:
   ```json
   { "en": "Chicken Biriyani", "ml": "ചിക്കൻ ബിരിയാണി", "price": 150, "photo": "chicken-biriyani.jpg", "popular": true },
   ```
   - **Best quality and speed:** save the photo twice, as `chicken-biriyani.webp` and `chicken-biriyani.jpg` (a free online "JPG to WebP" converter makes the .webp).
     Then write the name **without** an extension: `"photo": "chicken-biriyani"`. Browsers use the smaller .webp and fall back to the .jpg.

- **`photo` only:** the dish gets a small photo in the list.
- **`photo` and `popular: true`:** it also appears in the "Popular dishes" strip at the top of the menu.

Photos already available: `chicken-curry`, `al-faham`, `orange-juice`, `pineapple-juice`, `green-mojito`.

---

## Check your edit before uploading

A single missing comma or quote stops the menu from loading. The page then shows "Couldn't load the menu" with a link to the PDF.

- **Quick check:** paste the whole file into a JSON checker such as jsonlint.com and click *Validate*.
- **Preview:** double-click `start-server.command`, open the Food Menu and check your change (see [DEPLOYMENT.md](DEPLOYMENT.md)).

Common mistakes:

| Problem | Example | Fix |
|---|---|---|
| Missing comma between dishes | `… "price": 12 }` ⏎ `{ "en": …` | Add `,` after `}` |
| Extra comma before `]` | `{ … "price": 20 },` ⏎ `]` | Remove the last `,` |
| Price written as text | `"price": "₹150"` | `"price": 150` |
| Curly quotes from Word or TextEdit | `“en”` | Use straight quotes `"en"` (turn off *Smart Quotes* in TextEdit) |

---

## Replace the PDF menu card
Overwrite `files/salkara.pdf` with the new PDF and keep the **same file name**. The Menu Card page and its Download button use it automatically.
A backup of the previous PDF is in `SALKARA/_backups/` and `salkara/salkara.backup-2026-11-22.pdf`.

## Page text (buttons, headings, footer)
Text that isn't a dish or category, such as "View order", "Popular dishes" and the footer lines, is in
`assets/js/i18n.js`, under `en:` (English) and `ml:` (Malayalam). Change the text between the quotes and keep everything else as it is.
