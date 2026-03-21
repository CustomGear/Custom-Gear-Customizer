# Jersey Customizer

A fully custom hockey jersey configurator — built to match the UX of
customize.mensleaguesweaters.com, with clean source code you own and control.

---

## 🏒 Adding a New Jersey Template (the most important thing)

**It takes 3 steps:**

### Step 1 — Prepare your PNG files

Create a folder inside `public/templates/` named after your template, e.g. `public/templates/my-new-jersey/`

You need these PNG files inside that folder:

| File | Description |
|------|-------------|
| `front.png` | Front jersey — transparent background, line art / stripe shapes |
| `back.png` | Back jersey — same treatment |
| `sock.png` | Sock pair |
| `pant.png` | Hockey pants |
| `shading-front.png` | Shading/depth overlay for front (semi-transparent) |
| `shading-back.png` | Shading overlay for back |
| `shading-sock.png` | Shading overlay for sock |
| `shading-pant.png` | Shading overlay for pant |
| `thumb.png` | Small thumbnail shown in the pattern picker grid (~120×120px) |

**How the color zones work in your PNGs:**

The renderer fills the canvas with **Color 1** first, then draws your PNG on top
using `multiply` blend mode. This means:

- **White areas** in the PNG = show Color 1 (primary body color)
- **Dark/black areas** = lines and outlines (stay dark)
- **Pure red pixels** (R>180, G<80, B<80) = replaced with **Color 2**
- **Pure green pixels** (G>180, R<80, B<80) = replaced with **Color 3**
- **Pure blue pixels** (B>180, R<80, B<80) = replaced with **Color 4**

So when designing your template PNGs in Illustrator / Figma:
- Draw your jersey shape with white fill
- Color secondary stripe zones with `#ff0000` (pure red)
- Color tertiary zones with `#00ff00` (pure green)
- Use `#0000ff` (pure blue) for a 4th zone
- Export as transparent PNG — the app handles all the coloring at runtime

### Step 2 — Add an entry to `src/templates.js`

```js
{
  id: "my-new-jersey",       // unique slug, matches folder name
  name: "My New Jersey",     // display name shown on hover
  folder: "my-new-jersey",   // must match the folder in /public/templates/
  numColors: 4,              // how many color pickers to show (1-4)
  defaultColors: ["#c8102e", "#FFFFFF", "#1a1a1a", "#c8a84b"],
  defaultTextColor: "#FFFFFF",
  defaultStrokeColor: "#1a1a1a",

  // Where text gets drawn — coordinates are on a 1000×1000 grid for front/back
  textPositions: {
    front: [
      // Small numbers on sleeves
      { x: 260, y: 460, angle: 28, fontSize: 90, type: "number", align: "center" },
      { x: 750, y: 460, angle: -28, fontSize: 90, type: "number", align: "center" },
    ],
    back: [
      // Player name
      { x: 500, y: 400, angle: 0, fontSize: 56, type: "name", align: "center" },
      // Big number
      { x: 500, y: 620, angle: 0, fontSize: 240, type: "number", align: "center" },
      // Sleeve numbers
      { x: 250, y: 420, angle: 28, fontSize: 90, type: "number", align: "center" },
      { x: 750, y: 420, angle: -28, fontSize: 90, type: "number", align: "center" },
    ],
  },

  // Logo placement on the front (x,y = center of logo, size = diameter)
  logoPosition:      { x: 320, y: 420, size: 200 },
  logoLeftShoulder:  { x: 175, y: 270, size: 110 },
  logoRightShoulder: { x: 825, y: 270, size: 110 },
},
```

### Step 3 — Done! Push to GitHub → Netlify deploys automatically

---

## 🚀 Setup & Deployment

### Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Deploy to Netlify via GitHub

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Import from Git"
3. Select your repo
4. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click Deploy — done!

Every push to `main` triggers a new deploy automatically.

### Environment variables (for order emails)

In Netlify dashboard → Site settings → Environment variables, add:

```
NOTIFY_EMAIL   your@email.com
FROM_EMAIL     orders@yourdomain.com
RESEND_API_KEY re_xxxxxxxxxxxx   (sign up free at resend.com)
```

Then uncomment the email code in `netlify/functions/submit-order.js`.

---

## 📁 Project Structure

```
jersey-customizer/
├── public/
│   ├── templates/               ← Your jersey PNG files go here
│   │   ├── classic/
│   │   │   ├── front.png
│   │   │   ├── back.png
│   │   │   ├── sock.png
│   │   │   ├── pant.png
│   │   │   ├── shading-front.png
│   │   │   ├── shading-back.png
│   │   │   ├── shading-sock.png
│   │   │   ├── shading-pant.png
│   │   │   └── thumb.png
│   │   └── laces-white.png      ← Optional lace overlays
│   │   └── laces-black.png
│   └── fonts/                   ← Your .ttf font files
│       └── chief.ttf
│
├── src/
│   ├── templates.js             ← ★ ADD NEW TEMPLATES HERE ★
│   ├── App.jsx                  ← Main app (6-step flow)
│   ├── index.css                ← All styles
│   ├── components/
│   │   ├── JerseyCanvas.jsx     ← Canvas wrapper per panel
│   │   ├── StepTeamName.jsx     ← Step 1
│   │   ├── StepColors.jsx       ← Step 2
│   │   ├── StepPattern.jsx      ← Step 3
│   │   ├── StepText.jsx         ← Step 4
│   │   ├── StepLogo.jsx         ← Step 5
│   │   ├── StepLaces.jsx        ← Step 6
│   │   └── SubmitModal.jsx      ← Order form
│   └── hooks/
│       └── useJerseyCanvas.js   ← Canvas rendering engine
│
├── netlify/
│   └── functions/
│       └── submit-order.js      ← Order email handler
│
├── netlify.toml                 ← Netlify build + routing config
├── package.json
└── vite.config.js
```

---

## 🎨 Customizing the App

### Change your brand name / logo
Edit the header section in `src/App.jsx` — search for "Jersey Customizer".

### Add / remove colors
Edit the `COLORS` array in `src/templates.js`.

### Add / remove fonts
1. Drop your `.ttf` or `.otf` file in `public/fonts/`
2. Add an entry to `FONTS` in `src/templates.js`:
   ```js
   { name: "My Font", file: "my-font.ttf" }
   ```

### Add more sport types (e.g. baseball, basketball)
The system is sport-agnostic. Just create a new category of templates
with the appropriate silhouette PNGs. You could add a sport selector
at the top of `App.jsx` that filters the `TEMPLATES` array by a `sport` field.

---

## 🔒 Template File Security

Currently, template PNGs are served from `/public/` and are publicly accessible
by URL. This is the same approach used by the reference site.

If you want stronger protection:
1. Move your templates out of `/public/` into a private directory
2. Add authentication to `netlify/functions/serve-template.js`
3. Serve all template images through that function with session checking

For most use cases, serving from `/public/` is fine — the PNG files are just
outlines and are only useful within the context of your app.
