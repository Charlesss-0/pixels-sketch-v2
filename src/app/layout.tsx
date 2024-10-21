import './globals.css'

import { geistMono, geistSans, poppins } from './fonts'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Pixels Sketch',
	description: 'Pixel art editor',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>): React.ReactNode {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
		>
			<body className="font-poppins">{children}</body>
		</html>
	)
}
