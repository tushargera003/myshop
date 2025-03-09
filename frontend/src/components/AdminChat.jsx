import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
});

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user details
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to the latest message

  // Fetch Admin Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/conversations`,
          config
        );
        setConversations(res.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [token]);

  // Fetch Messages Based on ConversationId
  const fetchMessages = async (conversationId) => {
    setSelectedConversation(conversationId);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/${conversationId}`,
        config
      );
      setMessages(res.data);

      // Mark messages as read
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/mark-as-read`,
        { conversationId },
        config
      );

      // Set selected user details
      const conversation = conversations.find(
        (c) => c.conversationId === conversationId
      );
      if (conversation) {
        setSelectedUser(conversation.sender); // Set sender as selected user
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Listen for New Messages in Real-Time
  const handleNewMessage = useCallback(
    (message) => {
      if (message.conversationId === selectedConversation) {
        setMessages((prev) => [...prev, message]);
      }
    },
    [selectedConversation]
  );

  useEffect(() => {
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [handleNewMessage]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send Message Function
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/send`,
        {
          receiverId: conversations.find(
            (c) => c.conversationId === selectedConversation
          ).sender._id,
          message: newMessage,
        },
        config
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
      socket.emit("sendMessage", res.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Conversations</h2>
        <ul>
          {conversations.map((conversation) => (
            <li
              key={conversation.conversationId}
              onClick={() => fetchMessages(conversation.conversationId)}
              className={`p-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-all ${
                selectedConversation === conversation.conversationId
                  ? "bg-blue-100 font-semibold"
                  : "bg-gray-50"
              }`}
            >
              <p className="text-gray-800">{conversation.sender.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {conversation.latestMessage}
              </p>
              {conversation.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col p-6">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Chat with {selectedUser?.name || "User"}
              </h2>
              <p className="text-sm text-gray-500">
                Email: {selectedUser?.email} | Phone: {selectedUser?.phone}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender === msg.receiver
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === msg.receiver
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
            </div>

            {/* Input Box */}
            <div className="flex items-center border-t border-gray-200 pt-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition-all"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">
              Select a conversation to view messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
