import { useState } from 'react'

export default function GridSelector(): React.ReactNode {
	const [rangeValue, setRangeValue] = useState<number>(16)

	const getThumbPos = (value: number): number => {
		const min = 16
		const max = 100
		const percent = Math.floor(((value - min) / (max - min)) * 100)

		const thumbOffset = 5
		const rangeWidth = 100
		const offset = (thumbOffset / rangeWidth) * 100

		return Math.min(100 - offset, Math.max(offset, percent))
	}

	return (
		<div className="flex flex-col gap-4 p-5">
			<span>Grid Density</span>

			<div className="flex flex-col gap-2 items-center w-full relative mt-5">
				<span
					className="font-medium text-sm transition-transform absolute -top-7"
					style={{ left: `calc(${getThumbPos(rangeValue)}% - 10px)` }}
				>
					{rangeValue}
				</span>

				<input
					type="range"
					value={rangeValue}
					min={16}
					max={100}
					className="w-full rounded-full appearance-none cursor-pointer focus:outline-none"
					onChange={({ target: { value } }) => setRangeValue(Number(value))}
				/>
			</div>
		</div>
	)
}
