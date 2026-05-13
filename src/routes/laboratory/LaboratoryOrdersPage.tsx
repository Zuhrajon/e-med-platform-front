import { useEffect, useMemo, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatusMessage from '../../components/admin/AdminStatusMessage'
import LaboratoryOrderDetailsPanel from '../../components/laboratory/LaboratoryOrderDetailsPanel'
import LaboratoryOrdersList from '../../components/laboratory/LaboratoryOrdersList'
import { useUser } from '../../context/UserContext'
import { downloadFile } from '../../lib/files'
import {
  acceptLaboratoryOrder,
  addLaboratoryOrderFiles,
  completeLaboratoryOrder,
  getLaboratoryOrderByID,
  listLaboratoryOrders,
  type CompleteLaboratoryOrderPayload,
  type LaboratoryOrder,
  type LaboratoryStatus,
} from '../../lib/laboratory'

export default function LaboratoryOrdersPage() {
  const { accessToken } = useUser()
  const [orders, setOrders] = useState<LaboratoryOrder[]>([])
  const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<LaboratoryOrder | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | LaboratoryStatus>('created')
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [actionOrderID, setActionOrderID] = useState<string | null>(null)
  const [completeOrderID, setCompleteOrderID] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadOrders(nextStatus = statusFilter) {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await listLaboratoryOrders(accessToken, {
        status: nextStatus || undefined,
      })
      setOrders(response.sort((a, b) => b.created_at.localeCompare(a.created_at)))
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Не удалось загрузить лабораторные направления',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
  }, [accessToken, statusFilter])

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return orders

    return orders.filter((order) =>
      [
        order.patient_full_name,
        order.patient_phone_number,
        order.doctor_full_name,
        order.items.map((item) => item.test_type_name).join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [orders, search])

  async function openOrder(order: LaboratoryOrder) {
    if (!accessToken) return

    setSelectedOrderID(order.order_id)
    setIsDetailsLoading(true)
    setError('')

    try {
      const response = await getLaboratoryOrderByID(accessToken, order.order_id)
      setSelectedOrder(response)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить направление')
    } finally {
      setIsDetailsLoading(false)
    }
  }

  async function refreshSelectedOrder(orderID: string) {
    if (!accessToken) return

    const response = await getLaboratoryOrderByID(accessToken, orderID)
    setSelectedOrder(response)
    setOrders((prev) => prev.map((item) => (item.order_id === response.order_id ? response : item)))
  }

  async function handleAccept(orderID: string) {
    if (!accessToken) return

    setActionOrderID(orderID)
    setError('')
    setSuccess('')

    try {
      await acceptLaboratoryOrder(accessToken, orderID)
      setSuccess('Направление принято в работу.')
      await loadOrders(statusFilter)
      await refreshSelectedOrder(orderID)
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Не удалось принять направление')
    } finally {
      setActionOrderID(null)
    }
  }

  async function handleComplete(orderID: string, payload: CompleteLaboratoryOrderPayload) {
    if (!accessToken) return

    setCompleteOrderID(orderID)
    setError('')
    setSuccess('')

    try {
      await completeLaboratoryOrder(accessToken, orderID, payload)
      setSuccess('Результаты анализов сохранены.')
      await loadOrders(statusFilter)
      await refreshSelectedOrder(orderID)
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : 'Не удалось сохранить результаты анализов',
      )
    } finally {
      setCompleteOrderID(null)
    }
  }

  async function handleUploadFiles(orderID: string, files: File[]) {
    if (!accessToken || !files.length) return

    setCompleteOrderID(orderID)
    setError('')
    setSuccess('')

    try {
      await addLaboratoryOrderFiles(accessToken, orderID, files)
      setSuccess('Файлы результатов загружены.')
      await refreshSelectedOrder(orderID)
      await loadOrders(statusFilter)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Не удалось загрузить файлы результатов')
    } finally {
      setCompleteOrderID(null)
    }
  }

  async function handleDownloadFile(fileID: string, fileName: string) {
    if (!accessToken) return
    await downloadFile(accessToken, fileID, fileName)
  }

  return (
    <div className="w-full px-6 py-10">
      <AdminPageHeader
        title="Лабораторные направления"
        description="Приём направлений от врачей, заполнение результатов и загрузка файлов исследований."
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

      <section className="mt-8 grid gap-6 2xl:grid-cols-[0.95fr_1.2fr]">
        <LaboratoryOrdersList
          orders={filteredOrders}
          isLoading={isLoading}
          search={search}
          statusFilter={statusFilter}
          selectedOrderID={selectedOrderID}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onSelect={(order) => void openOrder(order)}
        />

        <LaboratoryOrderDetailsPanel
          order={selectedOrder}
          isLoading={isDetailsLoading}
          actionOrderID={actionOrderID}
          completeOrderID={completeOrderID}
          onAccept={handleAccept}
          onComplete={handleComplete}
          onUploadFiles={handleUploadFiles}
          onDownloadFile={handleDownloadFile}
        />
      </section>
    </div>
  )
}
