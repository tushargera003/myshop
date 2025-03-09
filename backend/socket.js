import { Server } from "socket.io";

let io; // Define io globally

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://myshop-teal-nine.vercel.app",
        "https://myshop-pro.vercel.app",
        "https://myshop-pro-git-main-tushar-geras-projects.vercel.app",
        "https://myshop-rbiw5xtjf-tushar-geras-projects.vercel.app",
      ],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", (message) => {
      io.emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
};

export { setupSocket, io }; // Export setupSocket & io
