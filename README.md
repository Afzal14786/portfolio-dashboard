# ⚙️ Admin Dashboard (Control Center)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/recharts-%2322B573.svg?style=for-the-badge&logo=react&logoColor=white)

This repository contains the **Secure Admin Dashboard** of the Integrated Portfolio & Blog Management System. It acts as the central hub for managing all public-facing content, moderating user interactions, viewing analytics, and controlling the author's dynamic profile.

---

## 🎯 Key Features & Capabilities

- **Advanced Authentication & Security:** - Implements JWT (JSON Web Tokens) with a sophisticated **Axios Interceptor** for silent Refresh Token rotation.
  - Multi-step authentication including Registration, OTP Verification, and secure Password Reset flows.
  - Protected routing ensures unauthorized users cannot access dashboard components.
- **Rich Text Blog Engine:** Features a fully integrated WYSIWYG editor (`Jodit-React`) for composing articles, complete with Cloudinary image upload handling, tagging, and Draft/Published state toggling.
- **Data Visualization & Analytics:** Utilizes `Recharts` to render beautiful, interactive charts tracking total views, blog engagement, and trending articles over time.
- **Modular Content Management (CRUD):** Dedicated, intuitive interfaces (utilizing reusable Modals and Forms) to Manage Projects, Skills, Educational Journey, and Certificates.
- **Dynamic Profile Control:** The `/settings` and `/profile` modules allow the admin to instantly update their public Bio, Social Media links, Reading Resources, and Cloudinary-hosted Avatars/Banners.
- **Custom React Hooks:** Business logic is abstracted into custom hooks (e.g., `useAuth`, `useBlogs`, `useAnalytics`) ensuring clean, declarative, and easily testable UI components.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Core library for building the interactive SPA interface. |
| **TypeScript** | Strict typings matching backend schemas to eliminate runtime payload errors. |
| **Vite** | Blazing fast build tool and development server. |
| **Tailwind CSS** | Rapid, utility-first UI styling with a clean, modern aesthetic. |
| **Axios** | HTTP client configured with request/response interceptors for auth headers. |
| **Recharts** | Composable charting library for rendering dashboard analytics. |
| **Jodit React** | Powerful Rich Text Editor for composing HTML blog content. |
| **React Hot Toast** | Elegant, non-blocking toast notifications for CRUD feedback. |

---

## 📂 System Architecture

The dashboard applies a strict separation of concerns, isolating API calls, state management, and UI rendering.

```text
src/
├── api/                  # Axios instance with JWT Interceptors (Refresh Logic)
├── components/           # Domain-specific UI components
│   ├── blog/             # Rich Text Editor, Blog Forms, Comment Moderation
│   ├── dashboard/        # Recharts Analytics, Stat Cards
│   ├── layout/           # Sidebar, Header, Protected Layout Wrappers
│   ├── portfolio/        # CRUD Modals (Projects, Skills, Certs)
│   ├── profile/          # Profile Update Forms, Hobbies, Social Links
│   └── ui/               # Generic elements (Modals, Spinners, Dialogs)
├── hooks/                # Custom React Hooks (useAuth, useAnalytics, useBlogMutations)
├── pages/                # Top-level route containers
├── routes/               # Route configurations (Protected vs Public)
├── services/             # Axios API Call Wrappers (Separated by domain)
└── types/                # TypeScript Interfaces (1:1 mapping with backend)
```  

## 🔐 The Security Flow (Axios Interceptors)  

A major technical achievement of this dashboard is the automated session management.  

1. When an Admin logs in, an `accessToken` is stored in memory/localStorage, and an HTTP-Only `refreshToken` is set by the backend.  

2. Every request made via `src/api/api.ts` automatically attaches the `accessToken`.  

3. **If the token expires (401 Unauthorized)**, the Axios Interceptor catches the error before the UI crashes.  

4. It pauses the original request, silently calls the `/auth/refresh` endpoint to get a new token, updates the headers, and safely replays the original request.  

5. The Admin experiences zero interruptions.  

## 💻 Local Setup & Installation  

**Prerequisites**  

* Node.js (v16+ recommended)
* The **Backend** must be running locally.  

**1. Clone the repository**  
```bash
git clone https://github.com/Afzal14786/portfolio-dashboard.git
cd portfolio-dashboard
```  

**2. Install dependencies**  
```bash
npm install
```  
**3. Set up Environment Variables**  
Create a `.env` file in the root directory:  
```bash
# Point this to your local or hosted backend API
VITE_API_BASE_URL=http://localhost:5000/api/v1
```  

**4. Run the Development Server**  
```bash
npm run dev
```  
*The dashboard will be available at `http://localhost:5174` (or port specified by Vite).*  

--- 
*This project is submitted as part of the BCA Final Year Project requirement.*