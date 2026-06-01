import "./LoginLoader.css";

function LoginLoader() {
    return (
        <div className="login-loader-overlay">
            <div className="login-loader-content">
                <img
                    src="/logo.png"
                    alt="Anika Enterprise"
                    className="login-loader-logo"
                />

                <h1 className="login-loader-title">
                    ANIKA ENTERPRISE
                </h1>

                <div className="login-loader-bar">
                    <div className="login-loader-progress"></div>
                </div>

                <p className="login-loader-text">
                    Signing In...
                </p>
            </div>
        </div>
    );
}

export default LoginLoader;