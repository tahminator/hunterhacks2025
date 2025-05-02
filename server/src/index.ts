import { apiRouter } from "@/api";
import { authMiddleware } from "@/middleware/auth";
import { cookieParser } from "@/middleware/cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser);
app.use(authMiddleware);

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
