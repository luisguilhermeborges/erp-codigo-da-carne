@echo off
cd /d "%~dp0.."
TITLE ERP CDC - INICIALIZADOR COMPLETO
color 0e

echo ============================================================
echo           SISTEMA DE PEDIDOS - CODIGO DA CARNE
echo ============================================================
echo.

echo [1/3] Iniciando Servidor BACKEND (API)...
start "BACKEND - ERP CDC" cmd /k "cd server && node index.js"

echo [2/3] Iniciando Interface FRONTEND (Vite)...
start "FRONTEND - ERP CDC" cmd /k "npm run dev"

echo [3/3] Abrindo Navegador...
timeout /t 3 /nobreak > nul
start chrome "http://localhost:3000"

echo.
echo ============================================================
echo   Tudo pronto! O sistema abrira no Chrome em instantes.
echo   As janelas do CMD devem permanecer abertas para o sistema funcionar.
echo ============================================================
timeout /t 5
