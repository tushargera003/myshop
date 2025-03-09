import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const token = localStorage.getItem("token"); // Get token from session

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on("newMessage", (message) => {
      if (selectedUser && message.sender === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => newSocket.disconnect();
  }, [selectedUser]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const selectUser = async (user) => {
    setSelectedUser(user);
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/messages/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = { receiver: selectedUser._id, content: newMessage };
    socket.emit("sendMessage", messageData);
    setMessages([...messages, { sender: "admin", content: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => selectUser(user)}
            className={`p-2 mb-2 cursor-pointer rounded-lg ${
              selectedUser?._id === user._id ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            {user.name}
          </div>
        ))}
      </div>
      {/* Chat Window */}
      <div className="w-3/4 flex flex-col bg-gray-100">
        <div className="p-4 bg-blue-600 text-white font-bold">
          {selectedUser ? selectedUser.name : "Select a user to chat"}
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === "admin"
                  ? "bg-blue-300 self-end"
                  : "bg-gray-300 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        {/* Message Input */}
        {selectedUser && (
          <div className="p-4 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
