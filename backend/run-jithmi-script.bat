@echo off
echo 🚀 Running Jithmi Data Addition Script...
echo.
echo 📅 This will add monthly measurements from November 2022 to December 2024
echo 📊 Using realistic WHO growth standards for girls 0-2 years
echo.
echo ⚠️  Make sure your MongoDB is running and .env file is configured
echo.
pause
echo.
node add-jithmi-data.js
echo.
pause


