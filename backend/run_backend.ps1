# Start ClinicConnect FastAPI Backend Server on http://127.0.0.1:8000
# Uses uv to run without manual Python installation

$env:Path = "C:\Users\hp\.local\bin;$env:Path"
$scriptDir = $PSScriptRoot
if ($scriptDir) { Set-Location $scriptDir }

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting ClinicConnect Backend (FastAPI + SQLite + Gemini)" -ForegroundColor Green
Write-Host "   Directory: $PWD" -ForegroundColor Gray
Write-Host "   Port:      http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "   Docs:      http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

uv run --with fastapi --with "uvicorn[standard]" --with python-multipart --with pydantic uvicorn server:app --host 127.0.0.1 --port 8000 --reload
