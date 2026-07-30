@echo off
title InSight Feedback Platform — Local Server
echo ========================================================
echo   Starting InSight Feedback & Bug Platform Local Server
echo ========================================================
echo.
echo Setting up local runtime environment...
set PATH=D:\node_env\node-v22.14.0-win-x64;%PATH%

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo Server is running! Keep this window open while using the app.
echo Press CTRL+C when you want to stop the server.
echo.
npm.cmd run dev
