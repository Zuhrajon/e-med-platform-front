import { useEffect, useState } from 'react'
import LaboratoryTestTypesManager from '../../components/laboratory/LaboratoryTestTypesManager'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatusMessage from '../../components/admin/AdminStatusMessage'
import { useUser } from '../../context/UserContext'
import {
  createLaboratoryTestType,
  deleteLaboratoryTestType,
  listLaboratoryTestTypes,
  updateLaboratoryTestType,
  type LaboratoryTestType,
} from '../../lib/laboratory'

export default function AdminLaboratoryPage() {
  const { accessToken } = useUser()
  const [testTypes, setTestTypes] = useState<LaboratoryTestType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingTestTypeID, setPendingTestTypeID] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadTestTypes() {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await listLaboratoryTestTypes(accessToken)
      setTestTypes(response)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить типы анализов')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadTestTypes()
  }, [accessToken])

  async function handleCreate(payload: { name: string; description: string }) {
    if (!accessToken) return

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      await createLaboratoryTestType(accessToken, payload)
      setSuccess('Тип анализа добавлен.')
      await loadTestTypes()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось добавить тип анализа')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpdate(
    testTypeID: string,
    payload: { name?: string; description?: string; is_active?: boolean },
  ) {
    if (!accessToken) return

    setPendingTestTypeID(testTypeID)
    setError('')
    setSuccess('')

    try {
      await updateLaboratoryTestType(accessToken, testTypeID, payload)
      setSuccess('Тип анализа обновлён.')
      await loadTestTypes()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось обновить тип анализа')
    } finally {
      setPendingTestTypeID(null)
    }
  }

  async function handleDelete(testTypeID: string) {
    if (!accessToken) return
    if (!window.confirm('Удалить этот тип анализа?')) return

    setPendingTestTypeID(testTypeID)
    setError('')
    setSuccess('')

    try {
      await deleteLaboratoryTestType(accessToken, testTypeID)
      setSuccess('Тип анализа удалён.')
      await loadTestTypes()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Не удалось удалить тип анализа')
    } finally {
      setPendingTestTypeID(null)
    }
  }

  return (
    <div className="w-full px-6 py-10">
      <AdminPageHeader
        title="Лаборатория"
        description="Управление типами анализов и подготовка справочника для врачей и лаборатории."
      />

      {error ? (
        <AdminStatusMessage tone="error" className="mt-6">
          {error}
        </AdminStatusMessage>
      ) : null}

      {success ? (
        <AdminStatusMessage tone="success" className="mt-6">
          {success}
        </AdminStatusMessage>
      ) : null}

      <div className="mt-8">
        <LaboratoryTestTypesManager
          testTypes={testTypes}
          isLoading={isLoading}
          isSaving={isSaving}
          pendingTestTypeID={pendingTestTypeID}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
