import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex mx-4 space-x-2">
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
  );
};

export default TypingIndicator;
