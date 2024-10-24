import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DrawingAction = {
	x: number
	y: number
	size: number
	color: string
}

type CanvasState = {
	actions: DrawingAction[]
	addAction: (action: DrawingAction) => void
	clearActions: () => void
}

const useCanvasStore = create(
	persist<CanvasState>(
		set => ({
			actions: [],
			addAction: (action): void => {
				set(state => ({
					actions: [...state.actions, action],
				}))
			},
			clearActions: (): void => set({ actions: [] }),
		}),
		{ name: 'canvas-store' }
	)
)

export default useCanvasStore
