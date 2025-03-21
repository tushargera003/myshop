import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
});

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.info("Please login to chat with us!", {
        position: "top-right",
        autoClose: 3000,
      });
      // Instead of showing a "Loading..." spinner, we let the component render a simple message.
      return;
    }
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
        socket.emit("joinRoom", res.data._id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserDetails();
  }, [token]);

  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      try {
        const adminId = "67cc5b11bf7771ee49194cf5";
        const conversationId = [user._id, adminId].sort().join("_");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/chat/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
        setUnreadCount(
          res.data.filter((msg) => msg.receiver === user._id && !msg.isRead)
            .length
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [user, token]);

  const handleNewMessage = useCallback(
    (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.receiver === user?._id) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    [user]
  );

  useEffect(() => {
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [handleNewMessage]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const adminId = "67cc5b11bf7771ee49194cf5";
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/send`,
        { receiverId: adminId, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      socket.emit("sendMessage", res.data);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // If there is no token, show a simple message.
  if (!token) {
    return (
      <div className="p-4 text-center text-gray-600">
        Please login to chat with us!
      </div>
    );
  }

  // Once token exists but user details are still loading, render nothing (or you could render a spinner)
  if (!user) return null;

  return (
    <div className="relative p-4 border rounded-lg">
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
                ? "bg-blue-100 ml-auto w-3/4"
                : "bg-gray-100 mr-auto w-3/4"
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
