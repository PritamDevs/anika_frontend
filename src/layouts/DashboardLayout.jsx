// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/common/Sidebar";

// const DashboardLayout = () => {
//   return (
//     <div style={styles.wrapper}>
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content (NO NAVBAR) */}
//       <div style={styles.main}>
//         <div style={styles.content}>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     display: "flex",
//     width: "100vw",
//     height: "100vh",
//     backgroundColor: "#f4f6f8",
//   },
//   main: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//   },
//   content: {
//     flex: 1,
//     padding: "20px",
//     overflowY: "auto",
//   },
// };

// export default DashboardLayout;

import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setIsOpen(false); // reset sidebar on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={styles.wrapper}>
      
      {/* Sidebar */}
      {/* <Sidebar isMobile={isMobile} isOpen={isOpen} /> */}
      <Sidebar
  isMobile={isMobile}
  isOpen={isOpen}
  setIsOpen={setIsOpen}
/>

      {/* Main Content */}
      <div style={styles.main}>
        
        {/* Hamburger only on mobile */}
        {isMobile && (
          <button
            style={styles.hamburger}
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        )}

        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    width: "100%",
    height: "100vh",
    backgroundColor: "#f4f6f8",
    overflow: "hidden", // prevents horizontal scroll
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0, // VERY important for charts
  },
  content: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    overflowX: "hidden",
  },
  hamburger: {
    fontSize: "24px",
    padding: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};

export default DashboardLayout;