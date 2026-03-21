/**
 * TEMPLATES CONFIG
 * ================
 * Color zones — these placeholder colors in the SVGs get replaced at runtime:
 *   COLOR_1 (#30E2E2) = primary body
 *   COLOR_2 (#167C8C) = secondary stripe/yoke  
 *   COLOR_3 (#51DE48) = tertiary accent
 *   COLOR_4 (#8E23CC) = quaternary detail
 *
 * To add a new template:
 *   1. Add your SVG file to /public/assets/
 *   2. Add an entry below pointing to it
 *   3. Push to GitHub → auto-deploys
 */

export const COLOR_ZONES = {
  1: '#30E2E2',
  2: '#167C8C',
  3: '#51DE48',
  4: '#8E23CC',
}

export const TEMPLATES = [
  {
    id: 'mod-01',
    name: 'The Classic',
    file: '/assets/customizer-mod-4.0-01-qxxjy3tk.svg',
    numColors: 4,
    defaultColors: ['#1A3A6B', '#FFFFFF', '#C8A84B', '#1A1A1A'],
  },
  {
    id: 'mod-02',
    name: 'Retro Stripe',
    file: '/assets/customizer-mod-4.0-02-b8q6okzx.svg',
    numColors: 4,
    defaultColors: ['#C8102E', '#FFFFFF', '#1A1A1A', '#C8A84B'],
  },
  {
    id: 'mod-03',
    name: 'The Yoke',
    file: '/assets/customizer-mod-4.0-03-dpukjwgs.svg',
    numColors: 4,
    defaultColors: ['#0F4C81', '#FFFFFF', '#C8A84B', '#1A1A1A'],
  },
  {
    id: 'mod-04',
    name: 'Double Stripe',
    file: '/assets/customizer-mod-4.0-04-d6ym9dgs.svg',
    numColors: 4,
    defaultColors: ['#154734', '#FFFFFF', '#C8A84B', '#1A1A1A'],
  },
  {
    id: 'mod-05',
    name: 'The Captain',
    file: '/assets/customizer-mod-4.0-05-b54vlrbz.svg',
    numColors: 4,
    defaultColors: ['#1A1A1A', '#FFFFFF', '#C8102E', '#C8A84B'],
  },
  {
    id: 'mod-06',
    name: 'Side Panel',
    file: '/assets/customizer-mod-4.0-06-cneaqr-t.svg',
    numColors: 3,
    defaultColors: ['#1560BD', '#FFFFFF', '#C8102E', '#1A1A1A'],
  },
  {
    id: 'mod-07',
    name: 'The Enforcer',
    file: '/assets/customizer-mod-4.0-07-dfj_29ex.svg',
    numColors: 4,
    defaultColors: ['#5B2D8E', '#FFFFFF', '#C8A84B', '#1A1A1A'],
  },
  {
    id: 'mod-08',
    name: 'Shoulder Block',
    file: '/assets/customizer-mod-4.0-08-andb-qrv.svg',
    numColors: 4,
    defaultColors: ['#006D6F', '#FFFFFF', '#C8A84B', '#1A1A1A'],
  },
  {
    id: 'mod-09',
    name: 'The Pro',
    file: '/assets/customizer-mod-4.0-09-i2kphuup.svg',
    numColors: 4,
    defaultColors: ['#AF1E2D', '#FFFFFF', '#192168', '#C8A84B'],
  },
  {
    id: 'mod-10',
    name: 'The Edge',
    file: '/assets/customizer-mod-4.0-10-dt3pd7ze.svg',
    numColors: 4,
    defaultColors: ['#1A1A1A', '#C8102E', '#FFFFFF', '#C8A84B'],
  },
  {
    id: 'mod-11',
    name: 'Clean Cut',
    file: '/assets/customizer-mod-4.0-11-brjgitnl.svg',
    numColors: 3,
    defaultColors: ['#1A3A6B', '#FFFFFF', '#C8A84B', '#1A1A1A'],
  },
  {
    id: 'mod-12',
    name: 'The Grinder',
    file: '/assets/customizer-mod-4.0-12-buhsetoo.svg',
    numColors: 4,
    defaultColors: ['#FF7E00', '#FFFFFF', '#1A1A1A', '#C8A84B'],
  },
  {
    id: 'mod-13',
    name: 'Showtime',
    file: '/assets/customizer-mod-4.0-13-bscx9sra.svg',
    numColors: 4,
    defaultColors: ['#C8102E', '#1A1A1A', '#FFFFFF', '#C8A84B'],
  },
  {
    id: 'mod-14',
    name: 'The Warrior',
    file: '/assets/customizer-mod-4.0-14-b8cwam_x.svg',
    numColors: 4,
    defaultColors: ['#154734', '#C8A84B', '#FFFFFF', '#1A1A1A'],
  },
  {
    id: 'mod-15',
    name: 'Full Kit',
    file: '/assets/customizer-mod-4.0-15-b4shxkee.svg',
    numColors: 4,
    defaultColors: ['#1560BD', '#FFFFFF', '#C8102E', '#1A1A1A'],
  },
  {
    id: 'mod-16',
    name: 'The Legend',
    file: '/assets/customizer-mod-4.0-16-nzpgd_xt.svg',
    numColors: 4,
    defaultColors: ['#1A1A1A', '#C8102E', '#FFFFFF', '#C8A84B'],
  },
  {
    id: 'mod-17',
    name: 'The Elite',
    file: '/assets/customizer-mod-4.0-17-in_we5cx.svg',
    numColors: 4,
    defaultColors: ['#5B2D8E', '#FFFFFF', '#C8A84B', '#1A1A1A'],
  },
]

export const COLORS = [
  { name: 'Black',         hex: '#1A1A1A' },
  { name: 'White',         hex: '#F7F7F7' },
  { name: 'Chocolate',     hex: '#4A2C17' },
  { name: 'Creamsicle',    hex: '#FF7E00' },
  { name: 'Orange',        hex: '#E8470F' },
  { name: 'Red',           hex: '#C8102E' },
  { name: 'Maroon',        hex: '#7B1C2A' },
  { name: 'Pink Power',    hex: '#E8316E' },
  { name: 'Pink',          hex: '#F4A7C0' },
  { name: 'Powder Blue',   hex: '#8BBCD4' },
  { name: 'Frosty Blue',   hex: '#6CB4E4' },
  { name: 'Royal',         hex: '#1560BD' },
  { name: 'Navy',          hex: '#1A3A6B' },
  { name: 'Teal',          hex: '#006D6F' },
  { name: 'Forest',        hex: '#1B4D2E' },
  { name: 'Kelly Green',   hex: '#00843D' },
  { name: 'Northstar',     hex: '#154734' },
  { name: 'Neon Green',    hex: '#39FF14' },
  { name: 'Purple',        hex: '#5B2D8E' },
  { name: 'Steel Grey',    hex: '#4A5568' },
  { name: 'Silver',        hex: '#A8A9AD' },
  { name: 'Sand',          hex: '#C8B9A2' },
  { name: 'Vegas Gold',    hex: '#C8A84B' },
  { name: 'Canary',        hex: '#FFE033' },
  { name: 'Athletic Gold', hex: '#FFAD00' },
]

export const FONTS = [
  { name: 'Northstar',  file: 'northstar.ttf' },
  { name: 'Broad',      file: 'broad.ttf' },
  { name: 'Predx',      file: 'predx.ttf' },
  { name: 'Lonestar',   file: 'lonestar.ttf' },
  { name: 'Coyote',     file: 'coyote.ttf' },
  { name: 'Massport',   file: 'massport.ttf' },
  { name: 'Rocky',      file: 'rocky.ttf' },
  { name: 'Flame',      file: 'flame.ttf' },
  { name: 'Bronco',     file: 'bronco.ttf' },
  { name: 'Maple',      file: 'maple.ttf' },
  { name: 'SportX',     file: 'sportx.ttf' },
  { name: 'M54 Rink',   file: 'm54rink.ttf' },
  { name: 'Nordic',     file: 'nordic.ttf' },
  { name: 'Acadex',     file: 'acadex.ttf' },
  { name: 'Panther',    file: 'panther.ttf' },
  { name: 'Habs',       file: 'habs.ttf' },
  { name: 'Nospeed',    file: 'nospeed.ttf' },
  { name: 'Easton',     file: 'easton.ttf' },
  { name: 'Reign',      file: 'reign.ttf' },
  { name: 'Sharkx',     file: 'sharkx.ttf' },
  { name: 'Jerseyx',    file: 'jerseyx.ttf' },
  { name: 'Nevis',      file: 'nevis.ttf' },
  { name: 'Caliber',    file: 'caliber.ttf' },
]

export const LACES = [
  { id: 'none',  label: 'No Laces',    file: null },
  { id: 'white', label: 'White Laces', file: '/assets/white-laces-21-22-d-6-gkvr.svg' },
  { id: 'black', label: 'Black Laces', file: '/assets/black-laces-21-bh5ciwho.svg' },
]
