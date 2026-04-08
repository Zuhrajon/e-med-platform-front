import './App.css'
import Layout from './components/Layout'
import AppointmentsPage from './routes/AppointmentsPage'
import DoctorsPage from './routes/DoctorsPage'
import HomePage from './routes/HomePage'
import { Routes, Route } from 'react-router-dom'
import MedicalBookPage from './routes/MedicalBookPage'
import ProfilePage from './routes/ProfilePage'
import DoctorDetailsPage from './routes/DoctorDetailsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="doctors/:id" element={<DoctorDetailsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="medical-book" element={<MedicalBookPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App