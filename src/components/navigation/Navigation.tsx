import logo from '../../assets/react.svg'
import house from '../../assets/card-svg/house.svg'
import exit from '../../assets/card-svg/exit.svg'
import { useUser } from '../../context/UserContext'
import { NavLink, useNavigate } from 'react-router-dom'



function Navigation() {

  const navigate = useNavigate()
  const { user } = useUser()

  function handleLogout() {
    navigate('/')
  }

  const linkBase =
    'flex items-center gap-2 rounded-2xl px-6 py-2 text-left transition'

  return (
    <aside className="sticky top-0 h-screen w-70 shrink-0 border-r border-gray-200 bg-white flex flex-col justify-between">
      <div>
        <div className="px-8 py-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="logo"
              className="h-16 w-16 rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-[20px] font-semibold text-slate-900">
                MedSystem
              </h2>
              <h4 className="mt-1 text-[16px] font-normal text-gray-500">
                Пациент
              </h4>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/app"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <img src={house} alt="" className="h-6 w-6" />
              <span className="text-[15px] font-semibold">Главная</span>
            </NavLink>

            <NavLink
              to="/app/doctors"
              className={({ isActive }) =>
                `${linkBase} ${isActive
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <svg fill="#000000" width="24px" height="24px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">

                <g id="SVGRepo_bgCarrier" stroke-width="0" />

                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                <g id="SVGRepo_iconCarrier">

                  <path d="M 38.7232 28.5490 C 43.1399 28.5490 46.9403 24.6047 46.9403 19.4690 C 46.9403 14.3949 43.1193 10.6356 38.7232 10.6356 C 34.3271 10.6356 30.5061 14.4771 30.5061 19.5101 C 30.5061 24.6047 34.3066 28.5490 38.7232 28.5490 Z M 15.0784 29.0215 C 18.8994 29.0215 22.2274 25.5703 22.2274 21.1125 C 22.2274 16.6958 18.8789 13.4294 15.0784 13.4294 C 11.2575 13.4294 7.8885 16.7779 7.9090 21.1536 C 7.9090 25.5703 11.2370 29.0215 15.0784 29.0215 Z M 3.6155 47.5717 L 19.2281 47.5717 C 17.0917 44.4697 19.7006 38.2247 24.1173 34.8146 C 21.8371 33.2944 18.8994 32.1645 15.0579 32.1645 C 5.7931 32.1645 0 39.0053 0 44.6957 C 0 46.5445 1.0271 47.5717 3.6155 47.5717 Z M 25.8018 47.5717 L 51.6241 47.5717 C 54.8493 47.5717 56 46.6472 56 44.8395 C 56 39.5394 49.3644 32.2261 38.7026 32.2261 C 28.0616 32.2261 21.4262 39.5394 21.4262 44.8395 C 21.4262 46.6472 22.5766 47.5717 25.8018 47.5717 Z" />

                </g>

              </svg>
              <span className="text-[15px] font-medium">Врачи</span>
            </NavLink>

            <NavLink
              to="/app/appointments"
              className={({ isActive }) =>
                `${linkBase} ${isActive
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <svg width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#5689cd" transform="matrix(1, 0, 0, 1, 0, 0)">
                <g id="SVGRepo_bgCarrier" stroke-width="0" />
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                <g id="SVGRepo_iconCarrier"> <path d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g>
              </svg>
              <span className="text-[15px] font-medium">Мои записи</span>
            </NavLink>

            <NavLink
              to="/app/medical-book"
              className={({ isActive }) =>
                `${linkBase} ${isActive
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <svg width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
                <g id="SVGRepo_bgCarrier" stroke-width="0" />
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                <g id="SVGRepo_iconCarrier"> <path stroke="#000000" stroke-linejoin="round" stroke-width="2" d="M6 5a2 2 0 012-2h16a2 2 0 012 2v22a2 2 0 01-2 2H8a2 2 0 01-2-2V5z" /> <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9h4M10 16h12M10 20h12M10 24h4" /> <circle cx="22" cy="9" r="1" fill="#000000" /> </g>
              </svg>
              <span className="text-[15px] font-medium">Медкнижка</span>
            </NavLink>

            <NavLink
              to="/app/profile"
              className={({ isActive }) =>
                `${linkBase} ${isActive
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <svg width="24px" height="24px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none">
                <g id="SVGRepo_bgCarrier" stroke-width="0" />
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  <circle cx="32" cy="18.14" r="11.14" />
                  <path d="M54.55,56.85A22.55,22.55,0,0,0,32,34.3h0A22.55,22.55,0,0,0,9.45,56.85Z" />
                </g>
              </svg>
              <span className="text-[15px] font-medium">Профиль</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pl-7 pr-5 py-7">
        <div className="mb-5 px-5">
          <h3 className="text-[18px] font-medium text-slate-900">{user.firstName} {user.lastName}</h3>
          <h4 className="text-[14px] text-sky-600">{user.email}</h4>
        </div>

        <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-2xl px-5 py-2 text-left text-slate-900 transition hover:bg-sky-700 hover:text-white">
          <img src={exit} alt="" className="h-6 w-6" />
          <span className="text-[15px] font-semibold">Выйти</span>
        </button>
      </div>
    </aside>
  )
}

export default Navigation

