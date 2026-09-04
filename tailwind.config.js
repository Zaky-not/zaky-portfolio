/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // All colors resolve through CSS variables (see src/index.css) so the
        // dark/light theme toggle works without touching any component.
        surface: {
          0: 'rgb(var(--surface-0-rgb) / <alpha-value>)',
          1: 'rgb(var(--surface-1-rgb) / <alpha-value>)',
          2: 'rgb(var(--surface-2-rgb) / <alpha-value>)',
          3: 'rgb(var(--surface-3-rgb) / <alpha-value>)',
          4: 'rgb(var(--surface-4-rgb) / <alpha-value>)',
          5: 'rgb(var(--surface-5-rgb) / <alpha-value>)',
        },
        ink: {
          primary: 'var(--ink-primary)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
        },
        line: 'var(--border)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        signature: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
}
