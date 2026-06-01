import "./DataLoader.css";

const DataLoader = ({
    title,
    subtitle
}) => {
    return (
        <div className="data-loader">
            <div className="loader-spinner" />

            <div>
                <div className="loader-title">
                    {title}
                </div>

                <div className="loader-subtitle">
                    {subtitle}
                </div>
            </div>
        </div>
    );
};

export default DataLoader;