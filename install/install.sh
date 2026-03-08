#!/usr/bin/env bash
set -e

# ─── Цвета ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${CYAN}[info]${NC}  $1"; }
success() { echo -e "${GREEN}[ok]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[warn]${NC}  $1"; }
error()   { echo -e "${RED}[error]${NC} $1"; exit 1; }

# ─── Баннер ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}  Nuxt Vibe Stack — установка${NC}"
echo -e "  Nuxt 4 · Tailwind v4 · shadcn-vue · Pinia · TanStack"
echo ""

# ─── Проверка зависимостей ────────────────────────────────────────────────────
command -v node >/dev/null 2>&1 || error "Node.js не найден. Установите Node.js >= 20: https://nodejs.org"
command -v pnpm >/dev/null 2>&1 || {
  warn "pnpm не найден. Устанавливаю..."
  npm install -g pnpm || error "Не удалось установить pnpm"
}

NODE_VERSION=$(node -e "process.stdout.write(process.versions.node)")
MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
[ "$MAJOR" -lt 20 ] && error "Требуется Node.js >= 20, найдена версия $NODE_VERSION"

success "Node.js $NODE_VERSION"
success "pnpm $(pnpm -v)"

# ─── Имя проекта ──────────────────────────────────────────────────────────────
if [ -n "$1" ]; then
  PROJECT_NAME="$1"
else
  echo ""
  read -rp "  Имя проекта [my-app]: " PROJECT_NAME
  PROJECT_NAME="${PROJECT_NAME:-my-app}"
fi

TARGET_DIR="$(pwd)/$PROJECT_NAME"
[ -d "$TARGET_DIR" ] && error "Директория '$PROJECT_NAME' уже существует"

# ─── Клонирование ─────────────────────────────────────────────────────────────
info "Клонирование в ./$PROJECT_NAME ..."
git clone --depth=1 https://github.com/Lexxme/nuxt-vibe-stack.git "$TARGET_DIR" \
  || error "Не удалось клонировать репозиторий"

cd "$TARGET_DIR"
rm -rf .git
success "Репозиторий склонирован"

# ─── Установка зависимостей ───────────────────────────────────────────────────
info "Установка зависимостей (pnpm install)..."
pnpm install || error "Ошибка установки зависимостей"
success "Зависимости установлены"

# ─── .env ─────────────────────────────────────────────────────────────────────
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
  cp .env.example .env
  success "Создан .env из .env.example"
fi

# ─── Git init ─────────────────────────────────────────────────────────────────
git init -q
git add -A
git commit -q -m "chore: initial commit from nuxt-vibe-stack"
success "Git репозиторий инициализирован"

# ─── Готово ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}  Готово! Запустите:${NC}"
echo ""
echo -e "    cd $PROJECT_NAME"
echo -e "    pnpm dev"
echo ""
echo -e "  Откройте ${CYAN}http://localhost:3000${NC}"
echo ""
