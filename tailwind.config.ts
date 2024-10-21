import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				dark: {
					900: '#2e2e2e',
					800: '#3E3E3E',
				},
				light: {
					900: '#f5f5f5',
					800: '#AFAFAF',
				},
			},
			fontFamily: {
				sans: ['var(--font-geist-sans)'],
				mono: ['var(--font-geist-mono)'],
				poppins: ['var(--font-poppins)'],
			},
			fontSize: {
				small: '0.65rem',
			},
		},
	},
	plugins: [],
}
export default config
