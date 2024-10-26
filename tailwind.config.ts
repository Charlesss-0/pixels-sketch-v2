import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#0C8CE9',
				dark: {
					'800': '#3E3E3E',
					'900': '#2e2e2e',
				},
				light: {
					'800': '#AFAFAF',
					'900': '#f5f5f5',
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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				sm: '1px 1px 2px 0 #0000005c',
				md: '3px 3px 6px 0 #0000005c',
				lg: '5px 5px 10px 0 #0000005c',
				xl: '7px 7px 14px 0 #0000005c',
				'2xl': '9px 9px 18px 0 #0000005c',
			},
		},
	},
}
export default config
