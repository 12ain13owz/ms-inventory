@echo off

rem Build angular
echo Build Frontend
cd /d %~dp0
cd frontend
call ng build

rem Build nodejs
echo Build Backend
cd /d %~dp0
cd backend
call npm run build


rem Copy backend/dist and backend/src/templates to the build directory
echo Copying backend/dist and backend/src/templates to build directory
xcopy /E /I /Y "%~dp0backend\dist" "%~dp0build\dist"
xcopy /E /I /Y "%~dp0backend\src\templates" "%~dp0build\src\templates"

rem Check success or failure
if %errorlevel% equ 0 (
    echo Compile success
) else (
    echo Compile failed
)

rem Prevent the command window from closing
pause
