@echo off

echo Start
cd /d %~dp0
node init-database.js

rem Check success or failure
if %errorlevel% equ 0 (
    echo Compile success
) else (
    echo Compile failed
)

rem Prevent the command window from closing
pause