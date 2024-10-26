import { useAppStore } from '@/stores'

export default function useExport(
	canvasRef: React.RefObject<HTMLCanvasElement>,
	actions: Array<Array<{ x: number; y: number; size: number; color: string }>>
): {
	exportCanvas: (format: 'png' | 'jpeg' | 'svg', previewOnly?: boolean) => string | void
} {
	const { projectName } = useAppStore()

	const exportCanvas = (format: 'png' | 'jpeg' | 'svg', previewOnly = false): string | void => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const getVisibleStrokes = (): Array<{
			x: number
			y: number
			size: number
			color: string
		}> => {
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

	return { exportCanvas }
}
