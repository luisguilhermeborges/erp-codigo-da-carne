@echo off
setlocal enabledelayedexpansion
title CODIGO DA CARNE - GIT SYNC

:: Configuração de cores (Fundo azul escuro, texto branco brilhante)
color 1f

echo.
echo  ########################################################
echo  #                                                      #
echo  #      SISTEMA ERP CODIGO DA CARNE - GIT SYNC          #
echo  #                                                      #
echo  ########################################################
echo.

:: 1. Verificar status
echo [+] Verificando alteracoes...
git status -s
echo.

:: 2. Adicionar arquivos
echo [+] Preparando arquivos...
git add .

:: 3. Solicitar mensagem ou usar padrão
set /p msg=">> Digite o que foi feito (ou ENTER para automatico): "

if "!msg!"=="" (
    set msg=Atualizacao automatica em %date% %time%
)

echo.
echo [+] Realizando commit...
git commit -m "!msg!"

:: 4. Enviar para o servidor
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
