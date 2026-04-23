@echo off
cd /d "%~dp0.."
setlocal enabledelayedexpansion
title CODIGO DA CARNE - GIT SYNC
color 1f

echo.
echo  ########################################################
echo  #                                                      #
echo  #      SISTEMA ERP CODIGO DA CARNE - GIT SYNC          #
echo  #                                                      #
echo  ########################################################
echo.

echo [+] Verificando alteracoes...
git status -s
echo.

echo [+] Preparando arquivos...
git add .

set /p msg=">> Digite o que foi feito (ou ENTER para automatico): "

if "!msg!"=="" (
    set msg=Atualizacao automatica em %date% %time%
)

echo.
echo [+] Realizando commit...
git commit -m "!msg!"

echo.
echo [+] Enviando para o GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo [!] ERRO AO ENVIAR! Verifique sua conexao ou permissoes.
    color 4f
) else (
    echo.
    echo [OK] TUDO PRONTO! Alteracoes salvas com sucesso.
    color 2f
)

echo.
echo ========================================================
pause
