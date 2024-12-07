@echo off
REM Start Backend in the background
echo Starting Backend in the background...
start /b "" cmd /c "cd backend && call mvnw.cmd spring-boot:run"

REM Start Frontend in the background
echo Starting Frontend in the background...
start /b "" cmd /c "cd frontend && ng serve"

REM Inform the user
echo Backend and Frontend are running in the background. Logs will appear below.
pause
