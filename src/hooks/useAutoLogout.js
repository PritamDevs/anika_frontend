import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (timeout = 15 * 60 * 1000) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        localStorage.removeItem("token");
        alert("Session expired due to inactivity");
        navigate("/");
      }, timeout);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [navigate, timeout]);
};

export default useAutoLogout;