import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import logo from "../../assets/logo.png";
import adminLogo from "../../assets/logo.png"; 

const Sidebar = ({isMobile,isOpen,setIsOpen}) => {
  // State to manage the profile pop-up visibility
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  console.log("Decoded user from token:", user);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const [email, setEmail] = useState(user?.email || "");

  // Function to toggle the modal
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Function to handle logout and redirection
  const handleLogout = () => {
    // Optional: Clear user session/token here
    // localStorage.removeItem("userToken");
    localStorage.removeItem("token"); 
    console.log("Logging out...");
    navigate("/login"); 
  };
  // const handleUpdateProfile = async () => {
  //   try {
  //     await fetch("http://localhost:5000/api/users/update-email", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ email }),
  //     });

  //     alert("Email updated successfully");
  //   } catch {
  //     alert("Failed to update email");
  //   }
  // };
//   const handleSaveEmail = async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/admin/profile", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ email })
//     });

//     const data = await res.json();

//     // 🔥 Replace old token
//     localStorage.setItem("token", data.token);

//     alert("Email updated successfully");
//   } catch {
//     alert("Failed to update email");
//   }
// };


  return (
    <>
    {isMobile && isOpen && (
  <div
    onClick={() => setIsOpen(false)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.3)",
      zIndex: 900,
    }}
  />
)}
      {/* <aside style={styles.sidebar}> */}
      <aside
  style={{
    ...styles.sidebar,
    position: isMobile ? "fixed" : "relative",
    transform: isMobile
      ? isOpen
        ? "translateX(0)"
        : "translateX(-100%)"
      : "translateX(0)",
    transition: "transform 0.3s ease",
    zIndex: 1000,
  }}
>

        {/* 1. Top Section: Logo / Brand */}
        <div style={styles.brand}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Anika Enterprises" style={styles.logo} />
          </div>
          <div style={styles.brandTextContent}>
            <div style={styles.titleWrapper}>
              <h2 style={styles.brandText}>Anika</h2>
              <h2 style={styles.brandText}>Enterprises</h2>
            </div>
            <span style={styles.subText}>Ice Cream Wholesaler</span>
          </div>
        </div>

        {/* 2. Middle Section: Navigation */}
        <nav style={styles.nav}>
          <NavItem to="/dashboard" label="Dashboard" icon={<path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>} />
          <NavItem to="/products" label="Products" icon={<path d="M482-40 294-400q-71 3-122.5-41T120-560q0-51 29.5-92t74.5-58q18-91 89.5-150.5T480-920q95 0 166.5 59.5T736-710q45 17 74.5 58t29.5 92q0 75-53 119t-119 41L482-40ZM280-480q15 0 29.5-5t26.5-17l22-22 26 16q21 14 45.5 21t50.5 7q26 0 50.5-7t45.5-21l26-16 22 22q12 12 26.5 17t29.5 5q33 0 56.5-23.5T760-560q0-30-19-52.5T692-640l-30-4-2-32q-5-69-57-116.5T480-840q-71 0-123 47.5T300-676l-2 32-30 6q-30 6-49 27t-19 51q0 33 23.5 56.5T280-480Zm202 266 108-210q-24 12-52 18t-58 6q-27 0-54.5-6T372-424l110 210Zm-2-446Z"/>} />
          <NavItem to="/customers" label="Customers" icon={<path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>} />
          <NavItem to="/invoice/create" label="Create Invoice" icon={<path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z"/>} />
          <NavItem to="/payments" label="Payments" icon={<path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z"/>} />
          <NavItem to="/expenses" label="Expenses" icon={<path d="M200-120q-33 0-56.5-23.5T120-200v-640h80v640h640v80H200Zm40-120v-360h160v360H240Zm200 0v-560h160v560H440Zm200 0v-200h160v200H640Z"/>} />
          <NavItem to="/reports" label="Reports" icon={<path d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>} />
        </nav>

        {/* 3. Bottom Section: Profile */}
        <div style={styles.profileSection} onClick={toggleProfile}>
          <div style={styles.profileLogoBox}>
            <img src={adminLogo} alt="Admin" style={styles.profileImage} />
          </div>
          <div style={styles.profileTextContent}>
            <span style={styles.profileName}>{user?.username}<br></br></span>
            <span style={styles.profileRole}>Admin</span>
          </div>
        </div>
      </aside>

      {/* --- Global Profile Modal --- */}
      {isProfileOpen && (
        <div style={styles.modalOverlay} onClick={toggleProfile}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>My Profile</h3>
              <button style={styles.closeBtn} onClick={toggleProfile}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.modalAvatarContainer}>
                <img src={adminLogo} alt="Admin" style={styles.modalAvatar} />
              </div>
              <p style={styles.modalRoleLabel}>Admin</p>

              <div style={styles.inputGroup}>
                {/* <label style={styles.inputLabel}>Username</label> */}
                {/* <div style={styles.inputBox}>{user.username}</div> */}
              </div>

              <div style={styles.inputGroup}>
                {/* <label style={styles.inputLabel}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.inputBox}
                /> */}
              </div>
              {/* <button style={styles.saveBtn} onClick={handleSaveEmail}>
                Save Changes
              </button> */}

              <button style={styles.logoutBtn} onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NavItem = ({ to, label, icon }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.link,
        backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
        color: isActive ? "#ffffff" : "#000000",
      })}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" style={{ marginRight: "10px" }}>
        {icon}
      </svg>
      {label}
    </NavLink>
  );
};

const styles = {
  sidebar: {
    width: "240px",
    height: "100vh",
    background: "linear-gradient(135deg, #258a90, #86a2b8, #b4ced2)",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    boxSizing: "border-box",
    position: "relative",
  },
  brand: { display: "flex", alignItems: "center", marginBottom: "32px", gap: "12px" },
  logo: { width: "45px", height: "auto", display: "block" },
  brandText: { margin: 0, fontSize: "20px", fontWeight: "700", color: "#ffffff" },
  subText: { fontSize: "12px", color: "#000000", fontWeight: "600" },
  nav: { display: "flex", flexDirection: "column", gap: "6px" },
  link: { display: "flex", alignItems: "center", textDecoration: "none", padding: "10px 12px", borderRadius: "6px", fontSize: "15px", fontWeight: "500", transition: "0.2s" },
  
  profileSection: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    padding: "16px 0",
    gap: "12px",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
  },
  profileLogoBox: { width: "50px", height: "50px", borderRadius: "50%", border: "2px solid #fff", overflow: "hidden" },
  profileImage: { width: "100%", height: "100%", objectFit: "cover" },
  profileName: { fontSize: "16px", fontWeight: "600", color: "#000000" },
  profileRole: { fontSize: "14px", color: "#000000", opacity: 0.8 },

  // --- Modal Styles ---
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Ensure it is above everything
  },
  modalContent: {
    width: "320px",
    background: "linear-gradient(180deg, #7da1a7, #adc6cc)", // Matches your screenshot
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
  },
  modalTitle: { margin: 0, fontSize: "18px", fontWeight: "bold" },
  closeBtn: { background: "none", border: "none", fontSize: "20px", cursor: "pointer" },
  modalBody: { padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" },
  modalAvatarContainer: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "3px solid #fff",
    overflow: "hidden",
    marginBottom: "10px",
    backgroundColor: "#2e5b6e",
  },
  modalAvatar: { width: "100%", height: "100%", objectFit: "cover" },
  modalRoleLabel: { fontWeight: "bold", fontSize: "16px", marginBottom: "20px" },
  inputGroup: { width: "100%", marginBottom: "15px" },
  inputLabel: { fontSize: "13px", fontWeight: "bold", marginBottom: "5px", display: "block" },
  inputBox: {
    width: "100%",
    padding: "10px",
    background: "transparent",
    border: "1.5px solid #333",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  saveBtn:{
    marginTop: "10px",
    padding: "10px 30px",
    background: "linear-gradient(to bottom, #4a6b82, #2d5a61)", // Matches button in image
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  },
  logoutBtn: {
    marginTop: "10px",
    padding: "10px 30px",
    background: "linear-gradient(to bottom, #4a6b82, #2d5a61)", // Matches button in image
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  },
};

export default Sidebar;