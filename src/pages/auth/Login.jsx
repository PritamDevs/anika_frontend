import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { BACKEND_URL } from "../../config/index.js";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showForgotBox, setShowForgotBox] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.username || !formData.password) {
    alert("Please enter username and password");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: formData.username.trim(),
        password: formData.password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }
    localStorage.setItem("token", data.token);
    navigate("/dashboard");
    // localStorage.setItem("role", data.role);

    navigate("/dashboard");

  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    alert("Server error");
  }
};

  /* ================= SEND OTP ================= */
  const handleSendOTP = async () => {
    if (!email) return alert("Enter email");

    const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setOtpSent(true);
    alert("OTP sent to email");
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    setResetToken(data.resetToken);
    setShowResetPassword(true);
  };
  

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, newPassword })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Password changed successfully");

    setShowResetPassword(false);
    setIsModalOpen(false);
    setOtpSent(false);
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="logo" style={styles.logo} />
      <h2 style={styles.heading}>Anika Enterprises</h2>
      <p style={styles.subheading}>Ice Cream Wholesaler</p>

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

        <button type="submit" style={styles.button}>
          Login
        </button>
      {/* <p
      style={styles.forgot}
      onClick={async () =>setShowForgotBox(true)}
>
  Forgot Password?
</p>
         */}
        {/* <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/register")}
        >
         Create Account
        </p> */}
       

       
      </form>
      {showForgotBox && (
  <div style={forgotStyles.overlay}>
    <div style={forgotStyles.box}>
      
      <button
        style={forgotStyles.close}
        onClick={() => setShowForgotBox(false)}
      >
        ✕
      </button>

      <img src={logo} alt="logo" style={forgotStyles.logo} />
      <h3 style={forgotStyles.title}>Reset Password</h3>
      <p style={forgotStyles.subtitle}>
        Enter your registered email
      </p>

      <input
        type="email"
        placeholder="Email address"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        style={forgotStyles.input}
      />

      <button
        style={forgotStyles.button}
        onClick={async () => {
          if (!resetEmail) return alert("Enter email");

          setLoading(true);

          const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: resetEmail }),
          });

          const data = await res.json();
          alert(data.message);

          setLoading(false);
          setShowForgotBox(false);
        }}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

    </div>
  </div>
)}
    </div>
  );
};

/* ===== YOUR STYLES (UNCHANGED) ===== */
const styles = { container: {
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

