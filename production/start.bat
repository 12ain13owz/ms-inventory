@echo off
cd /d %~dp0

rem Start the Node.js application with PM2
echo Start Server
call npm run start:prod

rem Monitor the application with PM2
echo Monitor
call pm2 monit

rem Prevent the command window from closing
pause
