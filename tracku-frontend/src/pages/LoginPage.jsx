import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) clearError();
  };

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email";
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6) errors.password = "Min 6 characters";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const result = await login(form);
    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div style={styles.page}>
      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoMark}>T</div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to continue to TrackU</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert message={error} type="error" onClose={clearError} />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={fieldErrors.email}
            autoComplete="email"
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={fieldErrors.password}
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            loading={loading}
            fullWidth
            style={{ marginTop: "8px" }}
          >
            Sign in
          </Button>
        </form>

        {/* Footer */}
        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    background: "var(--bg-primary)",
  },
  orb1: {
    position: "absolute",
    top: "-15%",
    right: "-10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    bottom: "-15%",
    left: "-10%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "40px 36px",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    textAlign: "center",
  },
  logoMark: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "var(--accent)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    marginBottom: "4px",
  },
  title: {
    fontSize: "24px",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  footer: {
    textAlign: "center",
    fontSize: "13.5px",
    color: "var(--text-secondary)",
  },
};

export default LoginPage;