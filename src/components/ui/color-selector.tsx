import { Button } from './button'
import { twMerge } from '@/utils/tw-merge'
import { useAppStore } from '@/stores'
import { useMemo } from 'react'

export default function ColorSelector(): React.ReactNode {
	const { fillStyle, setFillStyle } = useAppStore()
	const presetColors = useMemo(() => ['f1dca7', '2a6f97', 'fde2e4'] as const, [])

	return (
		<div className="flex flex-col gap-4 p-5">
			<span>Color</span>

			<div className="flex items-center w-full border rounded-md border-neutral-600 bg-dark-900 p-1">
				<div className="flex items-center w-full flex-1">
					<input
						type="color"
						value={`#${fillStyle}`}
						className="cursor-pointer focus:outline-none"
						onChange={e => setFillStyle(e.target.value)}
					/>

					<input
						type="text"
						maxLength={6}
						value={fillStyle.toUpperCase()}
						className="text-sm font-medium w-full bg-transparent outline-none  border-white flex-1 text-center"
						onChange={e => setFillStyle(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex justify-between">
				{presetColors.map(preset => (
					<Button
						key={preset}
						className={twMerge(
							'h-9 w-9 rounded-md hover:opacity-80 transition-all duration-200',
							fillStyle === preset && 'ring-2 ring-light-900'
						)}
						style={{ backgroundColor: `#${preset}` }}
						onClick={() => setFillStyle(preset)}
					/>
				))}
			</div>
		</div>
	)
}
