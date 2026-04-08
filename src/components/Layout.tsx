import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#f7f7f8]">
      <Navigation />
      <main className="flex-1 px-10 py-3 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}