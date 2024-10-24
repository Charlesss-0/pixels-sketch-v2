'use client'

import { Grid, GridNone, Minus, Plus, Redo, SidebarToggle, Undo } from '@/components/icons'
import { useCanvas, useDebounce } from '@/hooks'

import { Button } from '@/components/ui'
import { useAppStore } from '@/stores'
import { useState } from 'react'

export default function Canvas(): React.ReactNode {
	const { isSidebarOpen, setIsSidebarOpen, isGridEnabled, setIsGridEnabled, fillStyle, gridSize } =
		useAppStore()
	const debouncedGridSize = useDebounce(gridSize, 500)
	const [zoomValue, setZoomValue] = useState<number>(100)
	const { canvasRef, gridCanvasRef, undo, redo } = useCanvas(
		isGridEnabled,
		debouncedGridSize,
		fillStyle
	)

	const updateZoomValue = (value: number): void => {
		if (value < 0 || value > 100) return
		setZoomValue(value)
	}

	return (
		<>
			<canvas
				ref={gridCanvasRef}
				width={800}
				height={800}
				className="absolute bg-white pointer-events-none"
			/>

			<canvas ref={canvasRef} width={800} height={800} className="bg-transparent z-10" />

			<Button
				className="absolute top-3 left-3"
				variant="ghost"
				size="icon"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				<SidebarToggle />
			</Button>

			<div className="absolute bottom-3 left-3 flex items-center bg-dark-800 rounded-md border border-neutral-600 gap-2 h-9 overflow-hidden">
				<Button
					variant="ghost"
					size="icon"
					className="rounded-none"
					onClick={() => updateZoomValue(zoomValue - 10)}
				>
					<Minus />
				</Button>

				<span className="text-sm text-light-900 font-medium text-center w-[4ch]">{zoomValue}%</span>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-none"
					onClick={() => updateZoomValue(zoomValue + 10)}
				>
					<Plus />
				</Button>
			</div>

			<div className="absolute bottom-3 right-3 flex gap-5 items-end">
				<div className="bg-dark-800 overflow-hidden rounded-md">
					<Button
						size="icon"
						className="bg-transparent hover:bg-light-900/10 h-11 w-11"
						onClick={() => setIsGridEnabled(!isGridEnabled)}
					>
						{isGridEnabled ? <Grid /> : <GridNone />}
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
