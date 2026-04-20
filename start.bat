@echo off
echo Starting Moderator Burnout Detection System...

echo Starting backend server...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
start cmd /k python main.py
cd ..

timeout /t 3 /nobreak

echo Starting frontend server...
cd frontend
call npm install
start cmd /k npm run dev
cd ..

echo.
echo Application started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo Close the terminal windows to stop the servers
pause
