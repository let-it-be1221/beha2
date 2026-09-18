# Beha Marketing PLC - Operational Guideline & Role-Based Dashboard System

Comprehensive Enterprise ERP & Real Estate Brokerage Operating System built according to the **Beha Marketing PLC Operational Guidelines (Articles 1 - 25)**, featuring **8 Specialized Role-Based Dashboards**, strict **Article 22 Salary & Commission Distribution Rules**, **Prisma Database Schema**, and **REST API Backend**.

---

## 📑 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [The 8 Role-Based Dashboards](#the-8-role-based-dashboards)
3. [Article 22: Salary and Commission Distribution](#article-22-salary-and-commission-distribution)
4. [Prisma Schema & Database Models](#prisma-schema--database-models)
5. [REST API Endpoints](#rest-api-endpoints)
6. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
7. [Installation & Setup Guide](#installation--setup-guide)
8. [Default Seeded Credentials](#default-seeded-credentials)

---

## 🏛️ Architecture Overview

The system mirrors the organizational decimal hierarchy established in the Beha Operational Guidelines:
- **Root Executive Structure**: Chief Executive Officer (CEO) — Highest authority, sole signatory for disbursements and developer contracts.
- **Parallel Administrative Units**:
  1. **Information Department**: Document registry, property listing verification, cybersecurity, and confidentiality (Articles 3C, 13).
  2. **Finance Department**: Commission calculation, payment certificate preparation, statutory 2% tax withholding, and admin payroll (Articles 3C, 14, 22).
  3. **System Administration**: IT infrastructure, user RBAC management, audit trails, and system upgrade pipeline (Articles 3C, 15).
- **5-Tier Sales Decimal Hierarchy (Articles 8 - 11, 16 - 19)**:
  - **Level 5 — Generation Head**: Oversees multiple branches (10-branch span), developer project intake, and strategic assemblies.
  - **Level 4 — Branch Manager**: Oversees 10 teams, branch-level pipeline, tendency reports, and customer jurisdiction.
  - **Level 3 — Team Leader**: Mentors 10 direct agents, verifies daily activity diaries, and leads morning standups.
  - **Level 1 & 2 — Direct Sales Agents**: Field marketers executing property sales, registering clients, and recording daily diaries.

```
                  ┌───────────────────────────────┐
                  │      CEO (Chief Executive)    │
                  └──────────────┬────────────────┘
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
┌──────────────┐         ┌──────────────┐         ┌─────────────────────┐
│ Information  │         │   Finance    │         │ System Admin (IT)   │
│  Department  │         │  Department  │         │  & Infrastructure   │
└──────────────┘         └──────────────┘         └─────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼ (Sales Decimal Hierarchy)
        ┌────────────────────────────────────────────────┐
        │ Level 5: Generation Head (10 Branches)         │
        └───────────────────────┬────────────────────────┘
                                │
        ┌───────────────────────┴────────────────────────┐
        │ Level 4: Branch Manager (10 Teams)             │
        └───────────────────────┬────────────────────────┘
                                │
        ┌───────────────────────┴────────────────────────┐
        │ Level 3: Team Leader (10 Sales Agents)         │
        └───────────────────────┬────────────────────────┘
                                │
        ┌───────────────────────┴────────────────────────┐
        │ Level 1 & 2: Direct Sales Agents (Commission)  │
        └────────────────────────────────────────────────┘
```

---

## 👥 The 8 Role-Based Dashboards

Each role has a tailored cockpit providing scoped KPIs, action queues, and compliance checklists:

### 1. CEO Command Center (`/dashboards/ceo`)
- **KPIs**: Company-wide sales volume, closed deals, active sales force, active customers, pending approval count.
- **Pending Approvals Queue**: 1-click CEO Digital Authorization for **Payment Certificates** (Article 12.3) and **System Upgrades** (Article 15.3).
- **Financial Overview**: Gross sales volume vs company commission intake vs net payouts.
- **Performance Heatmap**: Drill-down from Generation Alpha &rarr; Branches &rarr; Teams &rarr; Agents.
- **Assemblies & Directives**: Schedule assemblies of Generation Heads and broadcast executive directives.

### 2. Information Department Data Center (`/dashboards/information`)
- **Document Registry & Intake**: Catalog verified properties, developer agreements, and daily logs.
- **Property Listing Manager**: Search, filter, and verify properties submitted by Generation Heads (Article 13.2).
- **Live Incoming Feed**: Real-time incoming daily diaries from field agents.
- **Cybersecurity & Confidentiality**: Track audit access events and access requests (Article 13.3).

### 3. Finance & Settlement Center (`/dashboards/finance`)
- **Article 22 Commission Disbursement Ledger**: Automatic breakdown by tier with 2% tax withheld.
- **Payment Certificate Settlement Queue**: Finance preparation & payout verification.
- **Administrative Payroll Ledger**: Regular salary roster for Admin/Executive staff (Article 22.1).
- **Statutory Tax Schedule**: Deductions ledger ready for Ministry of Revenue (MoR) reconciliation.

### 4. System Administration & Security (`/dashboards/sysadmin`)
- **User RBAC Accounts**: View, filter, and manage staff accounts and grade levels (Grades 1 - 5).
- **Server Health Monitor**: Live database latency, table counts, PHP environment, and uptime metrics.
- **Security Audit Trail**: IP address tracking, timestamps, actor IDs, and action descriptions.
- **System Upgrade Pipeline**: Technical feasibility proposals submitted directly to the CEO.
- **Automated Backup Trigger**: Instant database snapshot creation with cold storage logging.

### 5. Generation Head Oversight Console (`/dashboards/genhead`)
- **Generation Performance Rollup**: Aggregate sales and closed deals across all underlying branches.
- **Branch Comparison Matrix**: Comparative sales volume, active teams, and agent distribution.
- **Customer Tendency Reports Review**: Review branch-level market inclinations and customer objections.
- **Operational Dispute Resolution**: Settle jurisdiction and lead attribution grievances.

### 6. Branch Manager Operations Command (`/dashboards/branchmgr`)
- **Branch KPI Board**: Monthly branch sales volume, deal counts, and active customer leads.
- **Team Leaderboard**: Ranked performance of teams within the branch.
- **Tendency Report Generator**: Draft and submit bi-weekly tendency reports to the Generation Head.
- **Diaries Review Stream**: Monitor daily activity diaries across team units.

### 7. Team Leader Field Console (`/dashboards/teamleader`)
- **Daily Activity Diary Verification Queue**: Review member diaries and append leader coaching feedback (Article 8.4).
- **Team Target Tracker**: Monthly deals target vs achieved.
- **Assigned Agent Roster**: Direct supervision of team members.
- **Morning Standups Planner**: Log morning briefing agenda and team decision logs (Article 8.2).

### 8. Direct Sales Agent Workplace (`/dashboards/teammember`)
- **Personal Commission Tracker**: Total earned net commission after statutory 2% tax.
- **Daily Activity Diary Submitter**: Log calls made, customer registrations, field visits, and tomorrow's plan.
- **Personal CRM**: Customer lead status tracking (Inquiry &rarr; Site Visit &rarr; Contract).
- **Verified Property Catalog**: Real estate listings with automated 1.5% commission calculations.

---

## 💰 Article 22: Salary and Commission Distribution

The system enforces the exact statutory and contractual provisions of Article 22:

### 1. Employment & Remuneration Classification
- **Administrative Structure (Article 22.1)**: Employees (CEO, Information, Finance, System Admin) work on a **regular monthly salary** and have the obligation to fulfill assigned duties under the guideline.
- **Sales Department (Article 22.2)**: Employees work **exclusively on a commission distribution basis** and shall have **NO salary whatsoever**.

### 2. Tiered Sales Commission Splits (Article 22.3)
When a property sale closes, the sales commission pool is distributed strictly as follows:
- **1st Tier (Direct Sales Employee)**: `1.50%` (Level 1 and Level 2 agents)
- **2nd Tier (Team Leader)**: `0.25%` (Level 3 of selling agent)
- **3rd Tier (Branch Manager)**: `0.15%` (Level 4 of selling agent)
- **4th Tier (Generation Head)**: `0.10%` (Level 5 of selling agent)

### 3. Leadership Cumulative Sales Stacking Rule (Article 22.4)
Bodies holding leadership positions within the company structure who personally execute a sale have their own salesperson percentage added to their leadership percentage:
> **Example**: If a Branch Manager personally sells a property:
> - As Direct Salesperson: `1.50%`
> - As Team Leader (inherent): `0.25%`
> - As Branch Manager: `0.15%`
> - **Total Cumulative Commission**: `1.90%`!

### 4. Statutory Tax Withholding (Article 14.5)
- In accordance with the Ethiopian Tax Law proclamation on real estate brokerage payouts, **2% withholding tax** is automatically calculated and deducted from every beneficiary payout.
- `Net Commission Payable = Gross Commission * (1 - 0.02)`

---

## 🗄️ Prisma Schema & Database Models

The database schema is defined in [`prisma/schema.prisma`](file:///c:/xampp/htdocs/Beha/prisma/schema.prisma) and implemented with MySQL Eloquent migrations:
- `users`: Staff roster with grades (1-5), dual leadership flags, PINs, and departments.
- `generations`: Level 5 Generation territorial units.
- `branches`: Level 4 Branch offices.
- `teams`: Level 3 10-person sales units.
- `customers`: Buyer CRM leads registered by agents.
- `properties`: Real estate inventory verified by Information Dept.
- `developer_contracts`: Strategic developer agreements signed by CEO.
- `daily_diaries`: Daily activity reports with supervisor feedback.
- `tendency_reports`: Branch customer tendency reports submitted to Gen Head.
- `sales_deals`: Executed property transactions.
- `payment_certificates`: Official commission disbursement documents signed by CEO.
- `commission_disbursements`: Individual beneficiary payout records.
- `audit_logs`: Security and access event tracking.
- `access_requests`: Role elevation and access control pipeline.
- `discussion_meetings`: CEO Assemblies, branch reviews, and team standups.
- `disputes`: Grievance and lead attribution management.
- `system_upgrades`: IT upgrade pipeline.
- `app_notifications`: Role-targeted in-app notices.

---

## 🚀 REST API Endpoints

Base URL: `http://localhost/Beha/backend/public/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Healthcheck & MySQL connection state |
| `GET` | `/dashboards/{role}` | Scoped data for `ceo`, `information`, `finance`, `sysadmin`, `genhead`, `branchmgr`, `teamleader`, `teammember` |
| `POST` | `/commission/calculate` | Article 22 commission calculator with leadership stacking |
| `POST` | `/deals` | Register sale deal & generate payment certificate |
| `POST` | `/payment-certificates/{id}/approve` | CEO 1-click digital signature authorization |
| `POST` | `/dashboards/actions/meeting` | Schedule assembly or standup |
| `POST` | `/dashboards/actions/upgrade` | Submit IT upgrade proposal |
| `POST` | `/dashboards/actions/dispute` | File operational grievance |
| `POST` | `/dashboards/actions/resolve-dispute` | Mark dispute resolved |
| `POST` | `/dashboards/actions/access-request` | Submit role elevation request |
| `POST` | `/dashboards/actions/review-access-request` | SysAdmin approve/reject request |
| `POST` | `/dashboards/actions/verify-diary` | Team Leader sign-off on member diary |
| `POST` | `/dashboards/actions/backup` | Trigger automated DB snapshot |
| `POST` | `/dashboards/actions/disburse-certificate` | Finance mark commissions paid |
| `POST` | `/dashboards/actions/ceo-directive` | CEO broadcast executive directive |

---

## 🔐 Role-Based Access Control (RBAC)

The application features seamless role switching and detection:
- In `DashboardView.jsx`, the user session role is detected automatically from `userSession.primary_role`.
- Executive, administrative, and testing personnel can use the top **Role Switcher Pills** to instantly preview and test any role dashboard without re-authenticating.
- A **Daily Briefing & Marketing Training** tab preserves the original physical activity schedules, consultative selling guidelines, and studying materials.

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- **XAMPP** for Windows (PHP >= 8.2, Apache, MySQL)
- **Node.js** >= 18 and npm

### 1. Database & Backend Setup
1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. In MySQL, ensure database `beha_db` exists:
   ```sql
   CREATE DATABASE IF NOT EXISTS beha_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Navigate to `backend`:
   ```bash
   cd backend
   composer install
   cp .env.example .env # Ensure DB_DATABASE=beha_db, DB_USERNAME=root, DB_PASSWORD=""
   php artisan key:generate
   ```
4. Run migrations and organizational seeder:
   ```bash
   php artisan migrate:fresh --seed
   ```

### 2. Frontend Setup
1. Navigate to `frontend`:
   ```bash
   cd ../frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.

---

## 🔑 Default Seeded Credentials

All accounts are seeded with PIN `1234` or password `password`:

| Role | Name | Official ID | Email |
|---|---|---|---|
| **CEO** | Dawit Gebremariam | `BH-CEO-001` | `ceo@beha.et` |
| **Information Dept** | Kalkidan Assefa | `BH-INF-001` | `info@beha.et` |
| **Finance Dept** | Henok Tesfaye | `BH-FIN-001` | `finance@beha.et` |
| **System Admin** | Robel Girma | `BH-SYS-001` | `admin@beha.et` |
| **Generation Head** | Alemayehu Tadesse | `BH-GEN-001` | `genhead@beha.et` |
| **Branch Manager** | Selamawit Bekele | `BH-BR-001` | `branchmgr@beha.et` |
| **Team Leader** | Mulugeta Kebede | `BH-TL-001` | `teamleader@beha.et` |
| **Direct Sales Agent** | Tewodros Kassahun | `BH-AGT-001` | `agent1@beha.et` |
