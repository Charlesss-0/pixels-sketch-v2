'use client'

import { CrossedGrid, Grid, Redo, SidebarToggle, Undo } from '@/components/icons'
import { useCanvas, useDebounce } from '@/hooks'

import { Button } from '@/components/ui'
import { useAppStore } from '@/stores'

export default function Canvas(): React.ReactNode {
	const {
		isSidebarOpen,
		setIsSidebarOpen,
		penTool,
		gridSize,
		isGridEnabled,
		setIsGridEnabled,
		fillStyle,
	} = useAppStore()
	const debouncedGridSize = useDebounce(gridSize, 500)
	const { canvasRef, gridCanvasRef, undo, redo } = useCanvas(
		isGridEnabled,
		debouncedGridSize,
		fillStyle,
		penTool
	)

	return (
		<>
			<canvas ref={canvasRef} width={800} height={800} className="absolute bg-white" />

			<canvas
				ref={gridCanvasRef}
				width={800}
				height={800}
				className="absolute bg-transparent pointer-events-none z-10"
			/>

			<Button
				className="absolute top-3 left-3"
				variant="ghost"
				size="icon"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				<SidebarToggle />
			</Button>

			<div className="absolute bottom-3 right-3 flex gap-5 items-end">
				<div className="bg-dark-800 overflow-hidden rounded-md">
					<Button
						size="icon"
						className="bg-transparent hover:bg-light-900/10 h-11 w-11"
						onClick={() => setIsGridEnabled(!isGridEnabled)}
					>
						{isGridEnabled ? <Grid /> : <CrossedGrid />}
					</Button>
				</div>

				<div className="bg-dark-800 rounded-md flex items-center justify-between border border-neutral-600 overflow-hidden h-9 divide-x divide-neutral-600">
					<Button variant="ghost" size="icon" className="rounded-none" onClick={undo}>
						<Undo />
					</Button>

					<Button variant="ghost" size="icon" className="rounded-none" onClick={redo}>
						<Redo />
					</Button>
				</div>
			</div>
		</>
	)
}
