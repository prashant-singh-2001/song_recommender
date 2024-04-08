@ECHO OFF

REM Start Docker Compose in detached mode
start /B docker-compose up --build

REM Wait for a few seconds for the service to be up
timeout /t 10 /nobreak

REM Open URL in default web browser
start http://localhost:3000/

PAUSE
