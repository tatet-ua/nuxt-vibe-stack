#Requires -Version 5.1
[CmdletBinding()]
param(
  [string]$ProjectName = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ─── Вспомогательные функции ──────────────────────────────────────────────────
function Write-Info    { param($msg) Write-Host "[info]  $msg" -ForegroundColor Cyan }
function Write-Ok      { param($msg) Write-Host "[ok]    $msg" -ForegroundColor Green }
function Write-Warn    { param($msg) Write-Host "[warn]  $msg" -ForegroundColor Yellow }
function Write-Fail    { param($msg) Write-Host "[error] $msg" -ForegroundColor Red; exit 1 }

# ─── Баннер ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  Nuxt Vibe Stack — установка" -ForegroundColor Cyan
Write-Host "  Nuxt 4 · Tailwind v4 · shadcn-vue · Pinia · TanStack"
Write-Host ""

# ─── Проверка Node.js ─────────────────────────────────────────────────────────
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Fail "Node.js не найден. Установите Node.js >= 20: https://nodejs.org"
}

$nodeVersion = (node -e "process.stdout.write(process.versions.node)")
$nodeMajor   = [int]($nodeVersion -split '\.')[0]
if ($nodeMajor -lt 20) {
  Write-Fail "Требуется Node.js >= 20, найдена версия $nodeVersion"
}
Write-Ok "Node.js $nodeVersion"

# ─── Проверка / установка pnpm ────────────────────────────────────────────────
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Warn "pnpm не найден. Устанавливаю..."
  npm install -g pnpm
  if ($LASTEXITCODE -ne 0) { Write-Fail "Не удалось установить pnpm" }
}
Write-Ok "pnpm $(pnpm -v)"

# ─── Имя проекта ──────────────────────────────────────────────────────────────
if (-not $ProjectName) {
  $ProjectName = Read-Host "  Имя проекта [my-app]"
  if (-not $ProjectName) { $ProjectName = "my-app" }
}

$targetDir = Join-Path (Get-Location) $ProjectName
if (Test-Path $targetDir) {
  Write-Fail "Директория '$ProjectName' уже существует"
}

# ─── Клонирование ─────────────────────────────────────────────────────────────
Write-Info "Клонирование в .\$ProjectName ..."
git clone --depth=1 https://github.com/Lexxme/nuxt-vibe-stack.git $targetDir
if ($LASTEXITCODE -ne 0) { Write-Fail "Не удалось клонировать репозиторий" }

Set-Location $targetDir
Remove-Item -Recurse -Force .git
Write-Ok "Репозиторий склонирован"

# ─── Установка зависимостей ───────────────────────────────────────────────────
Write-Info "Установка зависимостей (pnpm install)..."
pnpm install
if ($LASTEXITCODE -ne 0) { Write-Fail "Ошибка установки зависимостей" }
Write-Ok "Зависимости установлены"

# ─── .env ─────────────────────────────────────────────────────────────────────
if ((Test-Path ".env.example") -and (-not (Test-Path ".env"))) {
  Copy-Item ".env.example" ".env"
  Write-Ok "Создан .env из .env.example"
}

# ─── Git init ─────────────────────────────────────────────────────────────────
git init -q
git add -A
git commit -q -m "chore: initial commit from nuxt-vibe-stack"
Write-Ok "Git репозиторий инициализирован"

# ─── Готово ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  Готово! Запустите:" -ForegroundColor Green
Write-Host ""
Write-Host "    cd $ProjectName"
Write-Host "    pnpm dev"
Write-Host ""
Write-Host "  Откройте http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
