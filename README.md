# Petrol Pump Management System

A comprehensive petrol pump management system with separate frontend and backend, built with React and Node.js/Express.

## 🚀 Quick Start - MySQL Database

This application now uses **MySQL** as the primary database for better performance, reliability, and scalability.

📖 **[Read Quick Start Guide →](QUICK_START_MYSQL.md)**
📖 **[Read Detailed MySQL Setup →](MYSQL_SETUP_GUIDE.md)**

### Super Quick Start with Docker
```bash
docker-compose up -d
```
That's it! Everything is configured automatically.

## Features

- User authentication and authorization
- Master data management (employees, fuel products, vendors, etc.)
- Day business operations (sales, expenses, credit sales, etc.)
- Invoice generation and management
- Comprehensive reporting system
- Role-based permissions
- **MySQL database with 20+ pre-configured tables**
- Secure API with JWT authentication
- Encrypted sensitive data
- Logging and monitoring

## Project Structure

```
/
├── frontend/          # React frontend (src/)
├── backend/           # Node.js/Express backend
│   ├── routes/        # API routes
│   ├── utils/         # Utilities (crypto, logger)
│   └── server.js      # Main server file
├── public/            # Static assets
└── package.json       # Frontend dependencies
```

## Setup Instructions

### Quick Start with Docker (Recommended for Production)

**Prerequisites:**
- Docker Engine (v20.10 or higher)
- Docker Compose (v2.0 or higher)

**Deploy in 3 simple steps:**

1. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set secure JWT_SECRET and ENCRYPTION_KEY
   ```

2. **Deploy using helper script:**
   
   **Linux/Mac:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
   
   **Windows:**
   ```cmd
   deploy.bat
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

📖 **For detailed Docker deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**

---

### Manual Setup (Development)

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Setup MySQL Database**
   
   See [`QUICK_START_MYSQL.md`](QUICK_START_MYSQL.md) for MySQL setup instructions.
   
   Quick option with Docker:
   ```bash
   docker-compose up -d mysql
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. The `.env` file in the root directory contains MySQL configuration:
   ```
   DB_HOST=localhost
   DB_USER=petrol_user
   DB_PASSWORD=petrol_password
   DB_NAME=petrol_pump
   JWT_SECRET=your_jwt_secret_key
   ENCRYPTION_KEY=your_encryption_key
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   ```

5. Initialize database (if not using Docker):
   ```bash
   node database/init-mysql.js
   ```

6. Start the backend server:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install frontend dependencies (from root directory):
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/permissions/:roleName` - Get role permissions

### Master Data
- `GET /api/master/employees` - Get all employees
- `POST /api/master/employees` - Create employee
- `PUT /api/master/employees/:id` - Update employee
- `DELETE /api/master/employees/:id` - Delete employee
- Similar endpoints for other master data (fuel-products, lubricants, credit-parties, vendors, tanks, nozzles, etc.)

### Day Business
- `GET /api/day-business/assigning` - Get day assignments
- `POST /api/day-business/assigning` - Create day assignment
- `GET /api/day-business/sale-rates` - Get sale rates
- `POST /api/day-business/sale-rates` - Create sale rate
- Similar endpoints for sale-entries, lubricants-sale, swipe, credit-sale, expenses, recovery, opening-stock, settlement

### Reports
- `GET /api/reports/all-credit-customer` - All credit customer report
- `GET /api/reports/attendance` - Attendance report
- `GET /api/reports/business-flow` - Business flow report
- `GET /api/reports/customer-statement/:customer_id` - Customer statement
- `GET /api/reports/daily-rate-history` - Daily rate history
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/lubricants-stock` - Lubricants stock report
- `GET /api/reports/purchase` - Purchase report

### Invoices
- `GET /api/invoices/liquid-purchase` - Get liquid purchase invoices
- `POST /api/invoices/liquid-purchase` - Create liquid purchase invoice
- `GET /api/invoices/lube-purchase` - Get lube purchase invoices
- `POST /api/invoices/lube-purchase` - Create lube purchase invoice
- `GET /api/invoices/sales` - Get sales invoices
- `POST /api/invoices/sales` - Create sales invoice

## Security Features

- JWT-based authentication
- Password hashing and verification
- Data encryption for sensitive information
- CORS protection
- Rate limiting
- Input validation and sanitization
- Security logging
- Role-based access control

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

### Building for Production
```bash
# Build frontend
npm run build

# Build backend (if needed)
cd backend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.