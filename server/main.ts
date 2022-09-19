import { IEmitterMap } from "@shared/types/api";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { createListeners } from "./requestHandlers";
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } }); //passed to cors
//Do not provde type explicitly(with IEmitterMap, IListenerMap) to socket
io.on("connection", (socket: Socket) => {
  const listeners = createListeners(socket);
  const actions = Object.keys(listeners) as (keyof IEmitterMap)[];
  actions.forEach((action) => {
    socket.on(action, listeners[action]);
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
