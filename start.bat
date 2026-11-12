@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Install it from nodejs.org, restart the computer and run this file again.
  pause
  exit /b
)

if not exist "%~dp0.env" (
  > "%~dp0.env" echo GIGACHAT_AUTH_KEY=PASTE_KEY_HERE
  >> "%~dp0.env" echo GIGACHAT_INSECURE=1
  echo Notepad will open. Replace PASTE_KEY_HERE with your key, press Ctrl+S and close Notepad.
  start "" /wait notepad "%~dp0.env"
)

start "" http://127.0.0.1:3000/tools.html
node server.js
pause
