import { create } from 'zustand'

type AppStore = {
	isSidebarOpen: boolean
	setIsSidebarOpen: (isSidebarOpen: boolean) => void
}

const useAppStore = create<AppStore>(set => ({
	isSidebarOpen: false,
	setIsSidebarOpen: (isSidebarOpen): void => set({ isSidebarOpen }),
}))

export default useAppStore
