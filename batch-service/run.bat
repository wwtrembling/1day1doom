@echo off
cd /d "%~dp0"

if exist .env (
    for /f "tokens=*" %%a in (.env) do set %%a
)

call venv\Scripts\activate

set COUNT=%1
if "%COUNT%"=="" set COUNT=1

echo Starting Doom Generator... (x%COUNT%)
for /L %%i in (1,1,%COUNT%) do (
    echo.
    echo ===== Run %%i / %COUNT% =====
    python generator.py
)

deactivate
echo Done.
pause
