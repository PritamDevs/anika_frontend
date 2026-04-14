import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (timeout = 15 * 60 * 1000) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        localStorage.removeItem("token");
        alert("Session expired due to inactivity");
        navigate("/login");
      }, timeout);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer(); // start timer

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [navigate, timeout]);
};

export default useAutoLogout;