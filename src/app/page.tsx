import dynamic from 'next/dynamic'

const Sidebar = dynamic(() => import('@/components/layout/sidebar'), { ssr: false })
const Canvas = dynamic(() => import('@/components/layout/canvas'), { ssr: false })

export default function Home(): React.ReactNode {
	return (
		<div className="relative flex items-center justify-center h-screen overflow-hidden bg-dark-900">
			<Sidebar />
			<Canvas />
		</div>
	)
}
