import type { User, UserRole, UserStatus } from '~/types/user'

const NAMES = [
  'Александр Петров', 'Мария Иванова', 'Дмитрий Козлов', 'Анна Смирнова',
  'Сергей Новиков', 'Елена Морозова', 'Андрей Волков', 'Ольга Соколова',
  'Иван Лебедев', 'Наталья Попова', 'Максим Кузнецов', 'Татьяна Фёдорова',
  'Артём Михайлов', 'Екатерина Зайцева', 'Николай Павлов', 'Юлия Семёнова',
  'Алексей Голубев', 'Виктория Николаева', 'Павел Орлов', 'Светлана Андреева',
  'Роман Макаров', 'Ирина Жукова', 'Владимир Степанов', 'Дарья Белова',
  'Кирилл Комаров',
]

const ROLES: UserRole[] = ['admin', 'manager', 'user']
const STATUSES: UserStatus[] = ['active', 'inactive']

function generateUsers(): User[] {
  return NAMES.map((name, i) => {
    const email = name
      .toLowerCase()
      .replace(/ё/g, 'e')
      .replace(/[а-я]/g, (c) => {
        const map: Record<string, string> = {
          а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z',
          и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
          р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch',
          ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
        }
        return map[c] ?? c
      })
      .replace(/\s+/g, '.')

    const day = String((i % 28) + 1).padStart(2, '0')
    const month = String((i % 12) + 1).padStart(2, '0')

    return {
      id: String(i + 1),
      name,
      email: `${email}@example.com`,
      role: ROLES[i % ROLES.length],
      status: i % 5 === 0 ? 'inactive' : 'active',
      description: i % 3 === 0 ? 'Описание пользователя для примера' : undefined,
      createdAt: `2024-${month}-${day}`,
    }
  })
}

// Синглтон — одни и те же данные на протяжении сессии
let _users: User[] | null = null
function getUsers(): User[] {
  if (!_users) _users = generateUsers()
  return _users
}

/** Имитация API — загрузка списка */
export function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...getUsers()]), 300)
  })
}

/** Имитация API — один пользователь по ID */
export function fetchUserById(id: string): Promise<User | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getUsers().find(u => u.id === id)), 200)
  })
}

/** Имитация API — создание */
export function createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  return new Promise((resolve) => {
    const users = getUsers()
    const newUser: User = {
      ...data,
      id: String(users.length + 1),
      createdAt: new Date().toISOString().split('T')[0],
    }
    users.unshift(newUser)
    setTimeout(() => resolve(newUser), 300)
  })
}

/** Имитация API — обновление */
export function updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
  return new Promise((resolve, reject) => {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) return reject(new Error('User not found'))
    users[idx] = { ...users[idx], ...data }
    setTimeout(() => resolve(users[idx]), 300)
  })
}

/** Имитация API — удаление */
export function deleteUser(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) return reject(new Error('User not found'))
    users.splice(idx, 1)
    setTimeout(() => resolve(), 200)
  })
}
