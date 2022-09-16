import { randomid } from "@shared/utils/randomid";
import * as express from "express";
import { Action, IPostData } from "@shared/types/api";
import * as cors from "cors";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.post("/", (req, res) => {
  const postData = req.body as IPostData;

  console.log(Action.readConfig);
  switch (postData.action) {
    case Action.readConfig:
      console.log("read config!:", postData.payload);
  }

  res.send("Hi");
});

export function startServer(port: number) {
  console.log(randomid());

  app.listen(port, () => {
    console.log("Listening on port:", port);
  });
}
