import { IEmitterMap } from "@shared/types/api";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { createListeners } from "./requestHandlers";
const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } }); //passed to cors
//Do not provde type explicitly(with IEmitterMap, IListenerMap) to socket
io.on("connection", (socket: Socket) => {
  const listeners = createListeners(socket);
  const actions = Object.keys(listeners) as (keyof IEmitterMap)[];
  actions.forEach((action) => {
    socket.on(action, listeners[action]);
  });
});

const port = 5151; //TODO make it optional

export function startServer(resolve?: () => void) {
  server.listen(port, () => {
    console.log("Backend process started on port:", port);
    if (resolve) {
      resolve();
    }
  });
}
