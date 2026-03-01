import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { BACKEND_URL } from "../../config/index.js";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="logo" style={styles.logo} />
      <h2 style={styles.heading}>Anika Enterprises</h2>
      <p style={styles.subheading}>Ice Cream Wholesaler</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Username */}
        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            style={styles.input}
          />
        </div>

        {/* Email */}
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            style={styles.input}
          />
        </div>

        {/* Password */}
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            style={styles.input}
          />
        </div>

         <div style={styles.field}>
          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Register
        </button>

        <p
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login here
        </p>
      </form>
    </div>
  );
};

/* SAME STYLES AS LOGIN */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  logo: {
    width: "80px",
    height: "80px",
  },
  heading: {
    textAlign: "center",
    color: "#01292f",
    fontSize: "28px",
    fontWeight: "700",
      margin: "4px 0 2px 0",
  },
  subheading: {
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
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
    padding: "10px",
    borderRadius: "15px",
    border: "2px solid #ccc",
    fontSize: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.34)",
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
export default Register;