import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Use WebSocket transport only
});

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null); // State to store user details

  // Get token from local storage
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch user details using the token
    const fetchUserDetails = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
          config
        );
        setUser(res.data); // Set user details in state

        // Join the user's room for private messaging
        socket.emit("joinRoom", res.data._id);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token]);

  useEffect(() => {
    if (!user) return; // Don't proceed if user details are not fetched yet

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/chat/admin`,
          config
        );
        setMessages(res.data);

        // Calculate unread messages
        const unread = res.data.filter(
          (msg) => msg.receiver === user._id && !msg.isRead
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.on("newMessage", (message) => {
      // Check if the message already exists in the state
      if (!messages.some((msg) => msg._id === message._id)) {
        setMessages((prev) => [...prev, message]);

        // If the new message is for the current user, increment unread count
        if (message.receiver === user._id) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("newMessage");
    };
  }, [token, user, messages]); // Add messages to dependency array

  const sendMessage = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/send`,
        { receiverId: "admin", message: newMessage },
        config
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading state until user details are fetched
  }

  return (
    <div>
      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <div className="bg-red-500 text-white rounded-full px-2 py-1 text-sm absolute top-0 right-0">
          {unreadCount}
        </div>
      )}

      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 my-1 rounded ${
              msg.sender === user._id
                ? "bg-blue-100 ml-auto w-3/4" // User's messages on the right
                : "bg-gray-100 mr-auto w-3/4" // Admin's messages on the left
            }`}
          >
            {msg.message}
            {!msg.isRead && msg.receiver === user._id && (
              <span className="text-xs text-gray-500"> (Unread)</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
