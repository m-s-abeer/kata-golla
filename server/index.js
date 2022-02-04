const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const gamesRoute = require("./routes/games");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/kata-golla", () => {
  console.log("Connected to DB");
});

app.use(cors());
app.use(bodyParser.json());
app.use("/api/game", gamesRoute);

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
