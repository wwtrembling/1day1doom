@echo off
cd /d "%~dp0"
echo Starting Doom Generator...

if exist .env (
    for /f "tokens=*" %%a in (.env) do set %%a
)

python generator.py
echo Done.
pause
