import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "15px"
        }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: "#64748b" }}>Reloading automatically...</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;