import { useState } from "react";
import { register, login } from "../api";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError("Please fill in all fields!");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      if (password.length < 4) {
        setError("Password must be at least 4 characters!");
        return;
      }

      const data = await register(firstName, lastName, email, password);
      if (data.error) {
        setError(data.error);
        return;
      }
      setSuccess("Account created! You can now login.");
      setMode("login");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } else {
      if (!email.trim() || !password.trim()) {
        setError("Please fill in all fields!");
        return;
      }

      const data = await login(email, password);
      if (data.error) {
        setError(data.error);
        return;
      }

      localStorage.setItem("token", data.token);
      onLogin(data.name);
    }
  }

  const inputStyle = {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    fontSize: 14,
    outline: "none",
    width: "100%",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        borderRadius: 20,
        padding: 40,
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          marginBottom: 8,
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}>
          📖 My Reading List
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.7)",
          textAlign: "center",
          marginBottom: 24,
          fontSize: 14,
        }}>
          {mode === "login" ? "Welcome back! Login to continue" : "Create your account"}
        </p>

        <div style={{
          display: "flex",
          marginBottom: 24,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <button
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            style={{
              flex: 1,
              padding: "10px",
              background: mode === "login" ? "#4F46E5" : "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Login
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
            style={{
              flex: 1,
              padding: "10px",
              background: mode === "register" ? "#4F46E5" : "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "register" && (
            <>
              <div style={{ display: "flex", gap: 12 }}>
                <input
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                />
                <input
                  placeholder="Last Name *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <input
                placeholder="Email *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Password *"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Confirm Password *"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            </>
          )}

          {mode === "login" && (
            <>
              <input
                placeholder="Email *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Password *"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </>
          )}

          {error && (
            <p style={{
              color: "#FCA5A5",
              fontSize: 13,
              textAlign: "center",
              background: "rgba(220,38,38,0.2)",
              padding: "8px",
              borderRadius: 8,
            }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{
              color: "#86EFAC",
              fontSize: 13,
              textAlign: "center",
              background: "rgba(22,163,74,0.2)",
              padding: "8px",
              borderRadius: 8,
            }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#4F46E5",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
