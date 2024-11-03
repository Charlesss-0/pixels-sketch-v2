import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DrawingActions = {
	x: number
	y: number
	size: number
	color: string
}

type State = {
	actions: DrawingActions[][]
	redoStack: DrawingActions[][]
}

type Action = {
	addAction: (action: DrawingActions[]) => void
	undo: () => void
	redo: () => void
	clearActions: () => void
}

type CanvasState = State & Action

const useCanvasStore = create(
	persist<CanvasState>(
		(set, get) => ({
			redoStack: [],

			actions: [],
			addAction: (stroke): void => {
				set(state => ({
					actions: [...state.actions, stroke],
					redoStack: [],
				}))
			},

			undo: (): void => {
				const { actions, redoStack } = get()
				if (actions.length === 0) return

				const newActions = [...actions]
				const lastAction = newActions.pop()

				if (lastAction) {
					set({ actions: newActions, redoStack: [...redoStack, lastAction] })
				}
			},
			redo: (): void => {
				const { actions, redoStack } = get()
				if (redoStack.length === 0) return

				const newRedoStack = [...redoStack]
				const redoAction = newRedoStack.pop()

				if (redoAction) {
					set({ actions: [...actions, redoAction], redoStack: newRedoStack })
				}
			},

			clearActions: (): void => set({ actions: [] }),
		}),
		{ name: 'canvas-store' }
	)
)

export default useCanvasStore
