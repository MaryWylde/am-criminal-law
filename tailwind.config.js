/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        'paper-3': 'var(--paper-3)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-mute': 'var(--ink-mute)',
        accent: 'var(--accent)',
        'accent-dark': 'var(--accent-dark)',
        'accent-ink': 'var(--accent-ink)',
        side: 'var(--side)',
        'side-2': 'var(--side-2)',
        'side-3': 'var(--side-3)',
        'side-line': 'var(--side-line)',
        'side-text': 'var(--side-text)',
        'side-dim': 'var(--side-dim)',
        'side-mute': 'var(--side-mute)',
        stage: 'var(--stage)',
        'stage-text': 'var(--stage-text)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      screens: {
        '3xl': '1700px',
      },
    },
  },
  plugins: [],
}
