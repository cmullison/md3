import ChatInterface from "@/components/chat/chat-interface";

export default function Page() {
  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto items-center justify-center text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3v12h18V3m-9 9h6m-6 0H3m0 0V3m0 9V3"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700">No Items Found</h2>
        <p className="text-gray-500"></p>
      </div>
    </div>
  );
}
