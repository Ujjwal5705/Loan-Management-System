# Loan Management System (LMS)

A full-stack Loan Management System built using the MERN stack with Next.js and TypeScript. The platform enables borrowers to apply for loans through a guided application flow while allowing internal operations teams to manage loans across their lifecycle using role-based dashboards.

## Features

### Borrower Portal

* User Registration & Login
* JWT Authentication
* Secure Password Hashing using bcrypt
* Personal Details Collection
* Business Rule Engine (BRE) Validation
* Salary Slip Upload (PDF/JPG/PNG)
* Loan Configuration
* Live Interest & Repayment Calculation
* Loan Application Submission
* Loan Tracking

### Operations Dashboard

#### Sales Module

* View registered borrowers who have not yet applied for loans
* Lead management workflow

#### Sanction Module

* View loan applications
* Approve loans
* Reject loans with rejection reason

#### Disbursement Module

* View sanctioned loans
* Mark loans as disbursed

#### Collection Module

* Record borrower payments
* Unique UTR validation
* Outstanding balance tracking
* Automatic loan closure on full repayment

### Role-Based Access Control (RBAC)

Supported Roles:

* Admin
* Sales
* Sanction
* Disbursement
* Collection
* Borrower

Permissions are enforced on both frontend and backend.

---

# Tech Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Axios
* React Hook Form
* Zod

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* Multer

---

# Business Rule Engine (BRE)

The system validates borrower eligibility before allowing loan applications.

### Eligibility Rules

| Rule           | Condition                       |
| -------------- | ------------------------------- |
| Age            | Must be between 23 and 50 years |
| Monthly Salary | Minimum ₹25,000                 |
| PAN            | Must match valid PAN format     |
| Employment     | Applicant cannot be unemployed  |

### PAN Validation Regex

```regex
^[A-Z]{5}[0-9]{4}[A-Z]{1}$
```

#### Example:
```text
ABCDE1234F
```

### Loan Calculation
- Interest Rate: 12% per annum

#### Simple Interest Formula:

```text
SI = (P × R × T) / (365 × 100)
```

Where:
- P = Principal Amount
- R = Interest Rate
- T = Tenure in Days

Total Repayment:

```text
Total Repayment = Principal + Interest
```

### Loan Lifecycle
```text
APPLIED
   ↓
SANCTIONED
   ↓
DISBURSED
   ↓
CLOSED
```

Rejected loans move to:
```text
REJECTED
```

### Project Structure
```text
loan-management-system/

├── frontend
│   ├── app
│   ├── components
│   ├── lib
│   ├── hooks
│   └── types
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── seed
│   │   ├── utils
│   │   └── server.ts
│   │
│   └── uploads
│
└── README.md
```

### Database Design
#### User
```text
User
├── fullName
├── email
├── password
└── role
```

#### Borrower Profile
```text
BorrowerProfile
├── fullName
├── PAN
├── DOB
├── monthlySalary
├── employmentMode
├── salarySlip
└── brePassed
```

#### Loan
```text
Loan
├── borrowerId
├── amount
├── tenureDays
├── interestRate
├── interestAmount
├── totalRepayment
├── totalPaid
├── outstandingBalance
├── status
└── timestamps
```

#### Payment
```text
Payment
├── loanId
├── utr
├── amount
├── paymentDate
└── collectedBy
```

### API Overview
#### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

#### Borrower
```http
POST /api/borrower/profile
POST /api/borrower/upload-slip
POST /api/loan/preview
POST /api/loan/apply
GET  /api/loan/my-loans
```

#### Sales
```http
GET /api/sales/leads
```

#### Sanction
```http
GET   /api/sanction/loans
PATCH /api/sanction/:id/approve
PATCH /api/sanction/:id/reject
```

#### Disbursement
```http
GET   /api/disbursement/loans
PATCH /api/disbursement/:id/disburse
```

#### Collection
```http
POST /api/collection/payment
```

### Local Setup
#### Clone Repository
```bash
git clone <repository-url>
cd loan-management-system
```

#### Backend Setup
```bash
cd backend

npm install
```

Create .env

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/lms

JWT_SECRET=your_secret_key
```

Run Backend

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

### Seed Credentials
Run:

```bash
npm run seed
```

Default Password:
```text
Password@123
```

| Role         | Email                     |
| ------------ | ------------------------- |
| Admin        | admin@lms.com             |
| Sales        | sales@lms.com             |
| Sanction     | sanction@lms.com          |
| Disbursement | disbursement@lms.com      |
| Collection   | collection@lms.com        |


### Security Features
- JWT Authentication
- Password Hashing using bcrypt
- Backend Role Validation
- Frontend Route Protection
- File Upload Validation
- Unique UTR Enforcement
- BRE-Based Eligibility Checks
- Protected APIs
- Input Validation

### Future Improvements
- Refresh Tokens
- Email Notifications
- Audit Logs
- Loan Statements
- AWS S3 File Storage
- Docker Deployment
- CI/CD Pipeline
- Loan Analytics Dashboard

### Demo Flow
```text
Borrower Registration
        ↓
BRE Validation
        ↓
Salary Slip Upload
        ↓
Loan Application
        ↓
Sanction Approval
        ↓
Disbursement
        ↓
Payment Collection
        ↓
Automatic Loan Closure
```

## Author
### Ujjwal Sharma
