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
				className="absolute z-10 bg-transparent pointer-events-none"
			/>

			<Button
				className="absolute rounded-md top-3 left-3"
				variant="ghost"
				size="icon"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				<SidebarToggle />
			</Button>

			<div className="absolute flex items-end gap-5 bottom-3 right-3">
				<div className="overflow-hidden rounded-md bg-dark-800">
					<Button
						size="icon"
						className="bg-transparent hover:bg-light-900/10 h-11 w-11"
						onClick={() => setIsGridEnabled(!isGridEnabled)}
					>
						{isGridEnabled ? <Grid /> : <CrossedGrid />}
					</Button>
				</div>

				<div className="flex items-center justify-between overflow-hidden border divide-x rounded-md bg-dark-800 border-neutral-600 h-9 divide-neutral-600">
					<Button variant="ghost" size="icon" className="rounded-none" onClick={undo}>
						<Undo />
					</Button>

					<Button variant="ghost" size="icon" className="rounded-none" onClick={redo}>
						<Redo />
					</Button>
				</div>
			</div>

			{isExporting && (
				<div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black/50">
					<div className="z-20 flex gap-10 p-6 shadow-xl bg-dark-800 rounded-xl">
						<div className="w-64 h-64 overflow-hidden border rounded-lg border-neutral-600">
							{preview && (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={preview}
									alt="Export Preview"
									className="w-full h-full select-none"
									draggable={false}
								/>
							)}
						</div>

						<div className="flex flex-col justify-between">
							<div className="flex flex-wrap gap-3">
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

							<div className="flex justify-end gap-5">
								<Button
									className="border-none w-28 bg-neutral-600 hover:bg-neutral-600/80"
									onClick={() => setIsExporting(false)}
								>
									Cancel
								</Button>

								<Button
									className="w-24 border-none bg-primary text-light-900 hover:bg-primary/80"
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
