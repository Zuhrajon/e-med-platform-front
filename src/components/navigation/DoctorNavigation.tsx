import {
  CalendarDays,
  House,
  LogOut,
  NotebookPen,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/react.svg'
import { useUser } from '../../context/UserContext'

function DoctorNavigation() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const linkBase =
    'flex items-center gap-3 rounded-2xl px-5 py-3 text-left text-[14px] transition'

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col justify-between border-r border-gray-200 bg-white">
      <div>
        <div className="border-b border-gray-200 px-8 py-8">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="logo"
              className="h-16 w-16 rounded-2xl bg-sky-50 object-cover p-3"
            />
            <div>
              <h2 className="text-[20px] font-semibold text-slate-900">MedSystem</h2>
              <h4 className="mt-1 text-[15px] font-normal text-gray-500">Доктор</h4>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/doctor"
              end
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 font-semibold text-white'
                    : 'text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <House className="h-5 w-5" />
              <span>Главная</span>
            </NavLink>

            <NavLink
              to="/doctor/schedule"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 font-semibold text-white'
                    : 'text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <CalendarDays className="h-5 w-5" />
              <span>Расписание</span>
            </NavLink>

            <NavLink
              to="/doctor/appointments"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 font-semibold text-white'
                    : 'text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <NotebookPen className="h-5 w-5" />
              <span>Приёмы</span>
            </NavLink>

            <NavLink
              to="/doctor/patients"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 font-semibold text-white'
                    : 'text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <UsersRound className="h-5 w-5" />
              <span>Пациенты</span>
            </NavLink>

            <NavLink
              to="/doctor/profile"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 font-semibold text-white'
                    : 'text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <UserRound className="h-5 w-5" />
              <span>Профиль</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-7">
        <div className="rounded-3xl bg-slate-50 px-5 py-4">
          <h3 className="text-[17px] font-medium text-slate-900">
            {user.firstName} {user.lastName}
          </h3>
          <h4 className="text-[14px] text-sky-600">{user.email}</h4>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 inline-flex w-full items-center gap-2 rounded-2xl px-5 py-3 text-left text-[14px] font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  )
}

export default DoctorNavigation
