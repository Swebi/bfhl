import express from "express";
import cors from "cors";
import bfhlRouter from "./routes/bfhl";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/bfhl", bfhlRouter);

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST ?? "0.0.0.0";
app.listen(PORT, HOST, () =>
  console.log(`Server listening on http://${HOST}:${PORT}`)
);
