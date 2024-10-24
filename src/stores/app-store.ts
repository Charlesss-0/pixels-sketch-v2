import { createJSONStorage, persist } from 'zustand/middleware'

import { create } from 'zustand'

type State = {
	isSidebarOpen: boolean
	projectName: string
	penTool: 'pen' | 'paint-bucket' | 'eraser'
	gridSize: number
	fillStyle: string
	isGridEnabled: boolean
}

type Action = {
	setIsSidebarOpen: (isSidebarOpen: boolean) => void
	setProjectName: (projectName: string) => void
	setPenTool: (penTool: State['penTool']) => void
	setGridSize: (gridSize: number) => void
	setFillStyle: (fillStyle: string) => void
	setIsGridEnabled: (isGridEnabled: boolean) => void
}

type AppState = State & Action

const useAppStore = create(
	persist<AppState>(
		set => ({
			isSidebarOpen: false,
			setIsSidebarOpen: (isSidebarOpen: boolean): void => set({ isSidebarOpen }),

			projectName: 'Untitled',
			setProjectName: (projectName: string): void => set({ projectName }),

			penTool: 'pen',
			setPenTool: (penTool: State['penTool']): void => set({ penTool }),

			gridSize: 16,
			setGridSize: (gridSize: number): void => set({ gridSize }),

			fillStyle: '000000',
			setFillStyle: (fillStyle: string): void => set({ fillStyle }),

			isGridEnabled: true,
			setIsGridEnabled: (isGridEnabled: boolean): void => set({ isGridEnabled }),
		}),
		{
			name: 'app-store',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export default useAppStore
