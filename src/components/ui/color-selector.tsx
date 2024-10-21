import { Button } from './button'
import { useMemo } from 'react'

export default function ColorSelector({
	color,
	setColor,
}: {
	color: string
	setColor: (color: string) => void
}): React.ReactNode {
	const presetColors = useMemo(() => ['F1DCA7', '2A6F97', 'FDE2E4'], [])

	return (
		<div className="flex flex-col gap-4 p-5">
			<span>Color</span>

			<div className="flex items-center gap-3 w-full border rounded-[5px] border-neutral-600 bg-dark-900 select-text h-[30px]">
				<div className="flex items-center w-full gap-3 p-1">
					<input
						type="color"
						defaultValue={`#${color}`}
						value={`#${color}`}
						className="cursor-pointer focus:outline-none"
						onChange={e => setColor(e.target.value)}
					/>

					<span className="text-sm font-medium">{color.toUpperCase()}</span>
				</div>

				<div className="flex items-center justify-center h-full p-1 px-3 border-l border-neutral-600">
					<span className="font-medium text-small text-light-800">100%</span>
				</div>
			</div>

			<div className="flex justify-between">
				{presetColors.map(preset => (
					<Button
						key={preset}
						className="h-[35px] w-[35px] rounded-[5px] border-2 border-neutral-600"
						style={{ backgroundColor: `#${preset}` }}
						onClick={() => setColor(preset)}
					/>
				))}
			</div>
		</div>
	)
}
