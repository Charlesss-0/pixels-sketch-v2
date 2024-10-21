import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'

export const geistSans = localFont({
	src: './geist/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
	preload: true,
})

export const geistMono = localFont({
	src: './geist/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
	preload: true,
})

export const poppins = Poppins({
	subsets: ['latin'],
	variable: '--font-poppins',
	weight: ['100', '300', '400', '500', '600', '700', '800', '900'],
})
