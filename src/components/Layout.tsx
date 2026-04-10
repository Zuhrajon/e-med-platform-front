import { Outlet } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Navigation from './navigation/Navigation'
import DoctorNavigation from './navigation/DoctorNavigation'
import AdminNavigation from './navigation/AdminNavigation'

export default function Layout() {
  const { user } = useUser()

  const renderNavigation = () => {
    switch (user.role) {
      case 'doctor':
        return <DoctorNavigation />
      case 'admin':
        return <AdminNavigation />
      case 'patient':
      default:
        return <Navigation />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f8]">
      {renderNavigation()}
      <main className="flex-1 px-10 py-3 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}