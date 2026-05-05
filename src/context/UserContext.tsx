import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  type BackendRole,
  changePasswordRequest,
  loginRequest,
  logoutRequest,
  mapBackendRoleToAppRole,
  refreshRequest,
  registerPatientRequest,
  type AppRole,
} from '../lib/auth'
import { getMyProfile, mergeUserProfileFromBackend } from '../lib/profile'
import { saveCachedDoctorDescription } from '../lib/doctorDescription'

export type Appointment = {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: 'Подтверждена' | 'Отменена' | 'Создана'
  reason: string
}

export type UserProfile = {
  role: AppRole
  backendRole: BackendRole
  userId?: string
  firstName: string
  lastName: string
  middleName: string
  email: string
  phone: string
  gender: string
  birthDate: string
  address: string
  documentNumber: string
  avatar: string | null

  // doctor/admin extra fields
  position: string
  officeNumber: string
  department: string
  specialization: string
  qualification: string
  description: string

  appointments: Appointment[]
}

type Session = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  mustChangePassword: boolean
}

type LoginInput = {
  email: string
  password: string
}

type RegisterInput = {
  firstName: string
  lastName: string
  middleName: string
  phone: string
  email: string
  gender: string
  birthDate: string
  address: string
  documentNumber: string
  password: string
}

type UserContextType = {
  user: UserProfile
  isAuthenticated: boolean
  isBootstrapping: boolean
  accessToken: string | null
  updateUser: (data: Partial<UserProfile>) => void
  setUser: (data: UserProfile) => void
  login: (data: LoginInput) => Promise<AppRole>
  registerPatient: (data: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

const SESSION_STORAGE_KEY = 'auth-session'
const PROFILE_STORAGE_KEY = 'user-profile'

const emptyUser: UserProfile = {
  role: 'patient',
  backendRole: 'patient',
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phone: '',
  gender: '',
  birthDate: '',
  address: '',
  documentNumber: '',
  avatar: null,
  position: '',
  officeNumber: '',
  department: '',
  specialization: '',
  qualification: '',
  description: '',
  appointments: [],
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function persistSession(session: Session | null) {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

function persistProfile(profile: UserProfile | null) {
  if (!profile) {
    localStorage.removeItem(PROFILE_STORAGE_KEY)
    return
  }

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

function getSavedSession(): Session | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

function getSavedProfile(): UserProfile | null {
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

function deriveNameFromEmail(email: string) {
  const localPart = email.split('@')[0] || ''
  const cleaned = localPart.replace(/[._-]+/g, ' ').trim()
  if (!cleaned) return { firstName: 'Пользователь', lastName: '' }

  const [firstName, ...rest] = cleaned.split(' ')
  return {
    firstName: firstName ? firstName[0].toUpperCase() + firstName.slice(1) : 'Пользователь',
    lastName: rest.join(' '),
  }
}

function genderToId(gender: string): number {
  return gender === 'Женский' ? 2 : 1
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(emptyUser)
  const [session, setSession] = useState<Session | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    const savedProfile = getSavedProfile()
    const savedSession = getSavedSession()

    if (savedProfile) {
      setUserState(savedProfile)
    }

    if (savedSession) {
      setSession(savedSession)
    }

    setIsBootstrapping(false)
  }, [])

  useEffect(() => {
    if (!session?.accessToken) return

    const accessToken = session.accessToken

    let isMounted = true

    async function syncProfile() {
      try {
        const profile = await getMyProfile(accessToken)
        if (!isMounted) return

        setUserState((prev) => {
          const next = mergeUserProfileFromBackend(prev, prev.backendRole, profile)
          persistProfile(next)
          return next
        })
      } catch {
        // Keep the locally restored profile if profile sync fails.
      }
    }

    void syncProfile()

    return () => {
      isMounted = false
    }
  }, [session?.accessToken])

  const setUser = useCallback((data: UserProfile) => {
    setUserState(data)
    persistProfile(data)
  }, [])

  const updateUser = useCallback((data: Partial<UserProfile>) => {
    setUserState((prev) => {
      const next = { ...prev, ...data }
      persistProfile(next)
      return next
    })
  }, [])

  const syncUserProfile = useCallback(
    (
      backendRole: BackendRole,
      profile: Parameters<typeof mergeUserProfileFromBackend>[2],
      appRole?: AppRole,
    ) => {
      setUserState((prev) => {
        const next = {
          ...mergeUserProfileFromBackend(prev, backendRole, profile),
          role: appRole ?? prev.role,
          backendRole,
        }
        if (backendRole === 'doctor' && next.userId) {
          saveCachedDoctorDescription(next.userId, next.description || '')
        }
        persistProfile(next)
        return next
      })
    },
    [],
  )

  const applyAuthResult = useCallback(
    (
      auth: {
        access_token: string
        refresh_token: string
        token_type: string
        expires_in: number
        must_change_password: boolean
        role: 'patient' | 'doctor' | 'superuser' | 'receptionist'
      },
      baseProfile: Partial<UserProfile>,
    ) => {
      const role = mapBackendRoleToAppRole(auth.role)


      const nextSession: Session = {
        accessToken: auth.access_token,
        refreshToken: auth.refresh_token,
        tokenType: auth.token_type,
        expiresIn: auth.expires_in,
        mustChangePassword: auth.must_change_password,
      }

      const nextUser: UserProfile = {
        ...emptyUser,
        ...user,
        ...baseProfile,
        role,
        backendRole: auth.role,
      }

      setSession(nextSession)
      persistSession(nextSession)
      setUser(nextUser)

      return role
    },
    [setUser, user],
  )
//   const applyAuthResult = useCallback(
//   (
//     auth: {
//       access_token: string
//       refresh_token: string
//       token_type: string
//       expires_in: number
//       must_change_password: boolean
//       role: 'patient' | 'doctor' | 'superuser' | 'receptionist'
//     },
//     baseProfile: Partial<UserProfile>,
//   ) => {
//     let role = mapBackendRoleToAppRole(auth.role)

//     // временно для демонстрации:
//     // этот пациент будет открываться как доктор
//     if (baseProfile.email?.toLowerCase() === 'zuz23@gmail.com') {
//       role = 'doctor'
//     }

//     const nextSession: Session = {
//       accessToken: auth.access_token,
//       refreshToken: auth.refresh_token,
//       tokenType: auth.token_type,
//       expiresIn: auth.expires_in,
//       mustChangePassword: auth.must_change_password,
//     }

//     const nextUser: UserProfile = {
//       ...emptyUser,
//       ...user,
//       ...baseProfile,
//       role,
//     }

//     setSession(nextSession)
//     persistSession(nextSession)
//     setUser(nextUser)

//     return role
//   },
//   [setUser, user],
// )

  const login = useCallback(
    async ({ email, password }: LoginInput) => {
      const response = await loginRequest(email, password)
      const { firstName, lastName } = deriveNameFromEmail(email)
      const role = applyAuthResult(response, {
        email,
        firstName: user.firstName || firstName,
        lastName: user.lastName || lastName,
      })

      try {
        const profile = await getMyProfile(response.access_token)
        syncUserProfile(response.role, profile, role)
      } catch {
        // Fall back to the minimal login profile.
      }

      return role
    },
    [applyAuthResult, syncUserProfile, user],
  )

  const registerPatient = useCallback(
    async (data: RegisterInput) => {
      const response = await registerPatientRequest({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName,
        phone_number: data.phone,
        gender_id: genderToId(data.gender),
        passport_number: data.documentNumber,
        address: data.address,
        date_of_birth: data.birthDate,
      })

      applyAuthResult(response, {
        userId: response.user_id,
        role: 'patient',
        backendRole: 'patient',
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        birthDate: data.birthDate,
        address: data.address,
        documentNumber: data.documentNumber,
      })

      try {
        const profile = await getMyProfile(response.access_token)
        syncUserProfile('patient', profile, 'patient')
      } catch {
        // Keep the registration payload if profile sync fails.
      }
    },
    [applyAuthResult, syncUserProfile],
  )

  const logout = useCallback(async () => {
    try {
      if (session?.refreshToken) {
        await logoutRequest(session.refreshToken)
      }
    } catch {
      // даже если logout на бэке упал, локально сессию все равно чистим
    } finally {
      setSession(null)
      persistSession(null)
      setUserState(emptyUser)
      persistProfile(null)
    }
  }, [session?.refreshToken])

  const refreshSession = useCallback(async () => {
    if (!session?.refreshToken) return

    const response = await refreshRequest(session.refreshToken)

    const nextSession: Session = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
      mustChangePassword: response.must_change_password,
    }

    setSession(nextSession)
    persistSession(nextSession)

    try {
      const profile = await getMyProfile(response.access_token)
      syncUserProfile(response.role, profile, mapBackendRoleToAppRole(response.role))
    } catch {
      updateUser({ role: mapBackendRoleToAppRole(response.role), backendRole: response.role })
    }
  }, [session?.refreshToken, syncUserProfile, updateUser])

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      if (!session?.accessToken) {
        throw new Error('Нет access token')
      }

      const response = await changePasswordRequest(
        session.accessToken,
        oldPassword,
        newPassword,
      )

      const nextSession: Session = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type,
        expiresIn: response.expires_in,
        mustChangePassword: response.must_change_password,
      }

      setSession(nextSession)
      persistSession(nextSession)

      try {
        const profile = await getMyProfile(response.access_token)
        syncUserProfile(response.role, profile, mapBackendRoleToAppRole(response.role))
      } catch {
        updateUser({ role: mapBackendRoleToAppRole(response.role), backendRole: response.role })
      }
    },
    [session?.accessToken, syncUserProfile, updateUser],
  )

  const value = useMemo<UserContextType>(
    () => ({
      user,
      isAuthenticated: !!session?.accessToken,
      isBootstrapping,
      accessToken: session?.accessToken ?? null,
      updateUser,
      setUser,
      login,
      registerPatient,
      logout,
      refreshSession,
      changePassword,
    }),
    [
      user,
      session?.accessToken,
      isBootstrapping,
      updateUser,
      setUser,
      login,
      registerPatient,
      logout,
      refreshSession,
      changePassword,
    ],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used inside UserProvider')
  }

  return context
}

