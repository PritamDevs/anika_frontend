import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { BACKEND_URL } from "../../config";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await fetch(
      `${BACKEND_URL}/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      }
    );

    const data = await res.json();
    alert(data.message);

    if (res.ok) navigate("/login");
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="logo" style={styles.logo} />
      <h2 style={styles.heading}>Reset Password</h2>
      <p style={styles.subheading}>Create a new secure password</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            style={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            style={styles.input}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" style={styles.button}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    width: "90px",
    height: "90px",
  },
  heading: {
    textAlign: "center",
    color: "#01292f",
    fontSize: "28px",
    fontWeight: "700",
  },
  subheading: {
    textAlign: "center",
    fontSize: "15px",
    marginBottom: "10px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "360px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    fontSize: "15px",
    border: "1px solid #ccc",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1d4ed8",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default ResetPassword;