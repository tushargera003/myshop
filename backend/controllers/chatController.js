import ChatMessage from "../models/chatModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";

// Send a message
export const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;

  try {

    let receiver;
    if (receiverId === "admin") {
      // If receiver is "admin", find the admin user
      receiver = await User.findOne({ role: "admin" });
    } else {
      // For other users, use the provided receiverId
      receiver = await User.findById(receiverId);
    }

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const newMessage = new ChatMessage({
      sender: req.user._id,
      receiver: receiver._id, // Use the ObjectId of the receiver
      message,
      isRead: false, // New messages are unread by default
    });

    await newMessage.save();

    // Emit the new message to the receiver
    const io = req.app.get("socketio"); // Get the socket object
    io.to(receiver._id.toString()).emit("newMessage", newMessage); // Send to specific receiver

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  const { receiverId } = req.params;

  try {

    let receiver;
    if (receiverId === "admin") {
      // If receiver is "admin", find the admin user
      receiver = await User.findOne({ role: "admin" });
      if (!receiver) {
        return res.status(404).json({ message: "Admin user not found" });
      }
    } else {
      // For other users, use the provided receiverId
      if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: "Invalid receiver ID" });
      }
      receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
    }

    // Fetch messages between the current user and the receiver
    const query = {
      $or: [
        { sender: req.user._id, receiver: receiver._id }, // Messages sent by the current user to the receiver
        { sender: receiver._id, receiver: req.user._id }, // Messages sent by the receiver to the current user
      ],
    };

    const messages = await ChatMessage.find(query).sort({ createdAt: 1 });

    // Mark messages as read if the current user is the receiver
    await ChatMessage.updateMany(
      { receiver: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark a message as read
export const markAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.isRead = true;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const adminGetUsers = async (req, res) => {
    try {
      // Find the admin user
      const adminUser = await User.findOne({ role: "admin" });
      if (!adminUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }
  
      // Find all unique users who have sent messages to the admin
      const users = await ChatMessage.aggregate([
        {
          $match: { receiver: adminUser._id }, // Filter messages sent to the admin
        },
        {
          $group: {
            _id: "$sender", // Group by sender (user who sent the message)
          },
        },
        {
          $lookup: {
            from: "users", // Join with the User collection
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user", // Unwind the joined user data
        },
        {
          $project: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            phone: "$user.phone",
          },
        },
      ]);
  
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
