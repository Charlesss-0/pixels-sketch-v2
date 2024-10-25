'use client'

import { CrossedGrid, Grid, Redo, SidebarToggle, Undo } from '@/components/icons'
import { useCanvas, useDebounce } from '@/hooks'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui'
import { twMerge } from '@/utils/tw-merge'
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
		isExporting,
		setIsExporting,
		exportFormat,
		setExportFormat,
	} = useAppStore()
	const debouncedGridSize = useDebounce(gridSize, 500)
	const { canvasRef, gridCanvasRef, undo, redo, exportCanvas } = useCanvas(
		isGridEnabled,
		debouncedGridSize,
		fillStyle,
		penTool
	)
	const formats = ['PNG', 'JPEG', 'SVG'] as const
	const [preview, setPreview] = useState<string | null>(null)

	useEffect(() => {
		if (isExporting) {
			const previewURL = exportCanvas(exportFormat, true)
			setPreview(previewURL as string)
		}
	}, [isExporting, exportFormat, exportCanvas])

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
				className="absolute top-3 left-3 rounded-md"
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

			{isExporting && (
				<div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10">
					<div className="bg-dark-800 rounded-xl p-5 flex gap-10 z-20">
						<div className="w-64 h-56 rounded-lg border border-neutral-600 overflow-hidden">
							{preview && (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={preview} alt="Export Preview" className="w-full h-full" />
							)}
						</div>

						<div className="flex flex-col justify-between">
							<div className="flex gap-3 flex-wrap">
								{formats.map(format => (
									<Button
										key={format}
										className={twMerge(
											'w-13 text-small text-light-900 rounded-md',
											exportFormat === format.toLowerCase() && 'ring-2 ring-neutral-600'
										)}
										onClick={() => setExportFormat(format.toLowerCase() as 'png' | 'jpeg' | 'svg')}
									>
										{format}
									</Button>
								))}
							</div>

							<div className="flex gap-5 justify-end">
								<Button
									className="border-none w-28 bg-neutral-600 hover:bg-neutral-600/80"
									onClick={() => setIsExporting(false)}
								>
									Cancel
								</Button>

								<Button
									className="bg-primary border-none w-24 text-light-900 hover:bg-primary/80"
									onClick={() => {
										exportCanvas(exportFormat)
										setIsExporting(false)
									}}
								>
									Save
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
