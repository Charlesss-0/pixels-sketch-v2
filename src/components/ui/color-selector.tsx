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

			<div className="flex items-center w-full p-1 border rounded-md border-neutral-600 bg-dark-900">
				<div className="flex items-center flex-1 w-full">
					<input
						type="color"
						value={`#${fillStyle}`}
						className="cursor-pointer focus:outline-none"
						onChange={e => setFillStyle(e.target.value.slice(1))}
					/>

					<input
						type="text"
						maxLength={6}
						value={fillStyle.toUpperCase()}
						className="flex-1 w-full text-sm font-medium text-center bg-transparent border-white outline-none"
						onChange={e => setFillStyle(e.target.value.replace(/[^a-fA-F0-9]/g, ''))}
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
