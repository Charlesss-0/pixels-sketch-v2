import { Eraser, PaintBucket, Pen } from '@/components/icons'
import { useMemo, useState } from 'react'

import { Button } from './button'

export default function ToolSelector(): React.ReactNode {
	const [tool, setTool] = useState<'pen' | 'paintBucket' | 'eraser'>('pen')
	const toolIcons = useMemo(
		() =>
			({
				pen: <Pen />,
				paintBucket: <PaintBucket />,
				eraser: <Eraser />,
			}) as const,
		[]
	)
	const toolNames = useMemo(() => ['pen', 'paintBucket', 'eraser'] as const, [])

	return (
		<div className="flex flex-col gap-4 p-5">
			<span>Pen Tool</span>

			<div className="flex items-center justify-between gap-3">
				{toolNames.map((toolName, index) => (
					<Button
						key={index}
						variant="ghost"
						size="icon"
						className={tool === toolName ? 'bg-light-900/10' : ''}
						onClick={() => setTool(toolName)}
					>
						{toolIcons[toolName]}
					</Button>
				))}
			</div>
		</div>
	)
}
