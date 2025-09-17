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
cd ClientApp
npm install
npm start


Optional seed sample data in ternimal 
curl -X POST http://localhost:5170/api/users \
-H "Content-Type: application/json" \
-d '{"username": "Alice"}'

curl -X POST http://localhost:5170/api/users \
-H "Content-Type: application/json" \
-d '{"username": "Bob"}'
