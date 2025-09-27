<h1 align="center">A21 AI: Sales Analytics Dashboard</h1>

<p align="center">
  <strong>A modern full-stack application for CSV data visualization and analytics</strong>
</p>

<br />

<p align="center">
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router"/>
    <img src="https://img.shields.io/badge/Recharts-8884D8?style=for-the-badge&logo=chart.js&logoColor=white" alt="Recharts"/>
    <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white" alt="Radix UI"/>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/Multer-FF6600?style=for-the-badge&logo=multer&logoColor=white" alt="Multer"/>
    <img src="https://img.shields.io/badge/CORS-000000?style=for-the-badge&logo=cors&logoColor=white" alt="CORS"/>
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT"/>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/CSV_Parser-4CAF50?style=for-the-badge&logo=csv&logoColor=white" alt="CSV Parser"/>
    <img src="https://img.shields.io/badge/Bcrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white" alt="Bcrypt"/>
    <img src="https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React"/>
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/SigNoz-FF6B35?style=for-the-badge&logo=signoz&logoColor=white" alt="SigNoz APM"/>
    <img src="https://img.shields.io/badge/Wazuh-005571?style=for-the-badge&logo=wazuh&logoColor=white" alt="Wazuh SIEM"/>
    <img src="https://img.shields.io/badge/HashiCorp_Vault-000000?style=for-the-badge&logo=vault&logoColor=white" alt="HashiCorp Vault"/>
    <img src="https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white" alt="Cypress E2E"/>
    <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman Collection"/>
</p>

<br />

<br />

## 🎨 Screenshots

<div align="center">

**Desktop Dashboard**
<img width="100%" alt="Desktop Dashboard" src="https://ibb.co/gFM7N1V9" />

**Mobile View**
<img width="300" alt="Mobile Dashboard" src="https://ibb.co/ymw5NpYj" />

</div>

<br />

## 🚀 Features

- **📊 Interactive Charts** - Bar, Donut, Line charts with real-time data
- **📋 Smart Data Tables** - Sortable, filterable, paginated CSV views
- **🌓 Dark/Light Mode** - Theme switching with system preference
- **📱 Responsive Design** - Optimized for all devices
- **📤 CSV Upload** - Secure file processing with validation
- **🧮 Advanced Analytics** - Summaries, insights, and statistics
- **🔍 Query Engine** - Filter, search, sort data efficiently
- **📡 REST APIs** - Clean endpoints for frontend integration

<br />

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Recharts, Radix UI, React Router

**Backend:** Express.js, MongoDB, Multer, CSV Parser, JWT, Bcrypt

<br />

## 📁 Project Structure

```
a21-mvp/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/        # Data visualization components
│   │   │   │   ├── CategoryDonutChart.jsx
│   │   │   │   ├── MonthlySalesChart.jsx
│   │   │   │   └── SalesBarChart.jsx
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── Header.jsx     # Navigation with theme toggle
│   │   │   └── SummaryCards.jsx # KPI summary cards
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # Main analytics dashboard
│   │   │   └── HomePage.jsx   # Welcome page
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx # Theme management
│   │   └── App.jsx
│   └── package.json
├── server/                    # Express.js Backend
│   ├── config/
│   │   ├── database.js        # Database configuration
│   │   └── multer.js          # File upload configuration
│   ├── controllers/
│   │   ├── dataController.js  # Data analytics logic
│   │   └── uploadController.js # File upload handling
│   ├── middleware/
│   │   ├── cors.js            # CORS configuration
│   │   └── errorHandler.js    # Error handling middleware
│   ├── models/
│   │   └── CsvModel.js        # Data models
│   ├── routes/
│   │   ├── dataRoutes.js      # Data API endpoints
│   │   ├── uploadRoutes.js    # Upload API endpoints
│   │   └── index.js           # Route aggregation
│   ├── utils/
│   │   └── dataAnalyzer.js    # Analytics utilities
│   ├── uploads/               # CSV file storage
│   └── server.js              # Main server file
└── README.md
```

<br />

## 🚀 Getting Started

**Prerequisites:** Node.js v18+, npm/yarn

### Installation

```bash
# Clone repository
git clone https://github.com/prateek-bka/a21-mvp
cd a21-mvp

# Setup Backend (Terminal 1)
cd server && npm install && npm run dev
# Server: http://localhost:8000

# Setup Frontend (Terminal 2)
cd client && npm install && npm run dev
# Frontend: http://localhost:5173
```

### 🛠️ Available Scripts

```bash
# Frontend
npm run dev    # Development

# Backend
npm start      # Development
```

<br />

## 🔧 Configuration

```env
# .env file
PORT=8000
MAX_FILE_SIZE=10485760
```

**File Upload:** 10MB limit, CSV only, local storage

<br />

## 📊 How It Works

**Upload** → **Process** → **Analyze** → **Visualize**

1. Upload CSV file through POSTMAN (/upload) endpoint
2. Backend validates and processes data
3. Generate analytics and insights based on uploaded CSV
4. Display interactive charts and tables

<br />

## 📡 API Documentation

The backend server provides a comprehensive REST API for CSV data management and analytics. All endpoints return JSON responses with consistent error handling.

**Base URL:** `http://localhost:8000`

### 📤 Upload CSV File

```http
POST /upload
Content-Type: multipart/form-data
```

**Request Body:**

- `file` (required) - CSV file (max 10MB)

**Success Response (200):**

```json
{
  "message": "CSV file uploaded and saved successfully",
  "file": {
    "originalName": "sales_data.csv",
    "savedAs": "file-1234567890.csv",
    "size": 15420,
    "rowCount": 150,
    "headers": ["Date", "Product", "Region", "SalesAmount"]
  },
  "uploadedAt": "2024-01-15T10:30:00.000Z"
}
```

<img width="100%" alt="Desktop Dashboard" src="https://ibb.co/nNx1CpXV" />

### 📊 Get Data Summary & Analytics

```http
GET /data-summary
```

**Success Response (200):**

```json
{
  "message": "Data summary generated successfully",
  "summary": {
    "totalRecords": 150,
    "totalSales": 125000.50,
    "averageSale": 833.34,
    "topRegion": "North",
    "topProduct": "Product A"
  },
  "charts": {
    "salesByRegion": [
      { "name": "North", "value": 45000 },
      { "name": "South", "value": 38000 }
    ],
    "salesByCategory": [
      { "name": "Electronics", "value": 60000 },
      { "name": "Clothing", "value": 40000 }
    ],
    "monthlySalesTrend": [
      { "month": "Jan", "sales": 25000 },
      { "month": "Feb", "sales": 28000 }
    ]
  },
  "csvData": {
    "headers": ["Date", "Product", "Region", "SalesAmount"],
    "data": [...]
  }
}
```

<img width="100%" alt="Desktop Dashboard" src="https://ibb.co/0j7nHJQXV" />

### 🔍 Query CSV Data

```http
POST /query
Content-Type: application/json
```

**Request Body:**

```json
{
  "filters": { "Region": "North" },
  "search": "electronics",
  "sortBy": "SalesAmount",
  "sortOrder": "desc",
  "limit": 50,
  "offset": 0,
  "queryType": "standard"
}
```

**Special Query Types:**

- `standard` - Basic filtering and searching
- `top_products` - Top performing products analysis
- `sales_trend` - Sales trend analysis over time
- `region_analysis` - Regional performance comparison

**Success Response (200):**

```json
{
  "message": "Query executed successfully",
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  },
  "headers": ["Date", "Product", "Region", "SalesAmount"],
  "filters": { "Region": "North" },
  "search": "electronics"
}
```

### 📋 Get All Uploads

```http
GET /all-uploads
```

**Success Response (200):**

```json
{
  "message": "Uploaded CSV files retrieved successfully",
  "files": [
    {
      "filename": "file-1234567890.csv",
      "originalName": "sales_data.csv",
      "size": 15420,
      "uploadedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

<img width="100%" alt="Desktop Dashboard" src="https://ibb.co/G38J5pSw" />

### 🚨 Error Response Format

All API endpoints use consistent error response structure:

```json
{
  "error": "ValidationError",
  "message": "Invalid CSV format",
  "details": "Missing required headers or malformed data",
  "statusCode": 400
}
```

<br />

## 📮 Postman Collection

**Ready-to-use API testing collection with sample requests and responses**

<div align="center">
<img width="100%" alt="Postman Collection Overview" src="https://ibb.co/G38J5pSw" />
</div>

### 🚀 Quick Setup

1. **Download Collection**

   ```bash
   # Download the collection file
   curl -O https://github.com/prateek-bka/a21-mvp/A21 MVP.postman_collection.json
   ```

2. **Import to Postman**

   - Open Postman → Import → Upload Files
   - Select the downloaded collection file
   - Collection will appear in your workspace

3. **Set Environment Variables**

   ```json
   {
     "base_url": "http://localhost:8000"
   }
   ```

### 📋 Included Requests

**📤 File Upload**

- Upload CSV file with validation

**📊 Data Analytics**

- Get data summary and charts

**🔍 Query Operations**

- Filter and search CSV data
- Pagination and sorting examples

**📋 File Management**

- List all uploaded files

### 🎯 Features

- **Pre-configured Requests** - All endpoints ready to test
- **Sample Responses** - Expected response formats included
- **Environment Variables** - Easy server switching
- **Test Scripts** - Automated response validation
- **Documentation** - Inline API documentation

<br />

## 📊 Analytics Features

**Charts:** Bar, Donut, Line charts with real-time data

**Statistics:** Total records, sales, averages, top performers, trends

**Query Engine:** Full-text search, filters, sorting, pagination

**Processing:** Real-time analytics, statistical analysis, trend detection

<br />

## 🏗️ Architecture

**Components:** Controllers, Routes, Models, Utils, Config, Middleware

**Pipeline:** Upload → Parse → Validate → Analyze → Cache → Respond

<br />

## 🛡️ Error Handling

**Validation:** File type, size (10MB max), CSV structure

**API Errors:** Consistent JSON responses with status codes

<br />

### 🔧 Production

**Storage:** AWS S3/Google Cloud, MongoDB Atlas, Redis caching
**Infrastructure:** nginx load balancing, Winston logging

<br />

## ⚡ Future Optimizations

**Frontend:** Code splitting, image optimization, virtual scrolling

**Backend:** Stream processing, database indexing, response compression

**Scalability:** Horizontal scaling, microservices ready, queue system

<br />

## 🔍 Infrastructure Monitoring & Security

### 📊 SigNoz APM - Application Performance Monitoring APM with Real Time Infrastructure Monitoring

<div align="center">
<img width="100%" alt="SigNoz APM Dashboard" src="https://ibb.co/hJ1dLXky" />
<img width="100%" alt="SigNoz APM Dashboard" src="https://ibb.co/DfWKdNzP" />
<img width="100%" alt="SigNoz APM Dashboard" src="https://ibb.co/7N4kqmnV" />
</div>

**Features:**

- **📈 Real-time Metrics** - API latency, throughput, error rates
- **🔍 Distributed Tracing** - End-to-end request tracking
- **📊 Custom Dashboards** - Infrastructure and application metrics
- **🚨 Alerting** - Proactive monitoring with notifications

### 🛡️ Wazuh SIEM - Security Compliance & Monitoring

<div align="center">
<img width="100%" alt="Wazuh Security Dashboard" src="https://ibb.co/bMLcDYyV" />
<img width="100%" alt="Wazuh Security Dashboard" src="https://ibb.co/BVjcKpjb" />
</div>

**Features:**

- **🔐 Security Monitoring** - Real-time threat detection
- **📋 Compliance** - PCI DSS, GDPR, HIPAA standards
- **🚨 Incident Response** - Automated security alerts
- **📊 Security Analytics** - Log analysis and correlation

### 🔐 HashiCorp Vault - Secrets Management

<div align="center">
<img width="100%" alt="Wazuh Security Dashboard" src="https://ibb.co/9X2zkjb" />
</div>

**Features:**

- **🔑 Secret Storage** - Encrypted API keys, passwords, certificates
- **🔄 Dynamic Secrets** - Temporary database credentials
- **🛡️ Access Control** - Policy-based secret access
- **🔍 Audit Logging** - Complete secret access history

### 🧪 Cypress E2E Testing - End-to-End Test Automation

<div align="center">
<img width="100%" alt="Cypress E2E Testing Dashboard" src="https://ibb.co/ZRL4ts30" />
<img width="100%" alt="Cypress Test Runner" src="https://docs.cypress.io/img/accessibility/get-started/cypress-accessibility-overview.png" />
</div>

**Features:**

- **🔄 Automated Testing** - Complete user journey validation
- **📊 Dashboard Testing** - Chart interactions and data visualization
- **📤 File Upload Testing** - CSV upload and processing workflows
- **🌓 Theme Testing** - Dark/light mode switching validation
- **📱 Responsive Testing** - Cross-device compatibility checks
- **🔍 API Testing** - Backend endpoint validation and error handling
- **📈 Performance Testing** - Load time and interaction metrics
- **🚨 Visual Regression** - UI consistency across updates

**Test Coverage:**

- User authentication flows
- CSV file upload and validation
- Data visualization rendering
- Chart interactions and filtering
- Mobile responsiveness
- Error handling scenarios
- API endpoint integration
- Theme switching functionality

<br />

<br />

## 🧪 Testing

- [ ] CSV upload & visualization
- [ ] Responsive design & themes
- [ ] Error handling & API responses

<br />

<br />

<h3 align="center"><b>👨‍💻 Prateek Agrawal</b></h3>
<p align="center">
<a href="https://linkedin.com/in/prateek-bka">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>
<a href="https://github.com/prateek-bka">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
<a href="mailto:prateek.bka@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
</a>
</p>

<br />

<p>
  <strong>Built with ❤️ using React, Express.js, and modern web technologies</strong>
</p>

<p>
  Give a ⭐️ if you like this project!
</p>
