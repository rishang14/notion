import { createServer } from "node:http";
import { Server } from "socket.io";

const port = 8000;

const httpserver = createServer();

const io = new Server(httpserver, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("createRoom", (fileid) => socket.join(fileid));
  socket.on("send-changes", (delta, fileid) => {
    console.log("CHANGE");
    socket.to(fileid).emit("receive-changes", delta, fileid);
  });
  socket.on("cursor-move", (range, cursorid, fileid) => {
    socket.to(fileid).emit("receive-cursor-move", range, fileid, cursorid);
  });
});

httpserver.listen(port, () => console.log(`Socket.IO server running on ${port}`));
