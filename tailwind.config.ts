import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: '#138D3B', dark: '#0E6B2D', tint: '#E3F4E8' },
        teal: { DEFAULT: '#00645F', dark: '#004744', tint: '#DCEFEE' },
        gold: { DEFAULT: '#F5A900', dark: '#B97E00', tint: '#FFF0C9' },
        red: { DEFAULT: '#E94532', dark: '#B72E1E', tint: '#FDE6E2' },
        cream: { DEFAULT: '#FFF8E8', deep: '#F6EBCF' },
        ink: { DEFAULT: '#12261F', soft: '#44574F' },
        ws: { green: '#176B4D', 'green-dark': '#125A40', mint: '#E9F5EE', bg: '#F6F8F6', line: '#E4EBE6', ink: '#172A22', muted: '#5F6E66', 'amber-tint': '#FEF3DC', 'amber-ink': '#7A540A', red: '#B33E3E', 'red-tint': '#FCE8E8' },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-hero': ['clamp(2.4rem, 1.4rem + 4.6vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'fluid-h2': ['clamp(1.75rem, 1.2rem + 2.2vw, 2.9rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
      },
      borderRadius: { blob: '2rem 0.75rem 2rem 0.75rem' },
      boxShadow: { card: '0 1px 0 rgba(18,38,31,.06), 0 8px 24px -12px rgba(0,100,95,.25)' },
    },
  },
  plugins: [],
};
export default config;
