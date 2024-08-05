import React from "react";

const ColorShiftingHeader: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%", // Add this to make it take full height
    padding: "0", // Remove padding
    margin: "0", // Remove margin
    background:
      "linear-gradient(90deg, #FF5E3A, #FF2A68, #FF9500, #FFCC00, #4CD964, #5AC8FA, #007AFF, #5856D6, #FF2D55)",
    backgroundSize: "1800% 100%",
    animation: "gradientAnimation 15s ease infinite",
    position: "absolute", // Add this to position it absolutely
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%", // Make the container take full height
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <svg
          width="300"
          height="150"
          viewBox="0 0 150 150"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="logoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F0F0F0" />
            </linearGradient>
          </defs>

          <text
            x="75"
            y="120"
            fontFamily="Inter, sans-serif"
            fontSize="40"
            fontWeight="bold"
            fill="#ffffff"
            textAnchor="middle"
          ></text>
        </svg>
      </div>
    </header>
  );
};

export default ColorShiftingHeader;
