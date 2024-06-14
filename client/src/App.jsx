import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3003"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      setSocketId(socket.id);
    });
    socket.on("welcome", (data) => {
      console.log(data);
    });
    socket.on("receive-message", (data) => {
      // console.log("message received", data);
      setMessages((messages) => [...messages, data]);
    });
  }, []);
  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    setRoom("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  return (
    <Container maxWidth="sm">
      <Box height={300} />
      {/* <Typography variant="h6">{socketId}</Typography> */}
      <h5>Join room</h5>
      <form onSubmit={joinRoomHandler}>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="room-name"
          variant="outlined"
        >
          {" "}
        </TextField>
        <Button variant="contained" color="primary" type="submit">
          join
        </Button>
      </form>
      <form onSubmit={submitHandler}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="message"
          variant="outlined"
        >
          {" "}
        </TextField>
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="room"
          variant="outlined"
        >
          {" "}
        </TextField>
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((message, index) => (
          <Typography key={index}>{message}</Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
