/**
 * JERSEY TEMPLATES CONFIG
 * ========================
 * To add a new template:
 *   1. Add your image files to /public/templates/your-template-name/
 *      Required files:
 *        front.png   — front jersey (transparent PNG, line art only)
 *        back.png    — back jersey (transparent PNG, line art only)
 *        sock.png    — sock (transparent PNG)
 *        pant.png    — pant/short (transparent PNG)
 *        shading-front.png  — front shading overlay (transparent PNG)
 *        shading-back.png   — back shading overlay (transparent PNG)
 *        shading-sock.png   — sock shading overlay (transparent PNG)
 *        shading-pant.png   — pant shading overlay (transparent PNG)
 *        thumb.png          — thumbnail for the pattern picker grid
 *
 *   2. Add a new entry to the TEMPLATES array below.
 *
 * Color zones:
 *   Each template PNG uses color channels to define which zone gets which color:
 *   color1 = primary body color
 *   color2 = secondary (stripe/trim)
 *   color3 = tertiary (accent/stripe)
 *   color4 = quaternary (optional 4th zone)
 *
 * Text positions:
 *   x, y = canvas coordinates (canvas is 1000x1000 for front/back, 500x700 for sock, 600x800 for pant)
 *   angle = rotation in degrees
 *   fontSize = font size in px
 *   type = "name" | "number"
 *   align = "center" | "left" | "right"
 */

export const TEMPLATES = [
  {
    id: "classic",
    name: "The Classic",
    folder: "classic",
    numColors: 4,
    defaultColors: ["#1a3a6b", "#FFFFFF", "#c8a84b", "#1a1a1a"],
    defaultTextColor: "#FFFFFF",
    defaultStrokeColor: "#1a1a1a",
    // Text drawn on back: player name + big number
    // Text drawn on front: small numbers on shoulders
    textPositions: {
      front: [
        { x: 260, y: 460, angle: 28, fontSize: 90, type: "number", align: "center" },
        { x: 750, y: 460, angle: -28, fontSize: 90, type: "number", align: "center" },
      ],
      back: [
        { x: 500, y: 400, angle: 0, fontSize: 56, type: "name", align: "center" },
        { x: 500, y: 620, angle: 0, fontSize: 240, type: "number", align: "center" },
        { x: 250, y: 420, angle: 28, fontSize: 90, type: "number", align: "center" },
        { x: 750, y: 420, angle: -28, fontSize: 90, type: "number", align: "center" },
      ],
    },
    logoPosition: { x: 320, y: 420, size: 200 },
    logoLeftShoulder: { x: 175, y: 270, size: 110 },
    logoRightShoulder: { x: 825, y: 270, size: 110 },
  },
  {
    id: "retro-stripe",
    name: "Retro Stripe",
    folder: "retro-stripe",
    numColors: 4,
    defaultColors: ["#c8102e", "#FFFFFF", "#1a1a1a", "#c8a84b"],
    defaultTextColor: "#FFFFFF",
    defaultStrokeColor: "#1a1a1a",
    textPositions: {
      front: [
        { x: 260, y: 460, angle: 28, fontSize: 90, type: "number", align: "center" },
        { x: 750, y: 460, angle: -28, fontSize: 90, type: "number", align: "center" },
      ],
      back: [
        { x: 500, y: 400, angle: 0, fontSize: 56, type: "name", align: "center" },
        { x: 500, y: 620, angle: 0, fontSize: 240, type: "number", align: "center" },
        { x: 250, y: 420, angle: 28, fontSize: 90, type: "number", align: "center" },
        { x: 750, y: 420, angle: -28, fontSize: 90, type: "number", align: "center" },
      ],
    },
    logoPosition: { x: 320, y: 420, size: 200 },
    logoLeftShoulder: { x: 175, y: 270, size: 110 },
    logoRightShoulder: { x: 825, y: 270, size: 110 },
  },
  {
    id: "yoke",
    name: "The Yoke",
    folder: "yoke",
    numColors: 3,
    defaultColors: ["#0f4c81", "#FFFFFF", "#1a1a1a", "#1a1a1a"],
    defaultTextColor: "#FFFFFF",
    defaultStrokeColor: "#0f4c81",
    textPositions: {
      front: [
        { x: 260, y: 480, angle: 26, fontSize: 88, type: "number", align: "center" },
        { x: 740, y: 480, angle: -26, fontSize: 88, type: "number", align: "center" },
      ],
      back: [
        { x: 500, y: 410, angle: 0, fontSize: 56, type: "name", align: "center" },
        { x: 500, y: 630, angle: 0, fontSize: 240, type: "number", align: "center" },
        { x: 250, y: 430, angle: 26, fontSize: 88, type: "number", align: "center" },
        { x: 750, y: 430, angle: -26, fontSize: 88, type: "number", align: "center" },
      ],
    },
    logoPosition: { x: 320, y: 430, size: 195 },
    logoLeftShoulder: { x: 175, y: 270, size: 110 },
    logoRightShoulder: { x: 825, y: 270, size: 110 },
  },
]

export const COLORS = [
  { name: "Black",         hex: "#1a1a1a" },
  { name: "White",         hex: "#F7F7F7" },
  { name: "Chocolate",     hex: "#4a2c1a" },
  { name: "Creamsicle",    hex: "#FF7E00" },
  { name: "Orange",        hex: "#E8470F" },
  { name: "Red",           hex: "#C8102E" },
  { name: "Maroon",        hex: "#7B1C2A" },
  { name: "Pink Power",    hex: "#E8316E" },
  { name: "Pink Whit",     hex: "#F4A7C0" },
  { name: "Powder Blue",   hex: "#8BBCD4" },
  { name: "Frosty Blue",   hex: "#6CB4E4" },
  { name: "Royal",         hex: "#1560BD" },
  { name: "Navy",          hex: "#1a3a6b" },
  { name: "Teal",          hex: "#006D6F" },
  { name: "Forest Green",  hex: "#1B4D2E" },
  { name: "Kelly Green",   hex: "#00843D" },
  { name: "Northstar",     hex: "#154734" },
  { name: "Neon Green",    hex: "#39FF14" },
  { name: "Purple",        hex: "#5B2D8E" },
  { name: "Steel Grey",    hex: "#4a5568" },
  { name: "Silver",        hex: "#A8A9AD" },
  { name: "Sand",          hex: "#C8B9A2" },
  { name: "Vegas Gold",    hex: "#C8A84B" },
  { name: "Canary",        hex: "#FFE033" },
  { name: "Athletic Gold", hex: "#FFAD00" },
]

export const FONTS = [
  { name: "Chief",           file: "chief.ttf" },
  { name: "Armory",          file: "armory.ttf" },
  { name: "Beantown",        file: "beantown.ttf" },
  { name: "Block",           file: "block.ttf" },
  { name: "Stencil",         file: "stencil.ttf" },
]

// Lace options — null = no laces overlay
export const LACES = [
  { id: "none",  label: "No Laces", file: null },
  { id: "white", label: "White",    file: "/templates/laces-white.png" },
  { id: "black", label: "Black",    file: "/templates/laces-black.png" },
]
