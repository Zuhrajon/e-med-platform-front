import React from 'react'
import Recomendation from '../components/Recomendation'
import UpcomingAppointments from '../components/UpcomingAppointments'
import calendar from '../assets/card-svg/calendar.svg'
import clock from '../assets/card-svg/clock.svg'
import person from '../assets/card-svg/person.svg'
import paper from '../assets/card-svg/paper.svg'
import { useUser } from '../context/UserContext'



export default function HomePage() {
    const { user } = useUser()
    const upcomingAppointments: Appointment[] = [
        {
            id: '1',
            doctorName: 'Анна Иванова',
            specialty: 'Терапевт',
            date: '10 апреля',
            time: '10:00',
            status: 'Подтверждена',
            reason: 'Профилактический осмотр',
        },
        {
            id: '2',
            doctorName: 'Дмитрий Петров',
            specialty: 'Кардиолог',
            date: '15 апреля',
            time: '14:30',
            status: 'Создана',
            reason: 'Консультация кардиолога',
        },
    ]
    return (
        <div className='w-full px-6 py-10 bg-[#f7f7f8]'>
            <header>
                <h1 className="mt-3 pb-1 text-[25px] font-semibold text-slate-900">Добро пожаловать, {user.firstName} </h1>
                <h2 className="text-[17px] font-normal text-gray-500">Управляйте своим здоровьем в одном месте </h2>
            </header>
            {/* Карточки */}
            <div className='flex flex-wrap gap-4 py-10'>
                {/* Первая карточка */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-9 py-8 shadow-sm w-[420px] h-[185px]">
                    <div>
                        <h4 className="text-[17px] font-normal text-gray-500">
                            Ближайший приём
                        </h4>
                        <h3 className="mt-3 text-[20px] font-semibold text-slate-900">
                            10 апреля(День приема)
                        </h3>
                    </div>

                    <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-sky-100">
                        <img src={calendar} alt="" className="h-9 w-9" />
                    </div>
                </div>
                {/* Вторая карточка */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-9 py-8 shadow-sm w-[420px] h-[185px]">
                    <div>
                        <h4 className="text-[17px] font-normal text-gray-500">
                            Активных записей
                        </h4>
                        <h3 className="mt-3 text-[20px] font-semibold text-slate-900">
                            2 (Сколько акт.записей)
                        </h3>
                    </div>

                    <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#e7f8f2]">
                        <img src={clock} alt="" className="h-9 w-9" />
                    </div>
                </div>
                {/* Третья карточка */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-9 py-8 shadow-sm w-[420px] h-[185px]">
                    <div>
                        <h4 className="text-[17px] font-normal text-gray-500">
                            Врачей в базе
                        </h4>
                        <h3 className="mt-3 text-[20px] font-semibold text-slate-900">
                            6 (кол-во врачей)
                        </h3>
                    </div>

                    <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#fdf5e6]">
                        <img src={person} alt="" className="h-9 w-9" />
                    </div>
                </div>
                {/* Четвертая карточка */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-9 py-8 shadow-sm w-[420px] h-[185px]">
                    <div>
                        <h4 className="text-[17px] font-normal text-gray-500">
                            Всего визитов
                        </h4>
                        <h3 className="mt-3 text-[20px] font-semibold text-slate-900">
                            7 (Кол-во визитов)
                        </h3>
                    </div>

                    <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#fdecec]">
                        <img src={paper} alt="" className="h-9 w-9" />
                    </div>


                </div>
            </div>
            <div>
                <UpcomingAppointments
                    appointments={upcomingAppointments}
                    variant="compact"
                    showAllLink={true}
                />
            </div>
            {/* Рекомендации */}
            <div>
                <Recomendation />
            </div>
        </div>


    )
}
