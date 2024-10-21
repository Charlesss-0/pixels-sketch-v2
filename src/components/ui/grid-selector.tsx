export default function GridSelector(): React.ReactNode {
	return (
		<div className="flex flex-col gap-4 p-5">
			<span>Grid Density</span>

			<div className="flex items-center w-full">
				<input
					type="range"
					defaultValue={16}
					min={16}
					max={100}
					className="w-full rounded-full appearance-none cursor-pointer focus:outline-none"
				/>
			</div>
		</div>
	)
}
