@echo off
cd /d "%~dp0.."
TITLE ERP CDC - BACKEND SERVER
color 0a
echo ========================================
echo   INICIANDO SERVIDOR BACKEND (API)
echo ========================================
cd server
node index.js
pause
