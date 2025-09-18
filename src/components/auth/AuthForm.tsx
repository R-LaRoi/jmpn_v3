import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
  const { signup, signin, loading, error, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Redirect to dashboard when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (mode === "signup") {
      const result = await signup(email, password, fullName);
      if (result?.success) {
        setEmail("");
        setFullName("");
        setPassword("");
      } else if (result?.error) {
        setMessage(result.error);
      }
    } else {
      const result = await signin(email, password);
      if (result?.success) {
        setEmail("");
        setPassword("");
      } else if (result?.error) {
        setMessage(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2c2d2b' }}>
      <div className="flex flex-col items-center w-full max-w-md px-8">
        {/* Logo */}
        <img
          src="/assets/boltjmpn.png"
          alt="Logo"
          className="w-32 h-32 mb-10 rounded-full border-4 border-gray-500 object-cover"
        />

        {/* Form Container */}
        <div className="w-full flex flex-col items-center">
          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-8">
            {mode === "signup" ? "Register" : "Sign In"}
          </h2>

          {/* Mode Toggle Buttons */}
          <div className="flex mb-6 w-full">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 px-4 rounded-l-full font-semibold transition-colors ${mode === "signup"
                ? "bg-pink-600 text-white"
                : "bg-gray-600 text-gray-300"
                }`}
              style={{ backgroundColor: mode === "signup" ? '#F9004C' : '#6c757d' }}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-3 px-4 rounded-r-full font-semibold transition-colors ${mode === "signin"
                ? "bg-pink-600 text-white"
                : "bg-gray-600 text-gray-300"
                }`}
              style={{ backgroundColor: mode === "signin" ? '#F9004C' : '#6c757d' }}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full p-4 mb-4 text-white text-base rounded-full border-none outline-none placeholder-white placeholder-opacity-50"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />

            {/* Full Name Input (only for signup) */}
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full p-4 mb-4 text-white text-base rounded-full border-none outline-none placeholder-white placeholder-opacity-50"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              />
            )}

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full p-4 mb-6 text-white text-base rounded-full border-none outline-none placeholder-white placeholder-opacity-50"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-10 text-white text-lg font-bold rounded-full transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#F9004C' }}
            >
              {loading ? "Processing..." : (mode === "signup" ? "Sign Up" : "Sign In")}
            </button>

            {/* Toggle Mode Link */}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-gray-200 text-base mt-5 bg-transparent border-none cursor-pointer"
            >
              {mode === "signup"
                ? "Already have an account? Sign in."
                : "Don't have an account? Sign up."}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg w-full text-center">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg w-full text-center ${message.includes("success")
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
              }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}