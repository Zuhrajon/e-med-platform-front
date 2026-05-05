import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from '../src/context/UserContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { DoctorScheduleProvider } from './context/DoctorScheduleContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <DoctorScheduleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DoctorScheduleProvider>
    </UserProvider>
  </StrictMode>,
)
