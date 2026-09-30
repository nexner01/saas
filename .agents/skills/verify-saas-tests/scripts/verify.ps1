Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Noteflow SaaS Test Suite Verification " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Run Vitest Suite
Write-Host "`n[1/3] Running Vitest Unit & Integration Tests..." -ForegroundColor Yellow
npm run test
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Tests failed!" -ForegroundColor Red
    exit 1
}

# 2. Check Coverage
Write-Host "`n[2/3] Checking Code Coverage (>= 80%)..." -ForegroundColor Yellow
npx vitest run --coverage
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Coverage check failed!" -ForegroundColor Red
    exit 1
}

# 3. Next.js Production Build
Write-Host "`n[3/3] Checking Next.js 16 Production Build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Production build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✅ All SaaS Tests & Build Verified!   " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
