import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { loginUser } from "../../services/authService";
import { reconnectSocket } from "../../socket";
import toast from "react-hot-toast";
import LoginLoader from "../../components/common/LoginLoader.jsx";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!formData.username || !formData.password) {
      toast.error(
        "Please enter username and password"
      );
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser(
        formData.username.trim(),
        formData.password
      );

      localStorage.setItem("token", data.token);

      reconnectSocket(data.token);

      toast.success("Login Successful");

      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 500);

      // localStorage.setItem("role", data.role);

      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error(err);

      setLoading(false);

      toast.error(
        err?.response?.data?.message ||
        "Login failed"
      );
    }
  };


  return (
      <>
      {loading && <LoginLoader />}
    <div style={styles.container}>
      <img src={logo} alt="logo" style={styles.logo} />
      <h2 style={styles.heading}>Anika Enterprise</h2>
      <p style={styles.subheading}>Ice Cream Distributor</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            name="username"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            style={styles.input}
          />
        </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
      </form>
    </div>
    </>
  );
};

/* ===== YOUR STYLES (UNCHANGED) ===== */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
  },
  logo: {
    width: "100px",
    height: "100px",
    marginBottom: "2px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "4px",
    color: "#01292f",
    fontSize: "35px",
    fontWeight: "750",

  },
  subheading: {
    textAlign: "center",
    fontSize: "20px",
    color: "#000000ff",
    marginBottom: "24px",
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
    border: "2.5px linear-gradient(5deg, #86a2b8 0%, #00e5faff 100%)",
    fontSize: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.34)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },
  checkboxLabel: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  forgot: {
    textAlign: "center",
    color: "#214b4f",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "650",
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
const forgotStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    zIndex: 1000
  },

  box: {
    width: "100%",
    maxWidth: "420px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "20px",
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    padding: "30px 24px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
  },

  close: {
    position: "absolute",
    top: "12px",
    right: "16px",
    border: "none",
    background: "none",
    fontSize: "20px",
    cursor: "pointer"
  },

  logo: {
    width: "60px",
    marginBottom: "10px"
  },

  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#01292f",
    marginBottom: "6px"
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "20px",
    color: "#555"
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    marginBottom: "16px",
    fontSize: "16px",  // better for mobile
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#1d4ed8",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer"
  }


};


export default Login;

