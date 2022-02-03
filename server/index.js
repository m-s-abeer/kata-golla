const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { nanoid } = require("nanoid");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("disconnect", () => {
    console.log(`User Disconnected! Socket id: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING!");
});

app.get("/api/game/create", (req, res) => {
  const uuid = nanoid();
  return res.send({
    uuid: uuid,
  });
});
