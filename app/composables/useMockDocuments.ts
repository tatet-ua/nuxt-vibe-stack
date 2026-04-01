import type { Document, DocumentTreeRow } from '~/types/document'

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', parentId: null, type: 'page', title: 'Головна', alias: 'general', sort: 1, h1: 'Ласкаво просимо', intro: 'Головна сторінка сайту', content: '<p>Контент головної сторінки</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-15', updatedAt: '2024-03-10', publishedAt: '2024-01-15' },
  { id: '2', parentId: null, type: 'page', title: 'Про нас', alias: 'about', sort: 2, h1: 'Про нашу компанію', intro: 'Коротко про нас', content: '<p>Інформація про компанію</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-15', updatedAt: '2024-02-20', publishedAt: '2024-01-15' },
  { id: '3', parentId: null, type: 'folder', title: 'Блог', alias: 'blog', sort: 3, h1: 'Блог', intro: 'Наші статті', content: '', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-15', updatedAt: '2024-03-15', publishedAt: '2024-01-15' },
  { id: '4', parentId: '3', type: 'article', title: 'Як працює серверна інфраструктура', alias: 'server-infrastructure', sort: 1, h1: 'Як працює серверна інфраструктура: просте пояснення', intro: 'Розбираємо основи серверної архітектури', content: '<p>Серверна інфраструктура — це...</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-02-01', updatedAt: '2024-03-10', publishedAt: '2024-02-01' },
  { id: '5', parentId: '3', type: 'article', title: 'Що таке серверна стійка', alias: 'server-rack', sort: 2, h1: 'Що таке серверна стійка і як її обрати', intro: 'Гід по серверним стійкам', content: '<p>Серверна стійка — це спеціалізована...</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-02-10', updatedAt: '2024-03-05', publishedAt: '2024-02-10' },
  { id: '6', parentId: '3', type: 'article', title: 'Чим відрізняється сервер від звичайного ПК', alias: 'server-vs-pc', sort: 3, h1: 'Сервер vs ПК: ключові відмінності', intro: 'Порівняння сервера та звичайного комп\'ютера', content: '<p>Багато хто вважає...</p>', status: 'hidden', robots: false, coverImage: null, createdAt: '2024-02-15', updatedAt: '2024-03-01', publishedAt: null },
  { id: '7', parentId: '3', type: 'article', title: 'Як вибрати сервер для малого бізнесу', alias: 'server-for-business', sort: 4, h1: 'Як вибрати сервер для малого бізнесу', intro: 'Практичні поради', content: '<p>Обираючи сервер...</p>', status: 'draft', robots: false, coverImage: null, createdAt: '2024-03-01', updatedAt: '2024-03-15', publishedAt: null },
  { id: '8', parentId: null, type: 'folder', title: 'Послуги', alias: 'services', sort: 4, h1: 'Наші послуги', intro: 'Що ми пропонуємо', content: '', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-15', updatedAt: '2024-02-28', publishedAt: '2024-01-15' },
  { id: '9', parentId: '8', type: 'page', title: 'Розробка', alias: 'development', sort: 1, h1: 'Розробка веб-додатків', intro: 'Створюємо сучасні рішення', content: '<p>Наша команда розробників...</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-20', updatedAt: '2024-02-15', publishedAt: '2024-01-20' },
  { id: '10', parentId: '8', type: 'page', title: 'Дизайн', alias: 'design', sort: 2, h1: 'UI/UX Дизайн', intro: 'Проектуємо зручні інтерфейси', content: '<p>Дизайн — це не лише...</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-20', updatedAt: '2024-02-10', publishedAt: '2024-01-20' },
  { id: '11', parentId: '8', type: 'page', title: 'Підтримка', alias: 'support', sort: 3, h1: 'Технічна підтримка', intro: '24/7 допомога', content: '<p>Ми забезпечуємо...</p>', status: 'hidden', robots: false, coverImage: null, createdAt: '2024-01-20', updatedAt: '2024-03-01', publishedAt: null },
  { id: '12', parentId: null, type: 'folder', title: 'Каталог', alias: 'catalog', sort: 5, h1: 'Каталог продукції', intro: 'Наші товари', content: '', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-15', updatedAt: '2024-03-10', publishedAt: '2024-01-15' },
  { id: '13', parentId: '12', type: 'folder', title: 'Електроніка', alias: 'electronics', sort: 1, h1: 'Електроніка', intro: 'Сучасна електроніка', content: '', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-20', updatedAt: '2024-03-05', publishedAt: '2024-01-20' },
  { id: '14', parentId: '13', type: 'page', title: 'Ноутбуки', alias: 'laptops', sort: 1, h1: 'Ноутбуки', intro: 'Широкий вибір ноутбуків', content: '<p>У нас ви знайдете...</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-02-01', updatedAt: '2024-03-10', publishedAt: '2024-02-01' },
  { id: '15', parentId: '13', type: 'page', title: 'Монітори', alias: 'monitors', sort: 2, h1: 'Монітори', intro: 'Монітори для роботи та ігор', content: '<p>Обирайте монітор...</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-02-01', updatedAt: '2024-03-05', publishedAt: '2024-02-01' },
  { id: '16', parentId: '12', type: 'page', title: 'Побутова техніка', alias: 'appliances', sort: 2, h1: 'Побутова техніка', intro: 'Техніка для дому', content: '<p>Великий вибір побутової техніки</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-02-05', updatedAt: '2024-03-01', publishedAt: '2024-02-05' },
  { id: '17', parentId: null, type: 'page', title: 'FAQ', alias: 'faq', sort: 6, h1: 'Часті запитання', intro: 'Відповіді на популярні питання', content: '<p>Тут зібрані...</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-15', updatedAt: '2024-02-20', publishedAt: '2024-01-15' },
  { id: '18', parentId: null, type: 'page', title: 'Контакти', alias: 'contacts', sort: 7, h1: 'Контакти', intro: 'Як з нами зв\'язатися', content: '<p>Наша адреса...</p>', status: 'published', robots: true, coverImage: null, createdAt: '2024-01-15', updatedAt: '2024-02-15', publishedAt: '2024-01-15' },
]

let _documents: Document[] | null = null
function getDocuments(): Document[] {
  if (!_documents) _documents = MOCK_DOCUMENTS.map(d => ({ ...d }))
  return _documents
}

/** Построить плоский массив дерева (DFS) с учётом expandedIds */
export function buildDocumentTree(
  documents: Document[],
  expandedIds: Set<string>,
): DocumentTreeRow[] {
  const childrenMap = new Map<string | null, Document[]>()
  for (const doc of documents) {
    const key = doc.parentId
    if (!childrenMap.has(key)) childrenMap.set(key, [])
    childrenMap.get(key)!.push(doc)
  }
  // Sort children by sort field
  for (const children of childrenMap.values()) {
    children.sort((a, b) => a.sort - b.sort)
  }

  const result: DocumentTreeRow[] = []

  function walk(parentId: string | null, depth: number) {
    const children = childrenMap.get(parentId) ?? []
    for (const doc of children) {
      const docChildren = childrenMap.get(doc.id) ?? []
      const hasChildren = docChildren.length > 0
      const isExpanded = expandedIds.has(doc.id)

      result.push({
        ...doc,
        depth,
        hasChildren,
        isExpanded,
        childCount: docChildren.length,
      })

      if (hasChildren && isExpanded) {
        walk(doc.id, depth + 1)
      }
    }
  }

  walk(null, 0)
  return result
}

/** Имитация API — загрузка списка */
export function fetchDocuments(): Promise<Document[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...getDocuments()]), 300)
  })
}

/** Имитация API — один документ по ID */
export function fetchDocumentById(id: string): Promise<Document | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getDocuments().find(d => d.id === id)), 200)
  })
}

/** Имитация API — обновление */
export function updateDocument(id: string, data: Partial<Omit<Document, 'id' | 'createdAt'>>): Promise<Document> {
  return new Promise((resolve, reject) => {
    const docs = getDocuments()
    const idx = docs.findIndex(d => d.id === id)
    if (idx === -1) return reject(new Error('Document not found'))
    docs[idx] = { ...docs[idx], ...data, updatedAt: new Date().toISOString().split('T')[0] }
    setTimeout(() => resolve(docs[idx]), 300)
  })
}

/** Имитация API — удаление */
export function deleteDocument(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const docs = getDocuments()
    const idx = docs.findIndex(d => d.id === id)
    if (idx === -1) return reject(new Error('Document not found'))
    docs.splice(idx, 1)
    setTimeout(() => resolve(), 200)
  })
}
