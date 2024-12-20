'use client'

import { Button, ColorSelector, GridSelector, ToolSelector } from '@/components/ui'

import { SidebarToggle } from '@/components/icons'
import { twMerge } from '@/utils'
import { useAppStore } from '@/stores'

export default function Sidebar(): React.ReactNode {
	const { isSidebarOpen, setIsSidebarOpen, projectName, setProjectName, setIsExporting } =
		useAppStore()

	return (
		<aside
			className={twMerge(
				'absolute flex flex-col text-sm font-semibold border divide-y rounded-lg select-none w-52 bg-dark-800 top-3 left-3 bottom-3 border-neutral-600 text-light-900 divide-neutral-600 z-10 transition-all duration-200 ease-in-out',
				isSidebarOpen ? 'translate-x-0' : '-translate-x-56'
			)}
		>
			<div className="divide-y divide-neutral-600">
				<div className="flex items-center justify-between p-5">
					<input
						type="text"
						defaultValue={projectName}
						maxLength={50}
						className="bg-transparent outline-none w-full pr-1 flex-1"
						onChange={e => setProjectName(e.target.value)}
					/>

					<Button
						variant="ghost"
						size="icon"
						className="rounded-md"
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					>
						<SidebarToggle />
					</Button>
				</div>

				<ToolSelector />
				<GridSelector />
				<ColorSelector />
			</div>

			<div className="flex flex-col justify-end flex-1 w-full p-5">
				<Button onClick={() => setIsExporting(true)}>Export</Button>
			</div>
		</aside>
	)
}
