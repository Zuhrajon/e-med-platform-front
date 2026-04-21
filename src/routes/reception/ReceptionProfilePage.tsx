import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminProfileSummaryCard from '../../components/admin/AdminProfileSummaryCard'
import SecuritySettingsSection from '../../components/account/SecuritySettingsSection'
import { useUser } from '../../context/UserContext'

export default function ReceptionProfilePage() {
  const { user } = useUser()
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')

  return (
    <div className="w-full px-6 py-10">
      <AdminPageHeader
        title="Профиль"
        description="Основная информация сотрудника ресепшена и управление паролем."
      />

      <div className="mt-8 max-w-4xl space-y-6">
        <AdminProfileSummaryCard
          fullName={fullName}
          email={user.email || ''}
          roleLabel="Ресепшен"
          fallbackName="Сотрудник ресепшена"
        />
        <SecuritySettingsSection className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm" />
      </div>
    </div>
  )
}
