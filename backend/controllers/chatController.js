import ChatMessage from "../models/chatModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";


export const sendMessage = async (req, res) => {
  const { receiverId, message, orderId, productId } = req.body;

  try {
    // Validate required fields
    if (!receiverId || !message) {
      return res.status(400).json({ message: "Receiver ID and message are required" });
    }

    // Validate receiverId format
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    // Find the receiver user
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Generate conversationId
    const conversationId = [req.user._id, receiverId].sort().join("_");

    // Create and save the new message
    const newMessage = new ChatMessage({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      message,
      isAdmin: req.user.role === "admin", // Set isAdmin based on sender's role
      orderId: orderId || null, // Link to an order (if provided)
      productId: productId || null, // Link to a product (if provided)
    });

    await newMessage.save();

    // Emit the new message to both the sender and receiver via socket
    const io = req.app.get("socketio");
    io.to(receiverId).emit("newMessage", newMessage); // Emit to the receiver's room
    io.to(req.user._id).emit("newMessage", newMessage); // Emit to the sender's room

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};







// Get messages between two users
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    // Validate conversationId
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    // Fetch messages for the conversation
    const messages = await ChatMessage.find({ conversationId }).sort({
      createdAt: 1,
    });


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

// export const adminGetUsers = async (req, res) => {
//     try {
//       // Find the admin user
//       const adminUser = await User.findOne({ role: "admin" });
//       if (!adminUser) {
//         return res.status(404).json({ message: "Admin user not found" });
//       }
  
//       // Find all unique users who have sent messages to the admin
//       const users = await ChatMessage.aggregate([
//         {
//           $match: { receiver: adminUser._id }, // Filter messages sent to the admin
//         },
//         {
//           $group: {
//             _id: "$sender", // Group by sender (user who sent the message)
//           },
//         },
//         {
//           $lookup: {
//             from: "users", // Join with the User collection
//             localField: "_id",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         {
//           $unwind: "$user", // Unwind the joined user data
//         },
//         {
//           $project: {
//             _id: "$user._id",
//             name: "$user.name",
//             email: "$user.email",
//             phone: "$user.phone",
//           },
//         },
//       ]);
  
//       res.json(users);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   };

export const adminGetConversations = async (req, res) => {
  try {
    const adminId = req.user._id; // Admin's ID

    // Fetch all unique conversations involving the admin
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(adminId) }, // Use `new` keyword
            { receiver: new mongoose.Types.ObjectId(adminId) }, // Use `new` keyword
          ],
        },
      },
      {
        $group: {
          _id: "$conversationId",
          latestMessage: { $last: "$$ROOT" }, // Get the latest message in the conversation
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ["$isRead", false] }, 1, 0], // Count unread messages
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $unwind: { path: "$sender", preserveNullAndEmptyArrays: true }, // Unwind sender
      },
      {
        $unwind: { path: "$receiver", preserveNullAndEmptyArrays: true }, // Unwind receiver
      },
      {
        $project: {
          conversationId: "$_id",
          latestMessage: "$latestMessage.message",
          unreadCount: 1,
          sender: {
            _id: "$sender._id",
            name: "$sender.name",
            email: "$sender.email",
            phone: "$sender.phone",
          },
          receiver: {
            _id: "$receiver._id",
            name: "$receiver.name",
            email: "$receiver.email",
            phone: "$receiver.phone",
          },
        },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in adminGetConversations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


  export const getAdminUser = async (req, res) => {
    try {
      console.log("Fetching admin user...");
      const adminUser = await User.findOne({ role: "admin" });
      if (!adminUser) {
        console.log("Admin user not found in the database.");
        return res.status(404).json({ message: "Admin user not found" });
      }
      console.log("Admin user found:", adminUser);
      res.status(200).json(adminUser);
    } catch (error) {
      console.error("Error fetching admin user:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


