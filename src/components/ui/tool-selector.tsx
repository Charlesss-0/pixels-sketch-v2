import { Eraser, PaintBucket, Pen } from '@/components/icons'

import { Button } from './button'
import { useAppStore } from '@/stores'
import { useMemo } from 'react'

export default function ToolSelector(): React.ReactNode {
	const { penTool, setPenTool } = useAppStore()
	const toolIcons = useMemo(
		() =>
			({
				pen: <Pen />,
				'paint-bucket': <PaintBucket />,
				eraser: <Eraser />,
			}) as const,
		[]
	)
	const toolNames = useMemo(() => ['pen', 'paint-bucket', 'eraser'] as const, [])

	return (
		<div className="flex flex-col gap-4 p-5">
			<span>Pen Tool</span>

			<div className="flex items-center justify-between gap-3">
				{toolNames.map((toolName, index) => (
					<Button
						key={index}
						variant="ghost"
						size="icon"
						className={penTool === toolName ? 'bg-light-900/10' : ''}
						onClick={() => setPenTool(toolName)}
					>
						{toolIcons[toolName]}
					</Button>
				))}
			</div>
		</div>
	)
}
