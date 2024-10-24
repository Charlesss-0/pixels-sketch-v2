import { useEffect, useRef, useState } from 'react'

import { useCanvasStore } from '@/stores'

export default function useCanvas(
	isGridEnabled: boolean,
	gridSize: number,
	fillStyle: string
): {
	canvasRef: React.RefObject<HTMLCanvasElement>
	gridCanvasRef: React.RefObject<HTMLCanvasElement>
} {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const gridCanvasRef = useRef<HTMLCanvasElement>(null)
	const [isDrawing, setIsDrawing] = useState<boolean>(false)
	const { actions, addAction, clearActions } = useCanvasStore()
	const prevGridSize = useRef<number>(gridSize)

	useEffect(() => {
		const canvas = canvasRef.current
		const gridCanvas = gridCanvasRef.current
		if (!canvas || !gridCanvas) return

		const drawContext = canvas.getContext('2d')
		const gridContext = gridCanvas.getContext('2d')

		if (!drawContext || !gridContext) return

		const pixelSize = 800 / gridSize

		actions.forEach(action => {
			drawContext.fillStyle = action.color
			drawContext.fillRect(action.x, action.y, action.size, action.size)
		})

		const drawGrid = (): void => {
			gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height)
			if (!isGridEnabled) return

			for (let x = 0; x < gridCanvas.width; x += pixelSize) {
				for (let y = 0; y < gridCanvas.height; y += pixelSize) {
					gridContext.strokeStyle = '#dddddd'
					gridContext.strokeRect(x, y, pixelSize, pixelSize)
				}
			}
		}
		drawGrid()

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
			const action = { x, y, size: pixelSize, color: `#${fillStyle}` }

			drawContext.fillStyle = action.color
			drawContext.fillRect(action.x, action.y, action.size, action.size)
			addAction(action)
		}

		const handleMouseMove = (e: MouseEvent): void => {
			if (!isDrawing) return
			const { x, y } = getMousePos(e)
			const action = { x, y, size: pixelSize, color: `#${fillStyle}` }

			drawContext.fillStyle = action.color
			drawContext.fillRect(action.x, action.y, action.size, action.size)
			addAction(action)
		}

		const handleMouseUp = (): void => setIsDrawing(false)

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
	}, [isDrawing, isGridEnabled, fillStyle, gridSize, actions, addAction, clearActions])

	return { canvasRef, gridCanvasRef }
}
