import React, { useState } from "react";
import FAQChatbot from "./FAQChatbot";
import LiveChat from "./LiveChat";

const ChatWindow = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <div className="fixed bottom-20 right-5 w-96 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">Chat Support</h2>
        <button onClick={onClose} className="hover:text-gray-200">
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("faq")}
          className={`flex-1 p-2 ${
            activeTab === "faq" ? "bg-blue-100 text-blue-600" : "bg-gray-100"
          }`}
        >
          FAQ Chatbot
        </button>
        <button
          onClick={() => setActiveTab("live")}
          className={`flex-1 p-2 ${
            activeTab === "live" ? "bg-blue-100 text-blue-600" : "bg-gray-100"
          }`}
        >
          Live Chat
        </button>
      </div>

      {/* Content */}
      <div className="p-4 h-96 overflow-y-auto">
        {activeTab === "faq" ? <FAQChatbot /> : <LiveChat />}
      </div>
    </div>
  );
};

export default ChatWindow;
