import logo from '../../assets/react.svg'
import exit from '../../assets/card-svg/exit.svg'
import { useUser } from '../../context/UserContext'
import { NavLink, useNavigate } from 'react-router-dom'

function AdminNavigation() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  async function handleLogout() {
    await logout()
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
                Администратор
              </h4>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 text-white'
                    : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[15px] font-semibold">Панель</span>
            </NavLink>

            <NavLink
              to="/admin/appointments"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 text-white'
                    : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2V5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 2V5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 9H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span className="text-[15px] font-medium">Записи</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 text-white'
                    : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.562C20.6184 15.8712 19.8581 15.3837 19 15.177"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55103C18.7122 5.25135 19.0078 6.11228 19.0078 7C19.0078 7.88772 18.7122 8.74865 18.1676 9.44897C17.623 10.1493 16.8604 10.6497 16 10.87"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[15px] font-medium">Пользователи</span>
            </NavLink>

            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-sky-700 text-white'
                    : 'text-slate-900 hover:bg-sky-700 hover:text-white'
                }`
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M19.4 15C19.2669 15.3016 19.2313 15.6373 19.2981 15.9599C19.3649 16.2825 19.5308 16.5762 19.772 16.8L19.834 16.862C20.0286 17.0565 20.183 17.2875 20.2884 17.5417C20.3937 17.7959 20.4478 18.0684 20.4478 18.3435C20.4478 18.6187 20.3937 18.8911 20.2884 19.1453C20.183 19.3995 20.0286 19.6305 19.834 19.825C19.6395 20.0196 19.4085 20.174 19.1543 20.2794C18.9001 20.3847 18.6277 20.4388 18.3525 20.4388C18.0773 20.4388 17.8049 20.3847 17.5507 20.2794C17.2965 20.174 17.0655 20.0196 16.871 19.825L16.809 19.763C16.5852 19.5218 16.2915 19.3559 15.9689 19.2891C15.6463 19.2223 15.3106 19.2579 15.009 19.391C14.7132 19.5178 14.4611 19.7288 14.2843 19.9978C14.1074 20.2668 14.0135 20.5817 14.014 20.903V21C14.014 21.5523 13.7946 22.082 13.404 22.4726C13.0134 22.8632 12.4837 23.0826 11.9314 23.0826C11.3791 23.0826 10.8494 22.8632 10.4588 22.4726C10.0682 22.082 9.84879 21.5523 9.84879 21V20.903C9.84933 20.5817 9.7554 20.2668 9.57853 19.9978C9.40167 19.7288 9.14956 19.5178 8.85379 19.391C8.55215 19.2579 8.21643 19.2223 7.89384 19.2891C7.57124 19.3559 7.27751 19.5218 7.05379 19.763L6.99179 19.825C6.79727 20.0196 6.56627 20.174 6.31205 20.2794C6.05784 20.3847 5.78538 20.4388 5.51022 20.4388C5.23506 20.4388 4.96261 20.3847 4.70839 20.2794C4.45417 20.174 4.22317 20.0196 4.02865 19.825C3.83413 19.6305 3.6798 19.3995 3.57443 19.1453C3.46906 18.8911 3.41482 18.6187 3.41482 18.3435C3.41482 18.0684 3.46906 17.7959 3.57443 17.5417C3.6798 17.2875 3.83413 17.0565 4.02865 16.862L4.09065 16.8C4.33182 16.5762 4.49772 16.2825 4.56452 15.9599C4.63131 15.6373 4.59572 15.3016 4.46265 15C4.33586 14.7042 4.12479 14.4521 3.85581 14.2753C3.58683 14.0984 3.27195 14.0045 2.95065 14.005H2.85365C2.30135 14.005 1.77167 13.7856 1.38106 13.395C0.990449 13.0044 0.771057 12.4747 0.771057 11.9224C0.771057 11.3701 0.990449 10.8404 1.38106 10.4498C1.77167 10.0592 2.30135 9.83981 2.85365 9.83981H2.95065C3.27195 9.84035 3.58683 9.74642 3.85581 9.56956C4.12479 9.3927 4.33586 9.14059 4.46265 8.84481C4.59572 8.54318 4.63131 8.20746 4.56452 7.88486C4.49772 7.56227 4.33182 7.26853 4.09065 7.04481L4.02865 6.98281C3.63468 6.58884 3.41335 6.0545 3.41335 5.49731C3.41335 4.94012 3.63468 4.40578 4.02865 4.01181C4.42262 3.61784 4.95696 3.39651 5.51415 3.39651C6.07134 3.39651 6.60568 3.61784 6.99965 4.01181L7.06165 4.07381C7.28537 4.31498 7.57911 4.48088 7.9017 4.54767C8.22429 4.61447 8.56002 4.57888 8.86165 4.44581C9.15743 4.31902 9.40954 4.10795 9.5864 3.83897C9.76326 3.56999 9.85719 3.25511 9.85665 2.93381V2.83681C9.85665 2.28451 10.076 1.75484 10.4666 1.36422C10.8572 0.97361 11.3869 0.754211 11.9392 0.754211C12.4915 0.754211 13.0212 0.97361 13.4118 1.36422C13.8024 1.75484 14.0218 2.28451 14.0218 2.83681V2.93381C14.0213 3.25511 14.1152 3.56999 14.2921 3.83897C14.4689 4.10795 14.7211 4.31902 15.0168 4.44581C15.3185 4.57888 15.6542 4.61447 15.9768 4.54767C16.2994 4.48088 16.5931 4.31498 16.8168 4.07381L16.8788 4.01181C17.2728 3.61784 17.8071 3.39651 18.3643 3.39651C18.9215 3.39651 19.4558 3.61784 19.8498 4.01181C20.2438 4.40578 20.4651 4.94012 20.4651 5.49731C20.4651 6.0545 20.2438 6.58884 19.8498 6.98281L19.7878 7.04481C19.5466 7.26853 19.3807 7.56227 19.3139 7.88486C19.2471 8.20746 19.2827 8.54318 19.4158 8.84481C19.5426 9.14059 19.7537 9.3927 20.0226 9.56956C20.2916 9.74642 20.6065 9.84035 20.9278 9.83981H21.0248C21.5771 9.83981 22.1068 10.0592 22.4974 10.4498C22.888 10.8404 23.1074 11.3701 23.1074 11.9224C23.1074 12.4747 22.888 13.0044 22.4974 13.395C22.1068 13.7856 21.5771 14.005 21.0248 14.005H20.9278C20.6065 14.0045 20.2916 14.0984 20.0226 14.2753C19.7537 14.4521 19.5426 14.7042 19.4158 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span className="text-[15px] font-medium">Настройки</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pl-7 pr-5 py-7">
        <div className="mb-5 px-5">
          <h3 className="text-[18px] font-medium text-slate-900">
            {user.firstName} {user.lastName}
          </h3>
          <h4 className="text-[14px] text-sky-600">{user.email}</h4>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-2xl px-5 py-2 text-left text-slate-900 transition hover:bg-sky-700 hover:text-white"
        >
          <img src={exit} alt="" className="h-6 w-6" />
          <span className="text-[15px] font-semibold">Выйти</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminNavigation