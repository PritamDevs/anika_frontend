import { useState } from "react";

const HoverButton = ({ style, hoverStyle, children, ...props }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <button
      {...props}
      style={{ ...style, ...(isHover ? hoverStyle : {}) }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {children}
    </button>
  );
};

export default HoverButton;
