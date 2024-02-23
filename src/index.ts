import * as bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { exit } from "process";
const cors = require("cors");

import client from "./client";

import { basicErrorHandler } from "./middlewares/errorMiddlewars";
import { isClientReady } from "./middlewares/initMiddlewares";

import groupsRouter from "./routes/groupsRouter";
import usersRouter from "./routes/usersRouter";

const app = express();

app.use(cors());
app.use(
  bodyParser.json({
    verify: (req, res, buf, enc) => {
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        throw new Error("Invalid JSON");
      }
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(basicErrorHandler);
app.use(`//users`, usersRouter)
app.use(`/groups`, groupsRouter)

const PORT = process.env.PORT || 3000;

client
  .initialize()
  .then(() => {
    console.log("Client initialized!");
  })
  .catch((err) => {
    console.error("Error initializing client", err);
    exit(1);
  });

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello World!",
  });
});

app.get("/status", isClientReady, (req: Request, res: Response) => {
  res.status(200).send({
    message: "Client is ready and authenticated",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
