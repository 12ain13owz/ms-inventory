@echo off
cd /d %~dp0


rem Down application with PM2
echo Down Server
call pm2 delete ms-inventory

rem Prevent the command window from closing
pause
