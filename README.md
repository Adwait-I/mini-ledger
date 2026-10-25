# MiniLedger 📱💰

MiniLedger is a full-stack mobile application to track money lent to friends, monitor repayments, and highlight overdue loans.

---

## 🏗 Tech Stack

- **Frontend:** React Native (Expo SDK, TypeScript, React Navigation Native Stack, TanStack React Query, Expo Image Picker, Expo Vector Icons)
- **Backend:** Node.js, Express, TypeScript, Zod, JWT
- **Database:** PostgreSQL (with Prisma ORM for schema, migrations, and typed queries)
- **Testing:** Jest + Supertest (unit & integration tests for summary and loan calculation logic)

## ⚡ Quick Start & Run Commands

You can run commands either from the project root or from inside each folder:

### 1. Run the Backend API Server
```bash
# From project root:
npm run dev:backend

# Or from backend folder:
cd backend
npm run dev
```
> Server runs on **`http://localhost:5001`**  
> Health check: `http://localhost:5001/api/health`

---

### 2. Run the Web Application (Port 5050)
```bash
# From project root:
npm run dev:frontend

# Or from frontend folder:
cd frontend
npm run web
```
> Open your browser at **`http://localhost:5050`**  
> The React Native web app will open automatically in your browser!

---

### 3. Run Automated Tests
```bash
# Run Jest tests:
npm run test

# Or from backend folder:
cd backend
npm test
```

---

### 4. Database Sync & Prisma Studio (Optional)
```bash
# Push schema changes to PostgreSQL:
npm run prisma:push

# Open Prisma visual database editor:
npm run prisma:studio
```

---

## 📁 Project Structure

```text
Miniledger/
├── .env                              # PostgreSQL connection config (root)
├── backend/
│   ├── .env                          # Backend environment variables
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   ├── prisma/
│   │   ├── schema.prisma             # User & LoanEntry Prisma models
│   │   └── migrations/               # PostgreSQL DDL migrations
│   │       └── 0_init/
│   │           └── migration.sql
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts                # Environment configuration
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts    # Request OTP & Verify OTP
│   │   │   ├── loan.controller.ts    # Get, Create, and Repay loans
│   │   │   └── summary.controller.ts # Portfolio summary metrics
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts    # Bearer JWT token verification
│   │   │   ├── error.middleware.ts   # Global error handling
│   │   │   └── validate.middleware.ts# Zod validation middleware
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── loan.routes.ts
│   │   │   ├── summary.routes.ts
│   │   │   └── index.ts              # Master API router (/api/...)
│   │   ├── services/
│   │   │   ├── auth.service.ts       # OTP generation & verification
│   │   │   ├── loan.service.ts       # Loan CRUD operations
│   │   │   └── summary.service.ts    # Summary calculation service
│   │   ├── utils/
│   │   │   ├── calculations.ts       # Pure calculations (overdue & summary)
│   │   │   └── prisma.ts             # Prisma client singleton
│   │   ├── validators/
│   │   │   ├── auth.validator.ts     # Zod schemas for Auth
│   │   │   └── loan.validator.ts     # Zod schemas for Loans
│   │   ├── app.ts                    # Express application factory
│   │   └── server.ts                 # Server entrypoint (port 5001)
│   └── tests/
│       ├── calculations.test.ts      # Pure calculation unit tests
│       └── summary.test.ts           # API integration tests
└── frontend/
    ├── app.json                      # Expo application metadata
    ├── package.json
    ├── tsconfig.json
    ├── App.tsx                       # Main entrypoint with providers
    └── src/
        ├── api/
        │   ├── client.ts             # Axios client with auth interceptor
        │   ├── auth.api.ts           # Auth API service
        │   └── loans.api.ts          # Loans & Summary API service
        ├── context/
        │   └── AuthContext.tsx       # Authentication state context
        ├── hooks/
        │   ├── useLoans.ts           # TanStack React Query loans hook
        │   └── useSummary.ts         # TanStack React Query summary hook
        ├── navigation/
        │   ├── AppNavigator.tsx      # Native stack router (Login -> Dashboard)
        │   └── types.ts              # Route param types
        ├── screens/
        │   ├── LoginScreen.tsx       # Phone + OTP login screen
        │   └── DashboardScreen.tsx   # Dashboard, summary card & loan list
        ├── components/
        │   ├── SummaryCard.tsx       # Total lent, repaid, overdue card
        │   ├── LoanCard.tsx          # Loan item card with overdue badge
        │   ├── AddLoanModal.tsx      # New loan modal with date presets
        │   └── ReceiptPicker.tsx     # Image picker for receipts
        ├── theme/
        │   └── colors.ts             # Cohesive color palette
        └── types/
            └── index.ts              # Shared TypeScript definitions
```

---

## 🗄️ Database Schema (Prisma)

### 1. `User` Model (`users` table)
- `id`: String (UUID, primary key)
- `phone_number`: String (unique)
- `created_at`: DateTime (default: `now()`)
- `loans`: One-to-many relation to `LoanEntry`

### 2. `LoanEntry` Model (`loan_entries` table)
- `id`: String (UUID, primary key)
- `user_id`: String (foreign key to `users.id`, `onDelete: Cascade`)
- `friend_name`: String
- `amount`: Float
- `due_date`: DateTime
- `status`: Enum (`PENDING`, `REPAID`)
- `receipt_url`: String (optional, receipt image URI or base64)
- `created_at`: DateTime (default: `now()`)

---

## 🚀 Getting Started

### 1. Database Setup (.env)
The PostgreSQL `.env` file is already created with your credentials:
```env
DATABASE_URL="postgresql://postgres:1977@localhost:5432/miniledger?schema=public"
PORT=5001
NODE_ENV=development
JWT_SECRET="miniledger_jwt_super_secret_key_1977_token"
JWT_EXPIRES_IN="7d"
```

To sync the schema with your local PostgreSQL database:
```bash
cd backend
npx prisma db push
```

### 2. Run Backend Server
```bash
cd backend
npm run dev
```
The server will start at `http://localhost:5001`.
- **Health check:** `http://localhost:5001/api/health`

### 3. Run Backend Tests
Run the Jest test suite covering calculation logic and API integration:
```bash
cd backend
npm test
```

### 4. Run Mobile App (Expo)
```bash
cd frontend
npm start
```
You can press:
- `i` to open in iOS Simulator
- `a` to open in Android Emulator
- `w` to open in Web Browser

---

## 🔑 Authentication Workflow
1. User enters their phone number on the **Login Screen**.
2. Press **"Send Login OTP"** (`POST /api/auth/request-otp`).
3. The backend generates a 6-digit OTP and prints it directly to the server terminal:
   ```text
   ======================================================
    [MOCK SMS SERVICE] - New OTP Generated
    Recipient Phone: +1 (555) 019-2834
    6-Digit OTP    : 849201
    Valid for      : 10 minutes (or use dev code: 123456)
   ======================================================
   ```
4. Enter the 6-digit OTP (or tap the **Autofill** button / use `123456`) and tap **"Verify & Sign In"** (`POST /api/auth/verify-otp`).
5. A JWT token is issued, and the user is navigated directly into the **Main Dashboard**.

---

## 📊 Summary & Overdue Calculation Logic
- **`total_lent`**: $\sum \text{amount}$ of all loans recorded by the authenticated user.
- **`total_repaid`**: $\sum \text{amount}$ of loans marked with `status === 'REPAID'`.
- **`overdue_amount`**: $\sum \text{amount}$ of loans with `status === 'PENDING'` AND $\text{due\_date} < \text{current date}$.
- In the mobile dashboard, overdue loans are dynamically highlighted with a warning badge and a red indicator border.
