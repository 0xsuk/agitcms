import { IEvent } from "@shared/types/api";
import * as cors from "cors";
import * as express from "express";
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

const port = 5151; //TODO make it optional

export function startServer(resolve?: () => void) {
  server.listen(port, () => {
    console.log("Backend process started on port:", port);
    if (resolve) {
      resolve();
    }
  });
}
