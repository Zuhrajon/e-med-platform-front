import { Outlet } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Navigation from './navigation/Navigation'
import DoctorNavigation from './navigation/DoctorNavigation'
import AdminNavigation from './navigation/AdminNavigation'
import ReceptionNavigation from './navigation/ReceptionNavigation'
import LaboratoryNavigation from './navigation/LaboratoryNavigation'

export default function Layout() {
  const { user } = useUser()

  const renderNavigation = () => {
    switch (user.role) {
      case 'doctor':
        return <DoctorNavigation />
      case 'admin':
        return <AdminNavigation />
      case 'receptionist':
        return <ReceptionNavigation />
      case 'laboratory':
        return <LaboratoryNavigation />
      case 'patient':
      default:
        return <Navigation />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f8]">
      {renderNavigation()}
      <main className="flex-1 overflow-x-hidden px-10 py-3">
        <Outlet />
      </main>
    </div>
  )
}



// import { Outlet } from 'react-router-dom'
// import { useUser } from '../context/UserContext'
// import Navigation from './navigation/Navigation'
// import DoctorNavigation from './navigation/DoctorNavigation'
// import AdminNavigation from './navigation/AdminNavigation'

// export default function Layout() {
//   const { user } = useUser()

//   console.log('USER OBJECT:', user)
//   console.log('USER ROLE:', user.role)

//   return (
//     <div className="flex min-h-screen bg-[#f7f7f8]">
//       <div className="fixed right-4 top-4 z-50 rounded bg-red-500 px-3 py-2 text-white">
//         role: {user.role}
//       </div>

//       {user.role === 'doctor' ? (
//         <DoctorNavigation />
//       ) : user.role === 'admin' ? (
//         <AdminNavigation />
//       ) : (
//         <Navigation />
//       )}

//       <main className="flex-1 overflow-x-hidden px-10 py-3">
//         <Outlet />
//       </main>
//     </div>
//   )
// }
