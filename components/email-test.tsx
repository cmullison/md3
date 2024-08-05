import React from "react";

const EmailTest: React.FC = () => {
  const firstName = "John";
  const lastName = "Doe";
  const createdAt = new Date("2024-01-01");

  const createdAtString = createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#2c2c2c",
        borderRadius: "12px",
      }}
    >
      <header
        style={{
          width: "100%",
          padding: "30px 0",
          marginBottom: "30px",
          background:
            "linear-gradient(90deg, #FF5E3A, #FF2A68, #FF9500, #FFCC00, #4CD964, #5AC8FA, #007AFF, #5856D6, #FF2D55)",
          backgroundSize: "1800% 100%",
          animation: "gradientAnimation 15s ease infinite",
        }}
      >
        <style>{`
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `}</style>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              y="130"
              fontFamily="Inter, sans-serif"
              fontSize="40"
              fontWeight="bold"
              fill="#ffffff"
              textAnchor="middle"
            >
              Mulls Design
            </text>
          </svg>
        </div>
      </header>
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            color: "#e0e0e0",
            fontSize: "28px",
            marginBottom: "20px",
            textAlign: "center",
            borderBottom: "2px solid #444",
            paddingBottom: "10px",
          }}
        >
          Welcome, {firstName} {lastName}!
        </h1>
        <div style={{ color: "#cccccc", fontSize: "16px", lineHeight: "1.6" }}>
          <p style={{ marginBottom: "20px" }}>
            Thank you for joining our community! We&#39;re thrilled to have you
            on board and can&#39;t wait to see what you&#39;ll accomplish with
            us.
          </p>
          <p style={{ marginBottom: "20px" }}>
            You&#39;ve been a valued member since{" "}
            <strong style={{ color: "#4a90e2" }}>{createdAtString}</strong>. To
            help you get started, here are a few things you can do:
          </p>
          <ul style={{ marginBottom: "20px", paddingLeft: "20px" }}>
            <li>Complete your profile</li>
            <li>Explore our latest features</li>
            <li>Connect with other members</li>
            <li>Check out our getting started guide</li>
          </ul>
          <p style={{ marginBottom: "20px" }}>
            If you have any questions or need assistance, don&#39;t hesitate to
            reach out to our support team. We&#39;re here to help!
          </p>
          <div
            style={{
              backgroundColor: "#333",
              padding: "15px",
              borderRadius: "6px",
              marginTop: "30px",
            }}
          >
            <p style={{ margin: 0, fontStyle: "italic" }}>
              &#34;The beginning is the most important part of the work.&#34; -
              Plato
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: "30px",
            textAlign: "right",
            color: "#e0e0e0",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          Best regards,
          <br />
          <strong style={{ color: "#4a90e2" }}>Chris</strong>
          <br />
          <span style={{ fontSize: "14px", color: "#888" }}>
            Customer Success Manager
          </span>
        </div>
      </div>
      <footer
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#888",
          fontSize: "14px",
        }}
      >
        <p style={{ margin: "5px 0" }}>
          © 2024 Mulls Design. All rights reserved.
        </p>
        <p style={{ margin: "5px 0" }}>
          123 Tech Street, San Francisco, CA 94122
        </p>
        <div style={{ marginTop: "10px" }}>
          <a
            href="#"
            style={{
              color: "#4a90e2",
              textDecoration: "none",
              margin: "0 10px",
            }}
          >
            Unsubscribe
          </a>
          |
          <a
            href="#"
            style={{
              color: "#4a90e2",
              textDecoration: "none",
              margin: "0 10px",
            }}
          >
            Privacy Policy
          </a>
          |
          <a
            href="#"
            style={{
              color: "#4a90e2",
              textDecoration: "none",
              margin: "0 10px",
            }}
          >
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
};

export default EmailTest;
