import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AuthForm() {
  const { signup, signin, loading, error } = useAuth();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (mode === "signup") {
      const result = await signup(email, password, fullName);
      if (result) setMessage(result.message);
    } else {
      const result = await signin(email, password);
      if (result) setMessage(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <button type="button" onClick={() => setMode("signup")}>Sign Up</button>
        <button type="button" onClick={() => setMode("signin")}>Sign In</button>
      </div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      {mode === "signup" && (
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
      )}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {mode === "signup" ? "Sign Up" : "Sign In"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {message && <div style={{ color: "green" }}>{message}</div>}
    </form>
  );
}