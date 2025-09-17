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
        // Remove the success message - user will be redirected
        setEmail("");
        setFullName("");
        setPassword("");
      } else if (result?.error) {
        setMessage(result.error);
      }
    } else {
      const result = await signin(email, password);
      if (result?.success) {
        // Remove the success message - user will be redirected
        setEmail("");
        setPassword("");
      } else if (result?.error) {
        setMessage(result.error);
      }
    }
  };

  // Remove the confirmation display - user will be redirected instead
  // if (isAuthenticated && user) {
  //   return (
  //     <div>
  //       <h2>Welcome, {user.full_name}!</h2>
  //       <p>Email: {user.email}</p>
  //       <p>You are successfully authenticated.</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{
              marginRight: "0.5rem",
              backgroundColor: mode === "signup" ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setMode("signin")}
            style={{
              backgroundColor: mode === "signin" ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Sign In
          </button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: loading ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1rem"
          }}
        >
          {loading ? "Processing..." : (mode === "signup" ? "Sign Up" : "Sign In")}
        </button>

        {error && (
          <div style={{
            color: "red",
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "4px"
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            color: message.includes("success") ? "green" : "red",
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: message.includes("success") ? "#d4edda" : "#f8d7da",
            border: `1px solid ${message.includes("success") ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "4px"
          }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}