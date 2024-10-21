import { Canvas, Sidebar } from '@/components/layout'

export default function Home(): React.ReactNode {
	return (
		<div className="relative flex items-center justify-center h-screen overflow-hidden bg-dark-900">
			<Sidebar />
			<Canvas />
		</div>
	)
}
