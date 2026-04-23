@echo off
TITLE ERP CDC - INICIALIZADOR COMPLETO
echo ============================================================
echo           SISTEMA DE PEDIDOS - CODIGO DA CARNE
echo ============================================================
echo.

echo [1/3] Iniciando Servidor BACKEND (API)...
start "BACKEND - ERP CDC" cmd /k "cd server && node index.js"

echo [2/3] Iniciando Interface FRONTEND (Vite)...
start "FRONTEND - ERP CDC" cmd /k "npm run dev"

echo [3/3] Abrindo Navegador...
:: Aguarda 3 segundos para dar tempo do servidor subir antes de abrir o browser
timeout /t 3 /nobreak > nul
start chrome "http://localhost:3000"

echo.
echo ============================================================
echo   Tudo pronto! O sistema abrira no Chrome em instantes.
echo   As janelas do CMD devem permanecer abertas para o sistema funcionar.
echo ============================================================
timeout /t 5
