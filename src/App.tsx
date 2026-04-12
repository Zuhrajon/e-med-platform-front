import './App.css'
import Layout from './components/Layout'
import AppointmentsPage from './routes/patient/AppointmentsPage'
import DoctorsPage from './routes/patient/DoctorsPage'
import HomePage from './routes/patient/HomePage'
import { Routes, Route } from 'react-router-dom'
import MedicalBookPage from './routes/patient/MedicalBookPage'
import ProfilePage from './routes/patient/ProfilePage'
import DoctorDetailsPage from './routes/patient/DoctorDetailsPage'
import LoginPage from './routes/auth/LoginPage'
import RegisterPage from './routes/auth/RegisterPage'
import DoctorHomePage from './routes/doctor/DoctorHomePage'
import DoctorAppointmentsPage from './routes/doctor/DoctorAppointmentsPage'
import DoctorSchedulePage from './routes/doctor/DoctorSchedulePage'
import DoctorProfilePage from './routes/doctor/DoctorProfilePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<Layout />}>
        {/* patient */}
        <Route path="/app" element={<HomePage />} />
        <Route path="/app/doctors" element={<DoctorsPage />} />
        <Route path="/app/doctors/:id" element={<DoctorDetailsPage />} />
        <Route path="/app/appointments" element={<AppointmentsPage />} />
        <Route path="/app/medical-book" element={<MedicalBookPage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/doctor" element={<Layout />}>
        <Route index element={<DoctorHomePage />} />
        <Route path="appointments" element={<DoctorAppointmentsPage />} />
        <Route path="schedule" element={<DoctorSchedulePage />} />
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />
      </Route>

      {/* doctor <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
        <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />

         admin 
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
        <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} /> */}

    </Routes>
  )
}

export default App