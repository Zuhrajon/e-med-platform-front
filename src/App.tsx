import './App.css'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import { useUser } from './context/UserContext'

import LoginPage from './routes/auth/LoginPage'
import RegisterPage from './routes/auth/RegisterPage'

import HomePage from './routes/patient/HomePage'
import DoctorsPage from './routes/patient/DoctorsPage'
import DoctorDetailsPage from './routes/patient/DoctorDetailsPage'
import AppointmentsPage from './routes/patient/AppointmentsPage'
import MedicalBookPage from './routes/patient/MedicalBookPage'
import ProfilePage from './routes/patient/ProfilePage'

import DoctorHomePage from './routes/doctor/DoctorHomePage'
import DoctorAppointmentsPage from './routes/doctor/DoctorAppointmentsPage'
import DoctorSchedulePage from './routes/doctor/DoctorSchedulePage'
import DoctorProfilePage from './routes/doctor/DoctorProfilePage'

import AdminHomePage from './routes/admin/AdminHomePage'
import AdminAppointmentsPage from './routes/admin/AdminAppointmentsPage'
import AdminFakeDataPage from './routes/admin/AdminFakeDataPage'
import AdminSettingsPage from './routes/admin/AdminSettingsPage'
import AdminUsersPage from './routes/admin/AdminUsersPage'

function RequireAuth({ roles }: { roles: Array<'patient' | 'doctor' | 'admin'> }) {
  const { isAuthenticated, isBootstrapping, user } = useUser()

  if (isBootstrapping) {
    return <div className="p-8 text-lg text-slate-600">Загрузка...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!roles.includes(user.role)) {
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}

function DefaultRedirect() {
  const { isAuthenticated, user } = useUser()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (user.role === 'doctor') {
    return <Navigate to="/doctor" replace />
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/app" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<RequireAuth roles={['patient']} />}>
        <Route path="/app" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="doctors/:id" element={<DoctorDetailsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="medical-book" element={<MedicalBookPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={['doctor']} />}>
        <Route path="/doctor" element={<Layout />}>
          <Route index element={<DoctorHomePage />} />
          <Route path="appointments" element={<DoctorAppointmentsPage />} />
          <Route path="schedule" element={<DoctorSchedulePage />} />
          <Route path="profile" element={<DoctorProfilePage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={['admin']} />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="appointments" element={<AdminAppointmentsPage />} />
          <Route path="fake-data" element={<AdminFakeDataPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  )
}


// import './App.css'
// import Layout from './components/Layout'
// import AppointmentsPage from './routes/patient/AppointmentsPage'
// import DoctorsPage from './routes/patient/DoctorsPage'
// import HomePage from './routes/patient/HomePage'
// import { Routes, Route } from 'react-router-dom'
// import MedicalBookPage from './routes/patient/MedicalBookPage'
// import ProfilePage from './routes/patient/ProfilePage'
// import DoctorDetailsPage from './routes/patient/DoctorDetailsPage'
// import LoginPage from './routes/auth/LoginPage'
// import RegisterPage from './routes/auth/RegisterPage'
// import DoctorHomePage from './routes/doctor/DoctorHomePage'
// import DoctorAppointmentsPage from './routes/doctor/DoctorAppointmentsPage'
// import DoctorSchedulePage from './routes/doctor/DoctorSchedulePage'
// import DoctorProfilePage from './routes/doctor/DoctorProfilePage'
// import AdminHomePage from './routes/admin/AdminHomePage'

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       <Route element={<Layout />}>
//         {/* patient */}
//         <Route path="/app" element={<HomePage />} />
//         <Route path="/app/doctors" element={<DoctorsPage />} />
//         <Route path="/app/doctors/:id" element={<DoctorDetailsPage />} />
//         <Route path="/app/appointments" element={<AppointmentsPage />} />
//         <Route path="/app/medical-book" element={<MedicalBookPage />} />
//         <Route path="/app/profile" element={<ProfilePage />} />
//       </Route>

//       <Route path="/doctor" element={<Layout />}>
//         <Route index element={<DoctorHomePage />} />
//         <Route path="appointments" element={<DoctorAppointmentsPage />} />
//         <Route path="schedule" element={<DoctorSchedulePage />} />
//         <Route path="/doctor/profile" element={<DoctorProfilePage />} />
//       </Route>

      

//          {/* admin  */}
//          <Route path="/admin" element={<Layout />} />
//          <Route index element={<AdminHomePage/>}/>
//         {/*<Route path="/admin/doctors" element={<AdminDoctorsPage />} />
//         <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
//         <Route path="/admin/profile" element={<AdminProfilePage />} /> */}

//     </Routes>
//   )
// }

// export default App
