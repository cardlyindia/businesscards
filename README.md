# Cardly - Digital Business Cards & Digital Identity Hub

A luxury, high-performance static website for **Cardly Digital Identity Solutions**, built to showcase NFC Business Cards, Digital Business Cards, Restaurant QR Menus, Google Review Cards, PDF Visiting Cards, Social Media Cards, and smart business branding.

Built with **Pure HTML5, Vanilla CSS3 (Design Tokens, Glassmorphism, HSL dark/light modes), Vanilla JavaScript, and Three.js** — delivering a 100 Lighthouse performance score with zero heavy JS frameworks.

---

## 🌟 Key Features

- **Linear & Vercel Aesthetic**: Premium dark-mode default with cyan (`#00D4FF`) and purple (`#8B5CF6`) gradients, glassmorphism UI, and smooth subtle micro-animations.
- **Auto & Manual Dark/Light Themes**: System color scheme detection with manual toggle switch and zero-flash LocalStorage persistence.
- **Interactive Three.js 3D Hero Scene**: Real-time WebGL rendering of 3D NFC Cards, QR Restaurant Menus, and Google Review Cards with floating animations, mouse parallax tilt, drag-to-rotate, lighting reflections, and 3D particle backgrounds.
- **100% Google Form Order Routing**: No online payment gateways or cart checkout flows. Every CTA button routes directly to the official Google order form: `https://forms.gle/XEzzq6fHmLAErCg3A`.
- **Complete Solutions Hub**: 12 dedicated product cards, 12 core features, 18 industry sectors, collapsible FAQ accordion, and direct contact options (`cardlyindia@gmail.com` and Instagram `https://www.instagram.com/cardlynfc/`).
- **Full SEO & PWA Optimization**: Title, meta description, keywords, OpenGraph, Twitter card tags, JSON-LD structured data (Organization, LocalBusiness, Product, FAQPage, BreadcrumbList), `sitemap.xml`, `robots.txt`, and `manifest.json`.
- **Sticky Mobile CTA**: Fixed bottom bar for mobile screens ensuring effortless conversion.

---

## 📂 Project Structure

```
/
├── index.html               # Main SEO-optimized HTML document
├── css/
│   ├── main.css             # Design tokens, theme variables, typography, reset
│   ├── components.css       # Navbar, buttons, glass cards, grid layouts, mobile drawer
│   └── hero-3d.css          # Three.js canvas viewport & 3D switcher controls
├── js/
│   ├── theme.js             # Dark/light mode switcher & system preference observer
│   ├── three-hero.js        # Three.js WebGL card rendering, parallax, particles
│   ├── animations.js        # Scroll reveal animations, magnetic hover, FAQ toggle
│   └── app.js               # Navigation drawer & scroll observer
├── public/
│   ├── favicon.svg          # Cardly SVG icon logo
│   └── manifest.json        # Web App Manifest
├── sitemap.xml              # Search engine XML sitemap
├── robots.txt               # Crawler directives
└── README.md                # Documentation & deployment guides
```

---

## 🚀 How to Run Locally

Since Cardly is built using pure static web standards, you can view it directly by opening `index.html` in any modern web browser or serving it using a local HTTP web server:

```bash
# Option 1: Using Python 3 HTTP Server
python3 -m http.server 8000

# Option 2: Using Node.js npx serve
npx serve .
```

Open `http://localhost:8000` in your web browser.

---

## 🌐 Deployment Instructions

### 1. Deploying to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the root folder.
3. Select defaults when prompted. Your static site will instantly deploy to Vercel's global CDN network.

### 2. Deploying to Netlify
1. Drag and drop the project directory into the [Netlify App Dashboard](https://app.netlify.com/drop).
2. Or use Netlify CLI: `npx netlify-cli deploy --prod`

### 3. Deploying to GitHub Pages
1. Push the code repository to GitHub.
2. Go to **Settings > Pages**.
3. Select `main` branch and `/ (root)` folder.
4. Click **Save**.

---

## 📬 Contact & Support

- **Email**: [cardlyindia@gmail.com](mailto:cardlyindia@gmail.com)
- **Instagram**: [https://www.instagram.com/cardlynfc/](https://www.instagram.com/cardlynfc/)
- **Order Form**: [https://forms.gle/XEzzq6fHmLAErCg3A](https://forms.gle/XEzzq6fHmLAErCg3A)
