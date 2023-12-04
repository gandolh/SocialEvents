import type { Config } from 'tailwindcss'

const withMT = require("./theme/withMT");

const config: Config = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-aero-08': 'rgba(30,41,59, 0.8)',
        'black-aero-01': 'rgba(0,0,0,0.1)',
        'black-aero-02': 'rgba(0,0,0,0.2)',
        'black-aero-03': 'rgba(0,0,0,0.3)',
        'black-aero-04': 'rgba(0,0,0,0.4)',
        'black-aero-05': 'rgba(0,0,0,0.5)',
        'black-aero-06': 'rgba(0,0,0,0.6)',
        'black-aero-07': 'rgba(0,0,0,0.7)',
        'black-aero-08': 'rgba(0,0,0,0.8)',
        'black-aero-09': 'rgba(0,0,0,0.9)',
        'white-aero-01': 'rgba(255,255,255,0.1)',
        'white-aero-02': 'rgba(255,255,255,0.2)',
        'white-aero-03': 'rgba(255,255,255,0.3)',
        'white-aero-04': 'rgba(255,255,255,0.4)',
        'white-aero-05': 'rgba(255,255,255,0.5)',
        'white-aero-06': 'rgba(255,255,255,0.6)',
        'white-aero-07': 'rgba(255,255,255,0.7)',
        'white-aero-08': 'rgba(255,255,255,0.8)',
        'white-aero-09': 'rgba(255,255,255,0.9)',
        'indigo-aero-04': 'rgba(199,210,254,0.4)',
      },

    },
  },
  plugins: [],
})
export default config
