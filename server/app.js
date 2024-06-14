import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 3003;
const app = express();
const server = createServer(app);
const secretKEY = "secretkey";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "asdfasdfdsafdsfds" }, secretKEY);
  res
    .cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      status: "success",
      message: "Logged in successfully",
    });
});
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log(`a user connected , ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
  socket.on("message", ({ room, message }) => {
    // console.log(msg);
    console.log("room: ", room, "message:  ", message);
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (data) => {
    socket.join(data);
    console.log(`user with id: ${socket.id} joined room: ${data}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
