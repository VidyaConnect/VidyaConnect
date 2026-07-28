# Web Frontend

## Overview

The **Web Frontend** is the web-based administration portal of the **VidyaConnect platform**.

It provides a centralized interface for school administrators and authorized users to manage academic activities, communication, users, and platform operations.

The web application communicates with backend services through REST APIs and provides a secure, user-friendly dashboard for managing school-related processes.

---

# Purpose

The Web Frontend is designed to:

- Provide administrative access to VidyaConnect features
- Enable efficient school management
- Provide dashboards and reports
- Support user and role management
- Improve communication between schools and platform users
- Provide a responsive and accessible web experience

---

# Planned Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js | React-based web application framework |
| React.js | Frontend user interface development |
| REST API | Communication with backend services |
| TypeScript | Type-safe development |
| CSS / UI Framework | Styling and responsive design |

---

# Application Architecture

The Web Frontend follows a client-server architecture.

```
                Web Browser
                     |
                     v
              Next.js Frontend
                     |
                     |
              REST API Requests
                     |
                     v
          VidyaConnect Backend Services
                     |
        --------------------------------
        |              |               |
        v              v               v
 Authentication   User Service   Announcement Service
```

---

# Main Modules

## Authentication Module

Responsible for secure user access.

Features:

- User login
- Logout functionality
- Session management
- Role-based access control
- Integration with Keycloak authentication

Supported roles:

- Super Admin
- School Admin
- Teacher
- Parent
- Student

---

## Dashboard Module

Provides an overview of important platform information.

Features:

- System statistics
- Recent activities
- Notifications
- Quick access to main functions

---

## School Management Module

Allows administrators to manage school information.

Features:

- Add and update school details
- Manage school profiles
- View school information
- Configure school settings

---

## User Management Module

Provides user administration capabilities.

Features:

- Manage user accounts
- Assign user roles
- Update user information
- Control user access permissions

---

## Announcements Module

Provides communication management.

Features:

- Create announcements
- Edit announcements
- View announcements
- Manage school communications

Integrated with:

```
Announcement Service
```

---

## Attendance Module

Supports attendance management.

Features:

- Record attendance
- View attendance records
- Generate attendance summaries

---

## Assignments Module

Supports academic assignment management.

Features:

- Create assignments
- Update assignments
- View assignment details
- Track assignment status

---

## Consent Forms Module

Manages digital consent processes.

Features:

- Create consent forms
- Share forms with users
- Track responses
- Maintain consent records

---

## Reports Module

Provides reporting and analytics features.

Features:

- Generate reports
- View platform statistics
- Export required information
- Support decision-making processes

---

# Project Structure

```
web-frontend
│
├── public
│   └── Static assets
│
├── src
│   │
│   ├── app
│   │   └── Next.js application routes
│   │
│   ├── components
│   │   └── Reusable UI components
│   │
│   ├── pages
│   │   └── Application pages
│   │
│   ├── services
│   │   └── API communication
│   │
│   ├── hooks
│   │   └── Custom React hooks
│   │
│   ├── styles
│   │   └── Application styling
│   │
│   └── utils
│       └── Helper functions
│
├── package.json
├── next.config.js
└── README.md
```

---

# Prerequisites

Before running the application, install:

- Node.js (v18 or higher)
- npm
- Git

---

# Installation

Navigate to the frontend directory:

```bash
cd web-frontend
```

Install dependencies:

```bash
npm install
```

---

# Environment Configuration

Create an environment file:

```
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

NEXT_PUBLIC_AUTH_URL=http://localhost:8080
```

Update values according to the local development environment.

---

# Running the Application

Start the development server:

```bash
npm run dev
```

The application will run at:

```
http://localhost:3000
```

---

# Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |

---

# API Integration

The frontend communicates with backend services using REST APIs.

Example services:

```
Frontend
   |
   |
   +---- Authentication Service
   |
   +---- User Management Service
   |
   +---- Announcement Service
   |
   +---- Attendance Service
   |
   +---- Assignment Service
```

---

# Authentication

Authentication is handled through **Keycloak**.

The frontend uses:

- Secure login flow
- Access tokens
- Role-based permissions
- Protected routes

Example:

```
User Login
     |
     v
Keycloak Authentication
     |
     v
Access Token
     |
     v
Frontend Application
```

---

# Development Workflow

Create a feature branch:

```bash
git checkout -b feature/frontend-module
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Commit changes:

```bash
git add .
git commit -m "Implement frontend module"
```

Push changes:

```bash
git push origin feature/frontend-module
```

Create a Pull Request for review.

---

# Code Quality Guidelines

- Follow TypeScript best practices
- Use reusable components
- Maintain consistent folder structure
- Write clean and readable code
- Test features before submitting pull requests
- Follow project naming conventions

---

# Future Enhancements

Planned improvements:

- Progressive Web App (PWA) support
- Advanced dashboards
- Real-time notifications
- Improved accessibility support
- Enhanced reporting features
- Mobile-responsive improvements

---

# Maintainer

VidyaConnect Development Team
