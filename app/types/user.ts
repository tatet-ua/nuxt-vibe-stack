export type UserRole = 'admin' | 'manager' | 'user'
export type UserStatus = 'active' | 'inactive'

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Админ',
  manager: 'Менеджер',
  user: 'Пользователь',
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  description?: string
  createdAt: string
}
