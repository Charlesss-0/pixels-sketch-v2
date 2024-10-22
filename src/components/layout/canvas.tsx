'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui'
import { SidebarToggle } from '@/components/icons'
import { useAppStore } from '@/stores'

export default function Canvas(): React.ReactNode {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const { isSidebarOpen, setIsSidebarOpen } = useAppStore()
	const [isDrawing, setIsDrawing] = useState(false)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const pixelSize = 50
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const drawGrid = (): void => {
			for (let x = 0; x < canvas.width; x += pixelSize) {
				for (let y = 0; y < canvas.height; y += pixelSize) {
					ctx.strokeStyle = '#dddddd'
					ctx.strokeRect(x, y, pixelSize, pixelSize)
				}
			}
		}
		drawGrid()

		const getMousePos = (e: MouseEvent): { x: number; y: number } => {
			const rect = canvas.getBoundingClientRect()
			const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize
			const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize

			return { x, y }
		}

		const handleMouseDown = (e: MouseEvent): void => {
			setIsDrawing(true)
			const { x, y } = getMousePos(e)
			ctx.fillStyle = '#000000'
			ctx.fillRect(x, y, pixelSize, pixelSize)
		}

		const handleMouseMove = (e: MouseEvent): void => {
			if (!isDrawing) return
			const { x, y } = getMousePos(e)
			ctx.fillRect(x, y, pixelSize, pixelSize)
		}

		const handleMouseUp = (): void => {
			setIsDrawing(false)
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
	}, [isDrawing])

	return (
		<>
			<Button
				className="absolute top-3 left-3"
				variant="ghost"
				size="icon"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				<SidebarToggle />
			</Button>

			<canvas ref={canvasRef} width={800} height={800} className="bg-white" />
		</>
	)
}
