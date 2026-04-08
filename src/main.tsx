import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from '../src/context/UserContext.tsx'
import { AppointmentsProvider } from '../src/context/AppointmentsContext.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <UserProvider>
      <AppointmentsProvider>
        <App />
      </AppointmentsProvider>
    </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
