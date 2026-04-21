import {
  CalendarDays,
  Database,
  LayoutGrid,
  LogOut,
  UserRound,
  Users,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/react.svg'
import { useUser } from '../../context/UserContext'

const linkBase =
  'flex items-center gap-3 rounded-2xl px-5 py-3 text-left text-[15px] font-medium transition'

export default function AdminNavigation() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  const navItems = [
    { to: '/admin', end: true, label: 'Панель', icon: LayoutGrid },
    { to: '/admin/appointments', label: 'Календарь', icon: CalendarDays },
    { to: '/admin/fake-data', label: 'Тестовые данные', icon: Database },
    { to: '/admin/users', label: 'Сотрудники', icon: Users },
    { to: '/admin/profile', label: 'Профиль', icon: UserRound },
  ]

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const userLabel = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Администратор'

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
              <p className="mt-1 text-[15px] text-slate-500">Администратор</p>
            </div>
          </div>
        </div>

        <nav className="px-6 py-6">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${linkBase} ${
                      isActive
                        ? 'bg-sky-700 text-white shadow-sm'
                        : 'text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </nav>
      </div>

      <div className="border-t border-slate-200 px-6 py-7">
        <div className="rounded-3xl bg-slate-50 px-5 py-4">
          <p className="text-[17px] font-medium text-slate-900">{userLabel}</p>
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
