# Personal Finance Tracker

A full-stack personal finance management application built with **Laravel 12** (Backend) and **React + Vite** (Frontend).

## Features
- **Authentication**: Secure login and registration using Laravel Sanctum.
- **Dashboard**: Visual overview of income, expenses, and current balance using Recharts.
- **Transaction Management**: Create, edit, and delete income/expense transactions.
- **Categories**: Organize transactions with custom categories.
- **Premium UI**: Modern, responsive design using Tailwind CSS v4 and Lucide icons.

---

## 🛠 Prerequisites
- **PHP**: ^8.2
- **Composer**: ^2.0
- **Node.js**: ^18.0
- **npm**: ^9.0
- **MySQL**: ^8.0

---

## 🚀 Setting Up the Application

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Expense Tracker"
```

### 2. Backend Setup (Laravel)
```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate Application Key
php artisan key:generate

# Configure your database in .env
# DB_DATABASE=personal_finance_db
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run database migrations
php artisan migrate

# Start the Laravel server
php artisan serve
```
The backend will be running at `http://localhost:8000`.

### 3. Frontend Setup (React)
```bash
cd ../frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will be running at `http://localhost:5173`.

---

## ⚙️ Environment Configuration

### Backend (.env)
Ensure your `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` are set correctly to allow authentication from the frontend:
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### Frontend (.env)
If you need to change the API URL, update it in the code or create a `.env` in the frontend folder:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📂 Project Structure
- `/backend`: Laravel 12 API, database migrations, and models.
- `/frontend`: React + Vite application, Tailwind CSS v4 styling.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
