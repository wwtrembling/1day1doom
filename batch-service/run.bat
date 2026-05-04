@echo off
cd /d "%~dp0"

if exist .env (
    for /f "tokens=*" %%a in (.env) do set %%a
)

call venv\Scripts\activate

echo Starting Career Evolution Tree generator...
python generator.py %*

deactivate
echo Done.
pause
