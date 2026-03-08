# Nuxt Vibe Stack

**Nuxt 4.3** · **Tailwind v4.2** · **shadcn-vue** · **Pinia** · **TanStack**

Готовый стартовый шаблон для быстрой разработки. ИИ-ассистенты (Claude Code, Cursor) знают каждый инструмент из коробки — настроены MCP-серверы с актуальной документацией.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Требования

| Инструмент | Версия |
|---|---|
| Node.js | >= 20 |
| pnpm | >= 9 |

---

## Быстрая установка

### Linux / macOS

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Lexxme/nuxt-vibe-stack/main/install/install.sh)
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/Lexxme/nuxt-vibe-stack/main/install/install.ps1 | iex
```

### Вручную

```bash
# 1. Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git my-app
cd my-app

# 2. Установить зависимости
pnpm install

# 3. Переменные окружения
cp .env.example .env

# 4. Запустить dev-сервер
pnpm dev
```

Открыть в браузере: [http://localhost:3000](http://localhost:3000)

---

## Стек

| Слой | Инструмент | Версия |
|---|---|---|
| Фреймворк | Nuxt | 4.3.1 |
| CSS | Tailwind CSS (через `@tailwindcss/vite`) | 4.2 |
| UI-компоненты | shadcn-vue (prefix: `Ui`) | latest |
| Nuxt-интеграция | shadcn-nuxt | 2.x |
| Стейт | Pinia | 3.x |
| Серверный стейт | TanStack Vue Query | v5 |
| Таблицы | TanStack Vue Table | v8 |
| Формы | VeeValidate + Zod | 4.x |
| Иконки | lucide-vue-next | latest |
| Уведомления | vue-sonner | latest |

---

## Структура проекта

```
app/
  components/
    ui/          ← shadcn-vue компоненты (CLI, не трогать)
    base/        ← переиспользуемые компоненты поверх shadcn
  composables/   ← логика без UI (localStorage, fetch, бизнес-логика)
  stores/        ← Pinia stores
  pages/         ← Nuxt pages (файловый роутинг)
  layouts/       ← Nuxt layouts
  plugins/       ← плагины (vue-query и др.)
  assets/css/    ← main.css (Tailwind + shadcn токены)
server/
  api/           ← Nuxt server routes
types/           ← глобальные TypeScript типы
```

---

## Добавление компонентов shadcn-vue

```bash
# Отдельный компонент
pnpm dlx shadcn-vue@latest add button

# Несколько сразу
pnpm dlx shadcn-vue@latest add input label select textarea

# Список доступных компонентов: https://shadcn-vue.com/docs/components
```

Уже установлены: `button`, `dialog`, `sheet`, `tabs`, `table`, `pagination`, `sonner`

---

## Именование компонентов (prefix `Ui`)

```vue
<UiButton />
<UiDialog />
<UiSheet />          <!-- боковая панель, не UiDrawer! -->
<UiToaster />        <!-- уведомления (Sonner) -->
<UiTabs />
<UiTable />
<UiPagination />
```

---

## MCP — контекст для ИИ-ассистентов

Настроен в `.mcp.json` (Claude Code) и `.cursor/mcp.json` (Cursor).

- **shadcn-vue MCP** — исходники компонентов, Vue-паттерны
- **Context7** — актуальная документация Nuxt, Vue, TanStack

```bash
# Claude Code: проверить подключение
/mcp
```

---

## Частые команды

```bash
pnpm dev          # dev-сервер на :3000
pnpm build        # production сборка
pnpm typecheck    # проверка типов
pnpm lint         # линтер
```

---

## Лицензия

[MIT](./install/LICENSE)
