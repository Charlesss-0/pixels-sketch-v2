import { useAppStore, useCanvasStore } from '@/stores'
import { useCallback, useEffect, useRef, useState } from 'react'

import { applyTransformations } from '@/utils'
import useExport from './use-export'
import useGrid from './use-grid'

export default function useCanvas(gridSize: number): {
	canvasRef: React.RefObject<HTMLCanvasElement>
	gridCanvasRef: React.RefObject<HTMLCanvasElement>
	redo: () => void
	undo: () => void
	exportCanvas: (format: 'png' | 'jpeg' | 'svg', previewOnly?: boolean) => string | void
} {
	const { penTool, fillStyle, isGridEnabled } = useAppStore()
	const { actions, addAction, clearActions, undo, redo } = useCanvasStore()

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const gridCanvasRef = useRef<HTMLCanvasElement>(null)
	const panStart = useRef<{ x: number; y: number } | null>(null)
	const drawingActions = useRef<Array<{ x: number; y: number; size: number; color: string }>>([])

	const [isDrawing, setIsDrawing] = useState<boolean>(false)
	const [isPanning, setIsPanning] = useState(false)
	const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false)
	const [scale, setScale] = useState<number>(1)
	const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

	const { pixelSize } = useGrid(gridCanvasRef, scale, offset)
	const { exportCanvas } = useExport(canvasRef, actions)

	const MIN_SCALE = 0.5
	const MAX_SCALE = 5
	const SCALE_STEP = 0.1
	const PAN_SPEED = 2

	const drawActions = useCallback(
		(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
			context.resetTransform()
			context.clearRect(0, 0, canvas.width, canvas.height)

			applyTransformations(canvas, context, scale, offset)

			actions.forEach(action => {
				action.forEach(stroke => {
					if (stroke.color === 'transparent') {
						context.clearRect(stroke.x, stroke.y, stroke.size, stroke.size)
						return
					}

					context.fillStyle = stroke.color
					context.fillRect(stroke.x, stroke.y, stroke.size, stroke.size)
				})
			})

			context.restore()
		},
		[actions, scale, offset]
	)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const context = canvas.getContext('2d')
		if (!context) return

		drawActions(canvas, context)

		const getMousePos = (e: MouseEvent): { x: number; y: number } => {
			const rect = canvas.getBoundingClientRect()

			const x = Math.floor((e.clientX - rect.left - offset.x) / scale / pixelSize) * pixelSize
			const y = Math.floor((e.clientY - rect.top - offset.y) / scale / pixelSize) * pixelSize

			return { x, y }
		}

		const handleMouseDown = (e: MouseEvent): void => {
			if (!isSpacePressed) {
				setIsDrawing(true)
				const { x, y } = getMousePos(e)

				if (penTool === 'paint-bucket') {
					const bucketAction = { x: 0, y: 0, size: canvas.width, color: `#${fillStyle}` }

					context.fillStyle = `#${fillStyle}`
					context.fillRect(0, 0, canvas.width, canvas.height)

					addAction([bucketAction])
				} else if (penTool === 'eraser') {
					const eraseAction = { x, y, size: pixelSize, color: 'transparent' }

					context.clearRect(eraseAction.x, eraseAction.y, eraseAction.size, eraseAction.size)

					drawingActions.current.push(eraseAction)
				} else {
					const drawAction = { x, y, size: pixelSize, color: `#${fillStyle}` }

					context.fillStyle = drawAction.color
					context.fillRect(drawAction.x, drawAction.y, drawAction.size, drawAction.size)

					drawingActions.current.push(drawAction)
				}
			}
		}

		const handleMouseMove = (e: MouseEvent): void => {
			if (isDrawing) {
				const { x, y } = getMousePos(e)

				if (penTool === 'eraser') {
					const eraseAction = { x, y, size: pixelSize, color: 'transparent' }

					context.clearRect(eraseAction.x, eraseAction.y, eraseAction.size, eraseAction.size)

					drawingActions.current.push(eraseAction)
				} else {
					const drawAction = { x, y, size: pixelSize, color: `#${fillStyle}` }

					context.fillStyle = drawAction.color
					context.fillRect(drawAction.x, drawAction.y, drawAction.size, drawAction.size)

					drawingActions.current.push(drawAction)
				}
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
	}, [
		isDrawing,
		isGridEnabled,
		fillStyle,
		gridSize,
		actions,
		addAction,
		clearActions,
		penTool,
		pixelSize,
		isSpacePressed,
		offset,
		scale,
		drawActions,
	])

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const handleWheel = (e: WheelEvent): void => {
			e.preventDefault()
			const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
			setScale(prev => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta)))
		}

		const handleKeyDown = (e: KeyboardEvent): void => {
			if (e.code === 'Space') setIsSpacePressed(true)
		}

		const handleKeyUp = (e: KeyboardEvent): void => {
			if (e.code === 'Space') setIsSpacePressed(false)
		}

		const handlePanStart = (e: MouseEvent): void => {
			if (isSpacePressed && e.button === 0) {
				// start panning if space + left click
				setIsPanning(true)
				setIsDrawing(false)
				panStart.current = { x: e.clientX, y: e.clientY }
			}
		}

		const handlePanMove = (e: MouseEvent): void => {
			if (isPanning && panStart.current) {
				const deltaX = ((e.clientX - panStart.current.x) / scale) * PAN_SPEED
				const deltaY = ((e.clientY - panStart.current.y) / scale) * PAN_SPEED

				setOffset(prev => ({
					x: Math.min(Math.max(prev.x + deltaX, -canvas.width * (scale - 1)), 0),
					y: Math.min(Math.max(prev.y + deltaY, -canvas.height * (scale - 1)), 0),
				}))

				panStart.current = { x: e.clientX, y: e.clientY }
			}
		}

		const handleMouseUp = (): void => {
			setIsPanning(false)
			panStart.current = null
		}

		canvas.addEventListener('wheel', handleWheel)
		canvas.addEventListener('mousedown', handlePanStart)
		canvas.addEventListener('mousemove', handlePanMove)
		canvas.addEventListener('mouseup', handleMouseUp)
		canvas.addEventListener('mouseleave', handleMouseUp)
		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return (): void => {
			canvas.removeEventListener('wheel', handleWheel)
			canvas.removeEventListener('mousedown', handlePanStart)
			canvas.removeEventListener('mousemove', handlePanMove)
			canvas.removeEventListener('mouseup', handleMouseUp)
			canvas.removeEventListener('mouseleave', handleMouseUp)
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [canvasRef, scale, isPanning, isSpacePressed])

	return { canvasRef, gridCanvasRef, redo, undo, exportCanvas }
}
