// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo.png";

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     remember: false,
//   });

//  const [isModalOpen, setIsModalOpen] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [email, setEmail] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // TEMPORARY AUTH LOGIC
//     if (formData.username && formData.password) {
//       navigate("/dashboard");
//     } else {
//       alert("Please enter username and password");
//     }
//   };

//     const handleSendOTP = () => {
//     if (email) {
//       setOtpSent(true); // Shows the OTP section
//     } else {
//       alert("Please enter your email");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <img src={logo} alt="logo" style={styles.logo} />
//       <h2 style={styles.heading}>Anika Enterprises</h2>
//       <p style={styles.subheading}>Ice Cream Wholesaler</p>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         <div style={styles.field}>
//           <label style={styles.label}>Username</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             placeholder="username"
//             onChange={handleChange}
//             style={styles.input}
//           />
//         </div>

//         <div style={styles.field}>
//           <label style={styles.label}>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             placeholder="password"
//             onChange={handleChange}
//             style={styles.input}
//           />
//         </div>

//         <div style={styles.row}>
//           <label style={styles.checkboxLabel}>
//             <input
//               type="checkbox"
//               name="remember"
//               checked={formData.remember}
//               onChange={handleChange}
//             />
//             Remember me
//           </label>

//         </div>

//         <button type="submit" style={styles.button}>
//           Login
//         </button>
//         {/* Added onClick to your existing span */}
//         <span style={styles.forgot} onClick={() => setIsModalOpen(true)}>
//           Forgot Password?
//         </span>
//       </form>

//       {/* --- FORGOT PASSWORD MODAL --- */}
//       {isModalOpen && (
//         <div style={modalStyles.overlay}>
//           <div style={modalStyles.modalBox}>
//             <button style={modalStyles.closeBtn} onClick={() => {setIsModalOpen(false); setOtpSent(false);}}>✕</button>
            
//             <img src={logo} alt="logo" style={modalStyles.modalLogo} />
//             <h2 style={modalStyles.modalHeading}>Anika Enterprises</h2>
//             <p style={modalStyles.modalSubheading}>Ice Cream Wholesaler</p>
//             <p style={modalStyles.forgotTitle}>Forgot Password</p>

//             <div style={modalStyles.inputContainer}>
//               <div style={modalStyles.emailRow}>
//                 <input 
//                   type="email" 
//                   placeholder="Enter your Email" 
//                   style={modalStyles.modalInput} 
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <button style={modalStyles.sendOtpBtn} onClick={handleSendOTP}>
//                   Send OTP
//                 </button>
//               </div>

//               {otpSent && (
//                 <div style={modalStyles.otpSection}>
//                   <input type="text" placeholder="OTP" style={modalStyles.modalInput} />
//                   <button style={modalStyles.submitBtn} onClick={() => setIsModalOpen(false)}>
//                     Submit
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
  // container: {
  //   display: "flex",
  //   flexDirection: "column",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   gap: "24px",
  // },
  // logo: {
  //   width: "100px",
  //   height: "100px",
  //   marginBottom: "2px",
  // },
  // heading: {
  //   textAlign: "center",
  //   marginBottom: "4px",
  //   color: "#01292f",
  //   fontSize: "35px",
  //   fontWeight: "750",

  // },
  // subheading: {
  //   textAlign: "center",
  //   fontSize: "20px",
  //   color: "#000000ff",
  //   marginBottom: "24px",
  // },
  // form: {
  //   display: "flex",
  //   flexDirection: "column",
  //   gap: "16px",
  // },
  // field: {
  //   display: "flex",
  //   flexDirection: "column",
  //   gap: "6px",
    
  // },
  // label: {
  //   fontSize: "14px",
  //   fontWeight: "500",
  // },
  // input: {
  //   padding: "10px",
  //   borderRadius: "15px",
  //   border: "2.5px linear-gradient(5deg, #86a2b8 0%, #00e5faff 100%)",
  //   fontSize: "20px",
  //   backgroundColor: "rgba(255, 255, 255, 0.34)",
  // },
  // row: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   fontSize: "13px",
  // },
  // checkboxLabel: {
  //   display: "flex",
  //   gap: "6px",
  //   alignItems: "center",
  // },
  // forgot: {
  //   textAlign: "center",
  //   color: "#214b4f",
  //   cursor: "pointer",
  //   fontSize: "17px",
  //   fontWeight: "650",
  // },
  // button: {
  //   padding: "10px",
  //   borderRadius: "6px",
  //   border: "none",
  //   backgroundColor: "#1d4ed8",
  //   color: "#ffffff",
  //   fontSize: "15px",
  //   fontWeight: "600",
  //   cursor: "pointer",
  // },
  
// };
// const modalStyles = {
  // overlay: {
  //   position: "fixed",
  //   top: 0,
  //   left: 0,
  //   width: "100%",
  //   height: "100%",
  //   backgroundColor: "rgba(0,0,0,0.4)",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   zIndex: 1000
  // },
  // modalBox: {
  //   backgroundColor: "rgba(216, 235, 238, 0.95)",
  //   width: "400px",
  //   padding: "30px",
  //   borderRadius: "20px",
  //   textAlign: "center",
  //   position: "relative",
  //   boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  // },
  // closeBtn: {
  //   position: "absolute",
  //   top: "10px",
  //   right: "15px",
  //   background: "none",
  //   border: "none",
  //   fontSize: "20px",
  //   cursor: "pointer"
  // },
  // modalLogo: { width: "60px", height: "60px", marginBottom: "5px" },
  // modalHeading: { margin: 0, fontSize: "24px", color: "#01292f" },
  // modalSubheading: { margin: "0 0 15px 0", fontSize: "14px" },
  // forgotTitle: { fontWeight: "700", fontSize: "18px", marginBottom: "20px" },
  // inputContainer: { display: "flex", flexDirection: "column", gap: "15px" },
  // emailRow: { display: "flex", gap: "10px" },
  // modalInput: {
  //   flex: 1,
  //   padding: "10px",
  //   borderRadius: "8px",
  //   border: "1px solid #99c1c4",
  //   backgroundColor: "#fff"
  // },
  // sendOtpBtn: {
  //   padding: "10px 15px",
  //   borderRadius: "8px",
  //   border: "none",
  //   backgroundColor: "#48a7a8",
  //   color: "#fff",
  //   cursor: "pointer",
  //   fontWeight: "600"
  // },
  // otpSection: {
  //   display: "flex",
  //   flexDirection: "column",
  //   gap: "15px",
  //   marginTop: "5px"
  // },
  // submitBtn: {
  //   padding: "10px",
  //   borderRadius: "8px",
  //   border: "none",
  //   backgroundColor: "#48a7a8",
  //   color: "#fff",
  //   cursor: "pointer",
  //   fontSize: "16px",
  //   fontWeight: "600"
  // }
// };

// export default Login;
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

  /* ================= LOGIN ================= */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const res = await fetch("http://localhost:5000/api/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(formData)
  //   });

  //   const data = await res.json();
  //   if (!res.ok) return alert(data.message);

  //   localStorage.setItem("token", data.token);
  //   navigate("/dashboard");
  // };

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
      body: JSON.stringify({ email, otp, newPassword })
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

        {/* <span style={styles.forgot} onClick={() => setIsModalOpen(true)}>
          Forgot Password?
        </span> */}
      </form>

      {/* ===== FORGOT PASSWORD MODAL ===== */}
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalBox}>
            <button
              style={modalStyles.closeBtn}
              onClick={() => {
                setIsModalOpen(false);
                setOtpSent(false);
                setShowResetPassword(false);
              }}
            >
              ✕
            </button>

            <img src={logo} alt="logo" style={modalStyles.modalLogo} />
            <p style={modalStyles.forgotTitle}>Forgot Password</p>

            <div style={modalStyles.inputContainer}>
              <div style={modalStyles.emailRow}>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  style={modalStyles.modalInput}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  style={modalStyles.sendOtpBtn}
                  onClick={handleSendOTP}
                >
                  Send OTP
                </button>
              </div>

              {otpSent && !showResetPassword && (
                <div style={modalStyles.otpSection}>
                  <input
                    placeholder="OTP"
                    style={modalStyles.modalInput}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    style={modalStyles.submitBtn}
                    onClick={handleVerifyOtp}
                  >
                    Submit
                  </button>
                </div>
              )}

              {showResetPassword && (
                <div style={modalStyles.otpSection}>
                  <input
                    type="password"
                    placeholder="New Password"
                    style={modalStyles.modalInput}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    style={modalStyles.modalInput}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    style={modalStyles.submitBtn}
                    onClick={handleResetPassword}
                  >
                    Change Password
                  </button>
                </div>
              )}
            </div>
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
const modalStyles = {  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modalBox: {
    backgroundColor: "rgba(216, 235, 238, 0.95)",
    width: "400px",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer"
  },
  modalLogo: { width: "60px", height: "60px", marginBottom: "5px" },
  modalHeading: { margin: 0, fontSize: "24px", color: "#01292f" },
  modalSubheading: { margin: "0 0 15px 0", fontSize: "14px" },
  forgotTitle: { fontWeight: "700", fontSize: "18px", marginBottom: "20px" },
  inputContainer: { display: "flex", flexDirection: "column", gap: "15px" },
  emailRow: { display: "flex", gap: "10px" },
  modalInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #99c1c4",
    backgroundColor: "#fff"
  },
  sendOtpBtn: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#48a7a8",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600"
  },
  otpSection: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "5px"
  },
  submitBtn: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#48a7a8",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  }};

export default Login;

