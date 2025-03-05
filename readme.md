<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3800/3800024.png" width="100" />
</p>
<p align="center">
    <h1 align="center">LINKEDIN SCAMMER BLACKLIST</h1>
</p>
<p align="center">
    <em><code>Protect the LinkedIn community from scammers</code></em>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
    <img src="https://img.shields.io/badge/MongoDB-green.svg" alt="mongodb">
    <img src="https://img.shields.io/badge/TypeScript-blue.svg" alt="typescript">
    <img src="https://img.shields.io/badge/React-19-blue.svg" alt="react">
</p>
<p align="center">
    <em>Developed with the software and tools below.</em>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=MongoDB&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=flat&logo=Tailwind-CSS&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2.svg?style=flat&logo=LinkedIn&logoColor=white" alt="LinkedIn API">
    <img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
</p>
<hr>

## 🔗 Quick Links

> - [📍 Overview](#-overview)
> - [🌟 Features](#-features)
> - [🏗️ Architecture](#-architecture)
> - [📦 Technologies](#-technologies)
> - [🔐 Authentication](#-authentication)
> - [🚀 Getting Started](#-getting-started)
>   - [Prerequisites](#prerequisites)
>   - [Backend Setup](#backend-setup)
>   - [Frontend Setup](#frontend-setup)
> - [🗄️ Database Model](#-database-model)
> - [🔄 API Routes](#-api-routes)
> - [🧪 Testing](#-testing)
> - [🔮 Future Enhancements](#-future-enhancements)
> - [📄 License](#-license)

---

## 📍 Overview

LinkedIn Scammer Blacklist is an open-source community-driven platform to help identify, report, and avoid scammers on LinkedIn. The application allows users to report suspicious LinkedIn profiles, search for reported profiles before engaging with potential recruiters or connections, and view comprehensive reports from community members.

With the rise of fake recruiters and investment scammers on LinkedIn, this tool aims to protect professionals from potential fraud by creating a searchable database of reported profiles, complete with details on the nature of the scam.

---

## 🌟 Features

- **Authentication with LinkedIn OAuth2**: Secure authentication using LinkedIn's OAuth2 flow
- **Report Submission**: Submit detailed reports about LinkedIn scammer profiles
- **Profile Search**: Check if a LinkedIn profile has been reported as a scammer
- **Dashboard**: View your submitted reports and community reports
- **Report Management**: Delete your own reports if needed
- **Scam Categories**: Categorize reports by scam type (suspicious repo/software, investment, romance, etc.)
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Toast notifications provide real-time feedback on actions

---

## 🏗️ Architecture

The project is structured using a modern full-stack architecture:

- **Frontend**: React with TypeScript, Vite, and Tailwind CSS for UI components
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: LinkedIn OAuth2 with JWT for session management
- **API**: RESTful API design with proper error handling and validation
- **Deployment**: Frontend on Vercel, Backend on Railway

---

## 📦 Technologies

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Vite
- React Router DOM
- Axios
- React Hook Form with Zod for validation

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- Passport.js with LinkedIn OAuth2
- JsonWebToken
- Jest for testing

---

## 🔐 Authentication

The application uses LinkedIn OAuth2 for authentication, which offers several benefits:

1. **Security**: No need to store passwords
2. **Validation**: Ensures users are real LinkedIn members
3. **Simplicity**: Quick sign-in with existing LinkedIn accounts
4. **Profile Data**: Access to basic profile information

The authentication flow:
1. User clicks "Login with LinkedIn" button
2. User is redirected to LinkedIn authentication page
3. After authentication, LinkedIn redirects back to our callback URL
4. Backend creates/updates user record and generates JWT
5. User is redirected to the dashboard, authenticated with JWT

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- LinkedIn Developer account (for OAuth credentials)

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/linkedin-scammer-blacklist.git
   cd linkedin-scammer-blacklist/be
   ```

2. Install dependencies
    ```bash
   npm install  
   ```
  
3. Create a .env file in the be directory:
    ```bash
    PORT=3005
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=30d

    # LinkedIn OAuth
    LINKEDIN_CLIENT_ID=your_linkedin_client_id
    LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
    LINKEDIN_CALLBACK_URL_DEV=http://localhost:3005/api/auth/linkedin/callback
    LINKEDIN_CALLBACK_URL_PROD=https://your-production-url.com/api/auth/linkedin/callback

    FRONTEND_LOCAL_URL=http://localhost:5173
    FRONTEND_PROD_URL=https://your-production-frontend-url.com
    ```
  
4. Start the backend server

``` bash
npm run dev 
```

### FrontEnd Setup

1. Navigate to the frontend directory
```bash
cd ../fe 
```
2. Install dependencies
    ```bash
   npm install
    ```
3. Create a .env file in the fe directory

``` config
VITE_ENV_MODE=development
# VITE_ENV_MODE=production

   VITE_PROD_SERVER_URL=https://your-production-backend-url.com
   VITE_LOCAL_SERVER_URL=http://localhost:3005
    
```

4. Start the frontend development server

``` bash
npm run dev
```

## 🗄️ Database Model

### User Model

    ``` bash
    interface IUser {
    _id: ObjectId;
    username: string;
    linkedinId: string;
    profilePicture?: string;
    role: 'user' | 'admin';
    lastLogin?: Date;
    isActive: boolean;
    }
    ```

### Scammer Model

    ``` js

    interface IScammer {
    _id: ObjectId;
    profileLink: string;
    name: string;
    company: string;
    reports: Array<{
        reportedBy: ObjectId; // Reference to User
        scamType: string;
        notes: string;
        createdAt: Date;
    }>;
    totalReports: number;
    firstReportedAt: Date;
    lastReportedAt: Date;
    }

    ```

## 🔄 API Routes

### Authentication Routes
- GET /api/auth/linkedin: Initiates LinkedIn OAuth flow
- GET /api/auth/linkedin/callback: LinkedIn OAuth callback
- GET /api/auth/verify: Verifies JWT token validity

### User Routes
- GET /api/users/me: Get current user profile

### Scammer Routes
- GET /api/scammers: Get all scammer reports
- POST /api/scammers: Create new scammer report
- GET /api/scammers/search: Search for a specific LinkedIn profile
- DELETE /api/scammers/:scammerId/reports/:reportId: Delete a specific report

## 🧪 Testing

The project includes Jest for testing backend functionality. To run tests:

 ``` bash
 cd be
 npm test    
 ```
 To run tests in watch mode:

 ``` bash
 npm run test:watch
 ```

## 🔮 Future Enhancements

-Enhanced search capabilities with fuzzy matching
-Report verification system
-Admin dashboard for report moderation
-User reputation system
-Statistics and analytics on reported scams
-Integration with LinkedIn messaging for real-time checks

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

<p align="center"> <em>-Built to protect the LinkedIn community from scammers-</em> </p>
