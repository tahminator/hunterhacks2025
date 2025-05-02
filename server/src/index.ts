import { apiRouter } from "@/api";
import "dotenv/config";
import express from "express";
import morgan from "morgan";

export const app = express();

app.use(morgan("tiny"));

app.use("/api", apiRouter);

const server = app.listen(3000);

try {
  const serverMetadata = server.address() as { address: string; port: number };
  console.log(
    `\n\nServer listening on http://${
      serverMetadata.address === "::" ? "127.0.0.1" : serverMetadata.address
    }:${serverMetadata.port}`,
  );
} catch (e) {
  console.error(e);
}
