'use client'

import { Eraser, PaintBucket, Pen, SidebarToggle } from '@/app/icons'

function Divider(): React.ReactNode {
	return <div className="w-full border-b border-neutral-600" />
}

export default function Sidebar(): React.ReactNode {
	const colorValue = 'efefef' as const

	return (
		<aside className="absolute flex flex-col justify-between text-sm font-semibold border rounded-lg select-none w-52 bg-dark-800 top-3 left-3 bottom-3 border-neutral-600 text-light-900">
			<div>
				<div className="flex items-center justify-between p-5">
					<p>Untitled</p>
					<SidebarToggle />
				</div>

				<Divider />

				<div className="flex flex-col gap-4 p-5">
					<p>Pen</p>

					<div className="flex items-center justify-between gap-3">
						<Pen />
						<PaintBucket />
						<Eraser />
					</div>
				</div>

				<Divider />

				<div className="flex flex-col gap-4 p-5">
					<p>Grid Density</p>

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

				<Divider />

				<div className="flex flex-col gap-4 p-5">
					<p>Color</p>

					<div className="flex items-center gap-3 w-full border rounded-[5px] border-neutral-600 bg-dark-900 select-text h-[30px]">
						<div className="flex items-center w-full gap-3 p-1">
							<input
								type="color"
								defaultValue="#efefef"
								className="cursor-pointer focus:outline-none"
							/>

							<span className="text-sm font-medium">{colorValue.toUpperCase()}</span>
						</div>

						<div className="flex items-center justify-center h-full p-1 px-3 border-l border-neutral-600">
							<span className="font-medium text-small text-light-800">100%</span>
						</div>
					</div>

					<div className="flex justify-between">
						<div className="h-[35px] w-[35px] rounded-[5px] border-2 border-neutral-600 bg-[#F1DCA7]" />
						<div className="h-[35px] w-[35px] rounded-[5px] border-2 border-neutral-600 bg-[#2A6F97]" />
						<div className="h-[35px] w-[35px] rounded-[5px] border-2 border-neutral-600 bg-[#FDE2E4]" />
					</div>
				</div>

				<Divider />
			</div>

			<div className="w-full p-5">
				<div className="flex items-center justify-center bg-dark-900 border border-neutral-600 h-[36px] w-full rounded-[5px]">
					<span>Export</span>
				</div>
			</div>
		</aside>
	)
}
