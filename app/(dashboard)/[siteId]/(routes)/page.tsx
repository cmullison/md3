import ChatInterface from "@/components/chat/chat-interface";
import EmailTest from "@/components/email-test";
import ColorShiftingHeader from "@/components/gradient";

export default function Page() {
  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto items-center justify-center text-center">
      <div className="flex flex-col items-center justify-center mb-12">
        <EmailTest />
      </div>
    </div>
  );
}
