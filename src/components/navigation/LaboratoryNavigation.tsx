import { FlaskConical, LogOut, UserRound } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/react.svg'
import { useUser } from '../../context/UserContext'

const linkBase =
  'flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-[14px] font-medium transition'

export default function LaboratoryNavigation() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-12 w-12 rounded-2xl bg-sky-50 object-cover p-2.5" />
          <div>
            <h2 className="text-[20px] font-semibold text-slate-900">MedSystem</h2>
            <p className="mt-1 text-[14px] text-slate-500">Лаборатория</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-5">
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/laboratory"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-900 hover:bg-slate-100'}`
            }
          >
            <FlaskConical className="h-5 w-5" />
            <span>Анализы</span>
          </NavLink>

          <NavLink
            to="/laboratory/profile"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-900 hover:bg-slate-100'}`
            }
          >
            <UserRound className="h-5 w-5" />
            <span>Профиль</span>
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-slate-200 px-5 py-5">
        <div className="rounded-3xl bg-slate-50 px-4 py-3.5">
          <p className="text-[16px] font-medium text-slate-900">
            {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Сотрудник лаборатории'}
          </p>
          <p className="mt-1 text-[13px] text-sky-700">{user.email}</p>
        </div>

        <button
          onClick={() => void handleLogout()}
          className="mt-3 inline-flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-left text-[14px] font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  )
}
