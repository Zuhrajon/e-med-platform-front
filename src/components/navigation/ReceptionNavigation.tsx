import { LogOut, NotebookPen, UserRound, UsersRound } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/react.svg'
import { useUser } from '../../context/UserContext'

const linkBase =
  'flex items-center gap-3 rounded-2xl px-5 py-3 text-left text-[15px] font-medium transition'

export default function ReceptionNavigation() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col justify-between border-r border-slate-200 bg-white">
      <div>
        <div className="border-b border-slate-200 px-8 py-8">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="logo"
              className="h-16 w-16 rounded-2xl bg-sky-50 object-cover p-3"
            />
            <div>
              <h2 className="text-[20px] font-semibold text-slate-900">MedSystem</h2>
              <p className="mt-1 text-[15px] text-slate-500">Ресепшен</p>
            </div>
          </div>
        </div>

        <nav className="px-6 py-6">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/reception/visits"
              end
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <NotebookPen className="h-5 w-5" />
              <span>Записи</span>
            </NavLink>

            <NavLink
              to="/reception/profile"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <UserRound className="h-5 w-5" />
              <span>Профиль</span>
            </NavLink>

            <NavLink
              to="/reception/patients"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <UsersRound className="h-5 w-5" />
              <span>Пациенты</span>
            </NavLink>
          </div>
        </nav>
      </div>

      <div className="border-t border-slate-200 px-6 py-7">
        <div className="rounded-3xl bg-slate-50 px-5 py-4">
          <p className="text-[17px] font-medium text-slate-900">
            {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Сотрудник ресепшена'}
          </p>
          <p className="mt-1 text-sm text-sky-700">{user.email}</p>
        </div>

        <button
          onClick={() => void handleLogout()}
          className="mt-4 inline-flex w-full items-center gap-2 rounded-2xl px-5 py-3 text-left font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          <LogOut className="h-5 w-5" />
          Выйти
        </button>
      </div>
    </aside>
  )
}
