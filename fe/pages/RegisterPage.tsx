import React from "react";
import { RegisterForm } from "../components/auth/RegisterForm";

// Add a default export
const RegisterPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="mt-2 text-gray-600">
            Join our community to help protect others from scammers
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

// Add this export default statement
export default RegisterPage;
