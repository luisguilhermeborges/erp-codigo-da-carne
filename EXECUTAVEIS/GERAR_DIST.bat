@echo off
cd /d "%~dp0.."
TITLE ERP CDC - GERAR DIST (PRODUCAO)
color 0b

echo.
echo  ########################################################
echo  #                                                      #
echo  #      GERANDO VERSAO DE PRODUCAO (BUILD/DIST)         #
echo  #                                                      #
echo  ########################################################
echo.

echo [+] Limpando dist anterior...
if exist dist (
    rd /s /q dist
)

echo [+] Instalando dependencias (por seguranca)...
call npm install

echo.
echo [+] Iniciando Compilacao (Build)...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [!] ERRO NA COMPILACAO! Verifique os erros no terminal.
    color 4f
    pause
    exit /b
)

echo.
echo [OK] DIST GERADA COM SUCESSO!
echo Os arquivos estao na pasta /dist
echo.
color 2f
pause
