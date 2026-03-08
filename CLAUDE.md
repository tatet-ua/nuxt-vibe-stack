# CLAUDE.md — Инструкция для ИИ-ассистента

> Этот файл читается Claude Code, Cursor и другими ИИ-инструментами
> автоматически при каждом запросе. Не удалять.

---

## Стек

| Слой | Инструмент | Версия | Важно |
|---|---|---|---|
| Фреймворк | Nuxt | 4.3.1 | future.compatibilityVersion: 4 |
| CSS | Tailwind CSS | 4.2 | только через @tailwindcss/vite |
| UI | shadcn-vue | latest | prefix: 'Ui' |
| Интеграция | shadcn-nuxt | latest | авто-импорты |
| Стейт | Pinia + @pinia/nuxt | latest | |
| Серверный стейт | @tanstack/vue-query | v5 | |
| Таблицы | @tanstack/vue-table | v8 | |
| Формы | VeeValidate 4 + Zod | latest | |
| Иконки | lucide-vue-next | latest | |

---

## Правила генерации кода

### Компоненты shadcn-vue
- Все UI-компоненты используются с префиксом `Ui`: `UiButton`, `UiSheet`, `UiDialog`
- Компоненты авто-импортируются через shadcn-nuxt — не нужны ручные импорты
- Исходники компонентов лежат в `app/components/ui/` — НЕ редактировать вручную

### Критические именования (частые ошибки ИИ)
```
# ПРАВИЛЬНО               # НЕПРАВИЛЬНО
UiSheet                   UiDrawer  ← Drawer это bottom sheet, НЕ боковая панель!
UiSonner                  UiToast   ← Toast устарён, использовать Sonner
UiAlertDialog             UiConfirm ← такого компонента нет
```

### Vue / Nuxt паттерны
```vue
<!-- ПРАВИЛЬНО: клонирование объектов из пропсов -->
const localItem = ref({ ...props.item })

<!-- НЕПРАВИЛЬНО: мутация пропсов -->
props.item.name = 'new value' // ❌

<!-- ПРАВИЛЬНО: emit для обновления -->
emit('update:item', { ...localItem.value })
```

### TypeScript
- `strict: true` — никаких `any`, всегда типизировать
- Generic-компоненты для списков: `items: T[]`, не `items: any[]`
- Интерфейсы в отдельных файлах `types/` или рядом с компонентом

### Tailwind v4
```css
/* ПРАВИЛЬНО — v4 синтаксис */
@import "tailwindcss";
@theme { --color-primary: hsl(var(--primary)); }

/* НЕПРАВИЛЬНО — v3 синтаксис */
@tailwind base;          /* ❌ */
@tailwind components;    /* ❌ */
module.exports = { ... } /* ❌ tailwind.config.js не нужен */
```

---

## Структура проекта (Nuxt 4)

```
app/
  components/
    ui/          ← shadcn-vue компоненты (авто-генерируются CLI)
    base/        ← базовые переиспользуемые компоненты
                    Пример: BaseDataTable.vue, BasePageHeader.vue
  composables/   ← вся логика БЕЗ UI
                    Пример: useTableSettings.ts, useAuth.ts
  stores/        ← только Pinia stores
                    Пример: useUserStore.ts, useAppStore.ts
  pages/         ← Nuxt pages (файловый роутинг)
  layouts/       ← Nuxt layouts
  assets/
    css/
      main.css   ← Tailwind + shadcn токены (НЕ трогать @theme блок)
server/
  api/           ← Nuxt server routes
types/           ← глобальные TypeScript типы
public/          ← статика
```

### Правила по директориям
- `composables/` — localStorage, fetch-логика, бизнес-логика. НЕ в компонентах
- `stores/` — глобальный стейт. НЕ использовать provide/inject для глобального стейта
- `components/ui/` — только shadcn компоненты. НЕ создавать кастомные компоненты здесь
- `components/base/` — кастомные компоненты поверх shadcn

---

## Формы — VeeValidate + Zod

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
})

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(schema),
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  // values уже типизированы как z.infer<typeof schema>
})
</script>
```

---

## Таблицы — TanStack + shadcn Table

```ts
// Клиентская пагинация
import { useVueTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/vue-table'

const table = useVueTable({
  get data() { return props.data },
  get columns() { return columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), // страницы по 10
})

// Серверная пагинация
const table = useVueTable({
  get data() { return props.data },
  get columns() { return columns },
  manualPagination: true,           // ← ИИ часто забывает!
  get pageCount() { return props.pageCount },
  getCoreRowModel: getCoreRowModel(),
})
```

---

## Уведомления — Sonner (НЕ Toast)

```vue
<!-- app.vue или layout -->
<UiSonner />

<!-- в любом компоненте -->
<script setup lang="ts">
import { toast } from 'vue-sonner'

toast('Сохранено')
toast.error('Ошибка сохранения')
toast.success('Успешно!')
</script>
```

---

## MCP серверы

Настроены в `.mcp.json`. Дают ИИ актуальный контекст:
- `shadcn-vue` — исходники компонентов, примеры, Vue-специфика
- `context7` — актуальная документация Nuxt, Vue, TanStack

---

## Что НЕ делать (частые ошибки ИИ)

```
❌ @nuxtjs/tailwindcss     — альфа, без документации для v4
❌ Reka UI напрямую        — уже внутри shadcn-vue
❌ Кастомный Modal.vue     — использовать UiDialog
❌ <Toast> компонент       — использовать Sonner
❌ мутация props           — всегда emit или local ref
❌ any[] в типах           — всегда generic или конкретный тип
❌ localStorage в компонентах — только в composables/
❌ provide/inject для глобального стейта — использовать Pinia
```

---

## Dev-сервер

- Всегда запускать на `http://localhost:3000` (`pnpm dev` уже содержит `--port 3000`)
- Перед запуском — убивать все процессы, занимающие порт 3000 и соседние (3001–3004),
  которые могли остаться от предыдущих сессий:

```bash
# Найти и убить процесс на порту 3000
PID=$(netstat -ano | grep ":::3000\|127.0.0.1:3000\|\[::1\]:3000" | grep LISTENING | awk '{print $5}' | head -1)
[ -n "$PID" ] && powershell -Command "Stop-Process -Id $PID -Force -ErrorAction SilentlyContinue"

# Убить все оставшиеся Nuxt-процессы (3001-3004) если есть
for PORT in 3001 3002 3003 3004; do
  PID=$(netstat -ano | grep "\[::1\]:${PORT} " | grep LISTENING | awk '{print $5}' | head -1)
  [ -n "$PID" ] && powershell -Command "Stop-Process -Id $PID -Force -ErrorAction SilentlyContinue"
done

pnpm dev
```

- После остановки всегда проверять что порт свободен перед `pnpm dev`

---

## Документация (llms.txt)

- shadcn-vue: https://shadcn-vue.com/llms.txt
- shadcn/ui:  https://ui.shadcn.com/llms.txt
