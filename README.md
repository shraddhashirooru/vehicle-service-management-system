# <h1 align="center"> Vehicle Service Management System </h1>
<p align="center"> A full-stack web application to manage vehicle repairs, component usage, billing, service tracking and billing with an admin dashboard. </p>

## 🌐 Live Demo

* 🔗 Frontend: https://vehicle-service-management-system-uxn3.onrender.com
* 🔗 Backend API Docs: https://vehicle-service-backend-pflq.onrender.com/docs

---

## Features

### User Panel

* Add and manage vehicles
* Report issues for vehicles
* Choose service type:

  * New Component
  * Repair Service
* View billing details before placing order
* Place service requests
* Track **ongoing and completed services**
* Expand orders to view full details

---

### Admin Panel

#### Component Management

* Add new components
* Types:

  * New
  * Repair
* Update component pricing
* Delete components (soft delete)
* Prevent duplicate components

---

#### Dashboard

* View all **pending orders**
* Separate sections:

  * Item Orders
  * Repair Orders
* Expand each order to see:

  * Vehicle details
  * Total amount
  * Order date
* Mark orders as:

  * ✅ Delivered (Items)
  * ✅ Completed (Repairs)

---

#### Orders Section

* View **all orders (Pending + Completed)**
* Separate tabs:

  * Items
  * Repairs
* View full order details
* Track order status history

---

#### Revenue Dashboard

* Daily revenue
* Monthly revenue
* Yearly revenue

---

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* SQLite

### Frontend

* React.js
* Axios
* React Router
* Recharts

### Deployment

* Frontend & Backend hosted on Render

---

## Project Structure

```
vehicle-service-management-system/
│
├── backend/
│   ├── models/
│   │   ├── component.py
│   │   ├── vehicle.py
│   │   ├── issue.py
│   │   ├── issue_component.py
│   │   └── service_record.py
│   │
│   ├── routes/
│   │   ├── component.py
│   │   ├── vehicle.py
│   │   ├── issue.py
│   │   └── service.py
│   │
│   ├── schemas/
│   │   ├── component.py
│   │   ├── vehicle.py
│   │   ├── issue.py
│   │   ├── issue_component.py
│   │   └── service_record.py
│   │
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ComponentDetails.jsx
│   │   │   ├── ComponentForm.jsx
│   │   │   ├── ComponentList.jsx
│   │   │   ├── IssueForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   ├── VehicleForm.jsx
│   │   │   ├── Purchases.jsx
│   │   │   └── AdminVehicles.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── RoleSelect.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Vehicles.jsx
│   │   │   ├── Issues.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ItemOrders.jsx
│   │   │   ├── RepairOrders.jsx
│   │   │   ├── ComponentManagement.jsx
│   │   │   └── Revenue.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── App.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── .gitignore
└── README.md
```
---

## Setup Instructions

### Clone Repository

```
git clone https://github.com/shraddhashirooru/vehicle-service-management-system.git
cd vehicle-service-management-system
```

---

## Backend Setup

### 1. Create Virtual Environment

```
cd backend
python -m venv venv
```

### 2. Activate Environment

**Windows:**

```
venv\Scripts\activate
```

### 3. Install Dependencies

```
pip install -r requirements.txt
```

### 4. Run Backend

```
uvicorn main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

## Frontend Setup

### 1. Navigate to frontend

```
cd frontend
```

### 2. Install dependencies

```
npm install
```

### 3. Create `.env`

```
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

### 4. Run frontend

```
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## Production Environment

In deployment (Render), set:

```
REACT_APP_API_URL=https://vehicle-service-backend-pflq.onrender.com/api
```

---

## Admin Login

```
Username: admin
Password: admin123
```

---

## API Endpoints

### Components

* POST `/api/components`
* GET `/api/components`
* PATCH `/api/components/{component_id}/price`
* DELETE `/api/components/{component_id}`

---

### Vehicles

* POST `/api/vehicles`
* GET `/api/vehicles`
* UPDATE `/api/vehicles/{vehicle_id}`
* DELETE `/api/vehicles/{vehicle_id}`

---

### Issues

* POST `/api/issues`
* GET `/api/issues`
* PUT `/api/issues/{issue_id}`
* DELETE `/api/issues/{issue_id}`

---

### Issue Components
* POST `/api/issues-components`
* PATCH `/api/issues-components/{id}`
* DELETE `/api/issues-components/{id}`

---

### Services

* POST `/api/service-records`
* GET `/api/service-records`
* PATCH `/api/service-records/{service_id}`

---

### Billing

* GET `/api/vehicles/{vehicle_id}/bill`

---

### Revenue

* GET `/api/revenue/daily`
* GET `/api/revenue/monthly`
* GET `/api/revenue/yearly`

---

## Key Highlights

* Full-stack application with real-time API integration
* Clean separation of Admin and User workflows
* Expandable UI for detailed order tracking
* Proper error handling and API validation
* Deployment-ready with environment configuration
* Solved real-world issues:

  * Routing on deployment
  * Environment variables
  * API integration bugs
