import { IEvent } from "@shared/types/api";
import * as express from "express";
import * as cors from "cors";
import * as http from "http";
import { Server, Socket } from "socket.io";
import handlers from "./requestHandlers";
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } }); //passed to cors
io.on("connection", (socket: Socket) => {
  const actions = Object.keys(handlers) as IEvent[];
  actions.forEach((action) => {
    socket.on(action, handlers[action]);
  });
});
app.use(express.json());
app.use(cors());

export function startServer(port: number) {
  server.listen(port, () => {
    console.log("Listening on port:", port);
  });
}
