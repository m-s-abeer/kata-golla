const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const gamesRoute = require("./routes/games");
const bodyParser = require("body-parser");
const {
  get_player_init_info,
  remove_player,
} = require("./services/player_services");
const { make_a_move } = require("./services/game_services");

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
  console.log(socket.id, "connected");
  socket.on("disconnect", async () => {
    await remove_player(io, socket.id);
    console.log(`User Disconnected! Socket id: ${socket.id}`);
  });

  socket.on("join_game", async (game_id) => {
    let game_sockets = io.sockets.adapter.rooms.get(game_id);
    let player_count = game_sockets ? game_sockets.size : 0;

    if (player_count < 2) {
      player_init_info = await get_player_init_info(
        game_sockets,
        socket.id,
        game_id
      );

      socket.emit("join_game_success", {
        data: player_init_info,
      });

      await socket.join(game_id);
      if (player_count === 1) {
        await io.to(game_id).emit("game_ready", true);
      }
    } else {
      await socket.emit("join_game_error", {
        message:
          "Too late buddy! Are you really invited? Sad life! Try creating another.",
      });
    }
  });

  let endGameCallback = (socket_id, win) => {
    io.to(socket_id).emit("end_game", win);
  };

  socket.on("make_move", async (row_id, col_id) => {
    try {
      const game = await make_a_move(socket, row_id, col_id, endGameCallback);
      if (game && game !== {}) {
        await io.to(game._id.toString()).emit("game_updated", game);
      }
    } catch (e) {
      console.log(e);
    }
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING!");
});
