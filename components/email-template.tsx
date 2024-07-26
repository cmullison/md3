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
    createdAt instanceof Date ? createdAt.toISOString() : createdAt;

  return (
    <div>
      <h1>
        Welcome, {firstName} {lastName}
      </h1>
      <p>
        Thanks for joining! You`&apos;`ve been a member since {createdAtString}
      </p>
      <p>- Chris</p>
    </div>
  );
};
