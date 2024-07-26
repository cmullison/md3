import React from "react";
import { MessageCircle } from "lucide-react";

const EmptyChatState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        No messages yet
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        Start a conversation by sending a message. Your chat history will appear
        here.
      </p>
    </div>
  );
};

export default EmptyChatState;
