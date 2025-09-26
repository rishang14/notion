import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 8000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpserver = createServer(handler);

  const io = new Server(httpserver);

  io.on("connection", (socket) => {
    socket.on("createRoom", (fileid) => {
      socket.join(fileid);
    });

    socket.on("send-changes", (delta, fileid) => {
      console.log("CHANGE");
      socket.to(fileid).emit("receive-changes", delta, fileid);
    });

    socket.on("cursor-move", (range,cursorid, fileid) => {
         socket.to(fileid).emit('receive-cursor-move', range, fileid, cursorid);
    });
  });

  httpserver
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
