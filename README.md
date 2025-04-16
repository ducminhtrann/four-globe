# Project Setup & Usage Guide

## 📦 Install Dependencies
Create .env file

```bash
cp .env.example .env
```

Install deps

```bash
npm i
```

## 🐳 Run Docker (Create Database)

```bash
docker-compose up -d
```

## 🚀 Run the Project

```bash
npm run start:dev
```

Once the code is running, your terminal should show:

```
SERVICE IS RUNNING ON PORT: 3001
```

## 📚 Swagger API Docs

Access Swagger at:  
[http://localhost:3001/api-docs](http://localhost:3001/api-docs)

## 🗂 Codebase Structures

- `Controller` — API endpoints  
- `Service` — Business logic  
- `Entity` — Database schema  

## 🧩 ERD Diagram

See `erd.png` in the project root.

## 🧪 How to Test

1. **Register Account**  
   ➜ [Click Try it out](http://localhost:3001/api-docs#/Authentication/AuthController_register)

2. **Login and Get Access Token**  
   ➜ [Click Try it out](http://localhost:3001/api-docs#/Authentication/AuthController_login)

3. **Authorize**  
   - Copy the `access_token` from the login response.  
   - Click **Authorize** in Swagger and paste it.

4. **Create Post (Authentication Required)**  
   ➜ [Click Try it out](http://localhost:3001/api-docs#/Posts/PostController_createProduct)
4. **Get List Posts**  
   ➜ [Click Try it out](http://localhost:3001/api-docs#/Posts/PostController_getProducts)

5. **Similar for other endpoints**