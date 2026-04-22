# <h1 align="center"> Vehicle Service Management System </h1>
<p align="center"> A full-stack web application to manage vehicle repairs, component usage, billing, and service tracking. </p>

---

##  Features

###  Component Management
- Add new components (New / Repair type)
- Update component price
- Soft delete components
- Prevent duplicate components

###  Vehicle Management
- Add vehicles with validation
- Normalize vehicle numbers (uppercase, no spaces)
- Prevent duplicate vehicles

###  Issue Management
- Add issues to vehicles
- Prevent duplicate issues for same vehicle
- Select resolution type:
  - New Component
  - Repair Service
- Attach components with quantity
- Update and delete issues
- Prevent duplicate component addition

###  Billing System
- Calculate total bill per vehicle
- Includes:
  - Component cost
  - Repair charges
- Detailed breakdown of each item

###  Revenue Tracking
- Daily revenue
- Monthly revenue
- Yearly revenue

###  Admin Panel
- Manage components
- View orders 
- Revenue dashboard

###  User Panel
- Add vehicles
- Report issues
- Select components/repair
- View billing
- Place service orders (in progress)

---

##  Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

### Frontend
- React.js
- Axios
- React Router

---

## 📂 Project Structure

```
vehicle-service-system/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   ├── main.py
│   └── database.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── .gitignore
└── README.md
```

## ⚙️ Setup Instructions

### Clone Repository
```
git clone https://github.com/your-username/vehicle-service-system.git
cd vehicle-service-system
```

## Backend Setup
### Step 1: Create Virtual Environment
```
cd backend
python -m venv venv
```

### Step 2: Activate Environment**Windows:**
```
venv\Scripts\activate
```

### Step 3: Install Dependencies
```
pip install -r requirements.txt
```

### Step 4: Run Backend Server
```
uvicorn main:app --reload
```

Backend will run on:
```
http://127.0.0.1:8000
```

##  Frontend Setup
###  Step 1: Go to Frontend
```
cd frontend
```
### Step 2: Install Dependencies
```
npm install
```
### Step 3: Run Frontend
```
npm start
```

Frontend will run on:
```
http://localhost:3000
```
## 🔗 API Endpoints (Sample)
### Components
- POST `/api/components`
- GET `/api/components`
- PATCH `/api/components/{id}/price`-
- DELETE `/api/components/{id}`

### Vehicles
- POST `/api/vehicles`-
- GET `/api/vehicles`

### Issues
- POST `/api/issues`-
- GET `/api/issues`-
- PUT `/api/issues/{id}`-
- DELETE `/api/issues/{id}`

### Issue Components
- POST `/api/issue-components`-
- PATCH `/api/issue-components/{id}`-
- DELETE `/api/issue-components/{id}`
-
### Billing
- GET `/api/vehicles/{vehicle_id}/bill`

### Revenue-
- GET `/api/revenue/daily`
- GET `/api/revenue/monthly`
- GET `/api/revenue/yearly`
