const notifyPreset = require('@david-richard/notify-ds/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [notifyPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx,html}',
    './node_modules/@david-richard/notify-ds/dist/**/*.{js,mjs}',
  ],
}
