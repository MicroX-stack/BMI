"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would make an API call here to send the reset link.
    // For this demo, we'll just simulate a successful submission.
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        
        {submitted ? (
          <div className="text-center">
            <div className="mb-4 text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
              If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
            </div>
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>
            <div className="text-center text-sm">
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
