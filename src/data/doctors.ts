export type Doctor = {
  id: string
  name: string
  specialty: string
  rating: number
  reviewsCount: number
  experience: string
  description: string
  price: number
}

export const doctorsData: Doctor[] = [
  {
    id: '1',
    name: 'Анна Иванова',
    specialty: 'Терапевт',
    rating: 4.8,
    reviewsCount: 245,
    experience: '12 лет',
    description:
      'Специализируюсь на диагностике и лечении простудных заболеваний, профилактических осмотрах и общем ведении пациентов.',
    price: 3000,
  },
  {
    id: '2',
    name: 'Дмитрий Петров',
    specialty: 'Кардиолог',
    rating: 4.9,
    reviewsCount: 312,
    experience: '15 лет',
    description:
      'Занимаюсь лечением сердечно-сосудистых заболеваний, диагностикой нарушений ритма и профилактикой осложнений.',
    price: 4500,
  },
  {
    id: '3',
    name: 'Елена Сидорова',
    specialty: 'Невролог',
    rating: 4.7,
    reviewsCount: 198,
    experience: '10 лет',
    description:
      'Помогаю пациентам с головными болями, нарушениями сна, тревожностью и другими неврологическими состояниями.',
    price: 4000,
  },
  {
    id: '4',
    name: 'Мария Смирнова',
    specialty: 'Педиатр',
    rating: 4.9,
    reviewsCount: 276,
    experience: '9 лет',
    description:
      'Веду наблюдение детей всех возрастов, профилактические осмотры, вакцинацию и лечение распространённых заболеваний.',
    price: 3200,
  },
]