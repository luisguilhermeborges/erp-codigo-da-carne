@echo off
echo Iniciando o Backend...
start cmd /k "cd server && node index.js"

echo Iniciando o Frontend...
start cmd /k "npm run dev"

echo Tudo iniciado!
