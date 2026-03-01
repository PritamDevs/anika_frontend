import { Outlet } from "react-router-dom";
import bgImage from "../assets/1.png";

const AuthLayout = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Outlet />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    minHeight: "100vh",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    backgroundImage: `
      linear-gradient(
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0)
      ),
      url(${bgImage})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "20px",

    backgroundColor: "rgba(255, 255, 255, 0.58)",
    backdropFilter: "blur(3px)",

    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },
};

export default AuthLayout;
