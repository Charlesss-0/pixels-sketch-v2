import { useAppStore, useCanvasStore } from '@/stores'
import { useEffect, useRef, useState } from 'react'

export default function useCanvas(
	isGridEnabled: boolean,
	gridSize: number,
	fillStyle: string,
	penTool: 'pen' | 'paint-bucket' | 'eraser'
): {
	canvasRef: React.RefObject<HTMLCanvasElement>
	gridCanvasRef: React.RefObject<HTMLCanvasElement>
	redo: () => void
	undo: () => void
	exportCanvas: (format: 'png' | 'jpeg' | 'svg', previewOnly?: boolean) => string | void
} {
	const { projectName } = useAppStore()
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const gridCanvasRef = useRef<HTMLCanvasElement>(null)
	const [isDrawing, setIsDrawing] = useState<boolean>(false)
	const drawingActions = useRef<Array<{ x: number; y: number; size: number; color: string }>>([])
	const { actions, addAction, clearActions, undo, redo } = useCanvasStore()
	const prevGridSize = useRef<number>(gridSize)

	useEffect(() => {
		const canvas = canvasRef.current
		const gridCanvas = gridCanvasRef.current
		if (!canvas || !gridCanvas) return

		const drawContext = canvas.getContext('2d')
		const gridContext = gridCanvas.getContext('2d')

		if (!drawContext || !gridContext) return

		const pixelSize = 800 / gridSize

		const drawActions = (): void => {
			drawContext.clearRect(0, 0, canvas.width, canvas.height)

			actions.forEach(action => {
				action.forEach(stroke => {
					if (stroke.color === 'transparent') {
						drawContext.clearRect(stroke.x, stroke.y, stroke.size, stroke.size)
						return
					}

					drawContext.fillStyle = stroke.color
					drawContext.fillRect(stroke.x, stroke.y, stroke.size, stroke.size)
				})
			})

			drawContext.restore()
		}

		const drawGrid = (): void => {
			gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height)
			if (!isGridEnabled) return

			for (let x = 0; x < gridCanvas.width; x += pixelSize) {
				for (let y = 0; y < gridCanvas.height; y += pixelSize) {
					gridContext.strokeStyle = '#dddddd'
					gridContext.strokeRect(x, y, pixelSize, pixelSize)
				}
			}

			gridContext.restore()
		}
		drawGrid()
		drawActions()

		if (prevGridSize.current !== gridSize) {
			drawContext.clearRect(0, 0, canvas.width, canvas.height)
			prevGridSize.current = gridSize
			drawGrid()
			clearActions()
		}

		const getMousePos = (e: MouseEvent): { x: number; y: number } => {
			const rect = canvas.getBoundingClientRect()
			const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize
			const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize

			return { x, y }
		}

		const handleMouseDown = (e: MouseEvent): void => {
			setIsDrawing(true)
			const { x, y } = getMousePos(e)

			if (penTool === 'paint-bucket') {
				const bucketAction = { x: 0, y: 0, size: canvas.width, color: `#${fillStyle}` }

				drawContext.fillStyle = `#${fillStyle}`
				drawContext.fillRect(0, 0, canvas.width, canvas.height)

				addAction([bucketAction])
			} else if (penTool === 'eraser') {
				const eraseAction = { x, y, size: pixelSize, color: 'transparent' }

				drawContext.clearRect(eraseAction.x, eraseAction.y, eraseAction.size, eraseAction.size)

				drawingActions.current.push(eraseAction)
			} else {
				const drawAction = { x, y, size: pixelSize, color: `#${fillStyle}` }

				drawContext.fillStyle = drawAction.color
				drawContext.fillRect(drawAction.x, drawAction.y, drawAction.size, drawAction.size)

				drawingActions.current.push(drawAction)
			}
		}

		const handleMouseMove = (e: MouseEvent): void => {
			if (!isDrawing) return

			const { x, y } = getMousePos(e)

			if (penTool === 'eraser') {
				const eraseAction = { x, y, size: pixelSize, color: 'transparent' }

				drawContext.clearRect(eraseAction.x, eraseAction.y, eraseAction.size, eraseAction.size)

				drawingActions.current.push(eraseAction)
			} else {
				const drawAction = { x, y, size: pixelSize, color: `#${fillStyle}` }

				drawContext.fillStyle = drawAction.color
				drawContext.fillRect(drawAction.x, drawAction.y, drawAction.size, drawAction.size)

				drawingActions.current.push(drawAction)
			}
		}

		const handleMouseUp = (): void => {
			setIsDrawing(false)

			if (drawingActions.current.length > 0) {
				addAction(drawingActions.current)
				drawingActions.current = []
			}
		}

		canvas.addEventListener('mousedown', handleMouseDown)
		canvas.addEventListener('mousemove', handleMouseMove)
		canvas.addEventListener('mouseup', handleMouseUp)
		canvas.addEventListener('mouseleave', handleMouseUp)

		return (): void => {
			canvas.removeEventListener('mousedown', handleMouseDown)
			canvas.removeEventListener('mousemove', handleMouseMove)
			canvas.removeEventListener('mouseup', handleMouseUp)
			canvas.removeEventListener('mouseleave', handleMouseUp)
		}
	}, [isDrawing, isGridEnabled, fillStyle, gridSize, actions, addAction, clearActions, penTool])

	const exportCanvas = (format: 'png' | 'jpeg' | 'svg', previewOnly = false): string | void => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const getVisibleStrokes = (): Array<{ x: number; y: number; size: number; color: string }> => {
			const visibleStrokes = new Map<
				string,
				{ x: number; y: number; size: number; color: string }
			>()

			actions.forEach(actionGroup => {
				actionGroup.forEach(stroke => {
					const key = `${stroke.x}-${stroke.y}`
					if (stroke.color === 'transparent') {
						// Remove any strokes at this location if using eraser
						visibleStrokes.delete(key)
					} else {
						// Update or add the stroke if it's a visible color
						visibleStrokes.set(key, stroke)
					}
				})
			})

			return Array.from(visibleStrokes.values())
		}

		if (format === 'svg') {
			const visibleStrokes = getVisibleStrokes()

			const svgData = `
				<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
					${visibleStrokes
						.map(
							stroke => `
					<rect x="${stroke.x}" y="${stroke.y}" width="${stroke.size}" height="${stroke.size}" fill="${stroke.color}" />
					`
						)
						.join('')}
				</svg>
			`

			if (previewOnly) return `data:image/svg+xml;base64,${btoa(svgData)}` as const

			const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
			const url = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `${projectName}.svg`
			link.click()

			URL.revokeObjectURL(url)
		} else {
			ctx.save()
			ctx.globalCompositeOperation = 'destination-over'
			ctx.fillStyle = '#FFFFFF'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			const dataURL = canvas.toDataURL(`image/${format}`)

			if (previewOnly) {
				ctx.restore()
				return dataURL
			}

			const link = document.createElement('a')
			link.href = dataURL
			link.download = `${projectName}.${format}`
			link.click()
			ctx.restore()
		}
	}

	return { canvasRef, gridCanvasRef, redo, undo, exportCanvas }
}
