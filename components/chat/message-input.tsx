import React, { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { SendIcon } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      // Focus the textarea after submission
      textareaRef.current?.focus();
    }
  };

  // Focus the textarea when the component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-2xl mx-auto p-4"
    >
      <div className="bg-background border-t px-4 py-2">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            className="pr-16 resize-none"
          />
          <Button type="submit" size="icon" className="absolute top-2 right-2">
            <SendIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
