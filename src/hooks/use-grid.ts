import { useAppStore, useCanvasStore } from '@/stores'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { applyTransformations } from '@/utils'
import useDebounce from './use-debounce'

export default function useGrid(
	gridCanvasRef: React.RefObject<HTMLCanvasElement>,
	scale: number,
	offset: { x: number; y: number }
): {
	pixelSize: number
} {
	const { gridSize, isGridEnabled } = useAppStore()
	const { clearActions } = useCanvasStore()

	const debouncedGridSize = useDebounce(gridSize, 500)

	const prevGridSize = useRef<number>(debouncedGridSize)
	const pixelSize = useMemo(() => 800 / debouncedGridSize, [debouncedGridSize])

	const drawGrid = useCallback(
		(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void => {
			context.resetTransform()
			context.clearRect(0, 0, canvas.width, canvas.height)

			if (!isGridEnabled) return

			applyTransformations(canvas, context, scale, offset)

			for (let x = 0; x < canvas.width; x += pixelSize) {
				for (let y = 0; y < canvas.height; y += pixelSize) {
					context.strokeStyle = '#dddddd'
					context.strokeRect(x, y, pixelSize, pixelSize)
				}
			}

			context.restore()
		},
		[isGridEnabled, pixelSize, scale, offset]
	)

	useEffect(() => {
		const canvas = gridCanvasRef.current
		if (!canvas) return

		const context = canvas.getContext('2d')

		if (!context) return

		drawGrid(canvas, context)

		if (prevGridSize.current !== debouncedGridSize) {
			context.clearRect(0, 0, canvas.width, canvas.height)
			prevGridSize.current = debouncedGridSize
			drawGrid(canvas, context)
			clearActions()
		}
	}, [isGridEnabled, debouncedGridSize, gridCanvasRef, pixelSize, clearActions, drawGrid])

	return { pixelSize }
}
