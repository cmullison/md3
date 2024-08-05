import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  createdAt: string | Date;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  createdAt,
}) => {
  const createdAtString =
    createdAt instanceof Date
      ? createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#3d36ff",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            color: "#160f39",
            fontSize: "24px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Welcome, {firstName} {lastName}!
        </h1>
        <p
          style={{
            color: "#e1e1e1",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "20px",
          }}
        >
          Thank you for joining our community! We&#39;re excited to have you on
          board.
        </p>
        <p
          style={{
            color: "#f0f0f0",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "20px",
          }}
        >
          You&#39;ve been a valued member since{" "}
          <strong>{createdAtString}</strong>. We look forward to providing you
          with an exceptional experience.
        </p>
        <p
          style={{
            color: "#dbdbdb",
            fontSize: "16px",
            lineHeight: "1.5",
            marginTop: "30px",
            textAlign: "right",
          }}
        >
          Best regards,
          <br />
          <strong>Chris</strong>
        </p>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#e2e2e2",
          fontSize: "14px",
        }}
      >
        © 2024 Mulls Design. All rights reserved.
      </div>
    </div>
  );
};
