export default function applyTransformations(
	canvas: HTMLCanvasElement,
	context: CanvasRenderingContext2D,
	scale: number,
	offset: { x: number; y: number }
): void {
	context.setTransform(scale, 0, 0, scale, offset.x, offset.y)
	context.clearRect(
		-offset.x / scale,
		-offset.y / scale,
		canvas.width / scale,
		canvas.height / scale
	)
}
