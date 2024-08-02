import React from "react";
import { MessageCircle } from "lucide-react";

const EmptyChatState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 max-w-xs mx-auto">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-primary mb-1 sm:mb-2">
        No messages yet
      </h3>
      <p className="text-xs sm:text-sm text-gray-500">
        Start a conversation by sending a message. Your chat history will appear
        here.
      </p>
    </div>
  );
};

export default EmptyChatState;
