# HireNest

HireNest is a job posting web application built using the MERN (MongoDB, Express.js, React, Node.js) stack. The platform allows companies to post job listings and manage job applications, and candidates to apply for jobs.

## Tech Stack

- **Frontend**: React (Vite) with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Styling**: TailwindCSS

## Installation

### Prerequisites

- Node.js (v14.x or above)
- MongoDB (local instance or MongoDB Atlas)
- Git

### Steps to Install Locally

1. **Clone the repository:**

   ```bash
   git clone git@github.com:dilkhush-raj/hire-nest.git
   cd hire-nest
   ```

2. **Install Backend Dependencies:**

   Navigate to the backend directory:

   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the backend folder with the following variables:

   ```bash
   BACKEND_HOST_URL
   REFRESH_TOKEN_EXPIRY
   REFRESH_TOKEN_SECRET
   ACCESS_TOKEN_EXPIRY
   ACCESS_TOKEN_SECRET
   PORT="8000"
   MONGODB_URI
   DATABASE_PASSWORD
   DATABASE_USERNAME
   EMAIL
   EMAIL_PASS
   EMAIL_SERVIC
   ```

4. **Start the Backend Server:**

   ```bash
   npm run dev
   ```

5. **Install Frontend Dependencies:**

   In a separate terminal, navigate to the frontend directory:

   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the Frontend:**

   ```bash
   npm run dev
   ```

7. **Access the Application:**

   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5173`

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
