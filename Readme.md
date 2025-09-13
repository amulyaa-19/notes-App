# Multi-Tenant SaaS Notes Application

This is a full-stack, multi-tenant notes application that allows different companies (tenants) to manage their notes securely. It features JWT-based authentication, role-based access control, and subscription plan gating.

---
## Tech Stack

* **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
* **Frontend:** React , TypeScript, Tailwind CSS, Shadcn/ui, Axios
* **Deployment:** Vercel

---
## Features

* **Multi-Tenancy:** Securely isolates data between different tenants (e.g., Acme and Globex).
* **Authentication:** JWT-based login system for secure access.
* **Role-Based Access Control:** Differentiates between 'Admin' and 'Member' roles with distinct permissions.
* **Subscription Gating:** Implements a 'Free' plan with a 3-note limit and a 'Pro' plan with unlimited notes.
* **CRUD API:** A full RESTful API for creating, reading, updating, and deleting notes.
* **Minimalist Frontend:** A clean user interface built with React.

---
## Multi-Tenancy Approach

This project implements a **Shared Schema, Shared Database** multi-tenancy model.

In this approach, all tenants' data coexists within the same database tables. Each row that belongs to a tenant (e.g., in the `User` and `Note` tables) is isolated by a mandatory `tenantId` column. When a user makes an authenticated API request, their `tenantId` is extracted from their JWT, and all subsequent database queries are strictly filtered by this ID.

This method was chosen for its:
* **Simplicity:** It's the most straightforward multi-tenancy pattern to implement and maintain.
* **Low Operational Overhead:** Managing a single database and schema is easier than managing a separate schema or database for each new tenant.
---