'use client'

import { Button, ColorSelector, GridSelector, ToolSelector } from '@/components/ui'

import { SidebarToggle } from '@/components/icons'
import { useState } from 'react'

export default function Sidebar(): React.ReactNode {
	const [color, setColor] = useState('efefef')

	return (
		<aside className="absolute flex flex-col text-sm font-semibold border divide-y rounded-lg select-none w-52 bg-dark-800 top-3 left-3 bottom-3 border-neutral-600 text-light-900 divide-neutral-600">
			<div className="divide-y divide-neutral-600">
				<div className="flex items-center justify-between p-5">
					<span>Untitled</span>
					<Button variant="ghost" size="icon">
						<SidebarToggle />
					</Button>
				</div>
				<ToolSelector />
				<GridSelector />
				<ColorSelector color={color} setColor={setColor} />
			</div>

			<div className="flex flex-col justify-end flex-1 w-full p-5">
				<Button>Export</Button>
			</div>
		</aside>
	)
}
