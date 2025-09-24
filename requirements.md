# WAPP Assignment – Requirements & Setup Guide

This project consists of a **.NET 8 Web API backend** and a **React frontend**.  
Follow the steps below to install everything and run locally.

---

## ✅ Requirements

### 1. Backend (ASP.NET Core)
- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- Entity Framework Core tools (for database migrations)
  ```bash
  dotnet tool install --global dotnet-ef

### 2. Frontend (React)
-Node.js LTS
 (>= 18.x recommended)

-npm (comes with Node.js)

Steps to installation
1. git clone https://github.com/KTECeline/wapp_assignment.git
cd wapp_assignment

2. Backend setup
cd Server
dotnet restore
dotnet ef database update   # creates the SQLite database (app.db)
dotnet run

Example endpoint: http://localhost:5170/api/users

3. Frontend setup
cd frontend
npm install
npm start


Optional seed sample data in ternimal 
curl -X POST http://localhost:5170/api/users \
-H "Content-Type: application/json" \
-d '{"username": "Alice"}'

curl -X POST http://localhost:5170/api/users \
-H "Content-Type: application/json" \
-d '{"username": "Bob"}'

4. Tailwind setup

4.1 cd C:\Users\<you>\Desktop\WAPP\wapp_assignment\frontend
4.2 npm uninstall tailwindcss @tailwindcss/postcss postcss autoprefixer
4.3 npm install -D tailwindcss@3 postcss autoprefixer
4.4 npx tailwindcss init
4.5 go to tailwind.config.js file
paste this:
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

4.6 go to src/index.css gilr
paste this:
@tailwind base;
@tailwind components;
@tailwind utilities;

4.7 at top of arc/index.js file
add this
import './index.css';

5. Add custom fonts
5.1 go to public/index.html, inside the <head>
add this:
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    rel="stylesheet">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Ibarra+Real+Nova:ital,wght@0,400..700;1,400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    rel="stylesheet">

5.2 go to tailwind.config.js file
paste this for theme:
theme: {
  extend: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],                 // 👈 for body / UI
      ibarra: ["Ibarra Real Nova", "serif"],          // 👈 for titles
    },
  },
},





