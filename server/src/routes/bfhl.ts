import { Router, Request, Response } from "express";
import { processData } from "../utils/processData";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const { data } = req.body as { data?: unknown };
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "data must be an array of strings" });
  }
  return res.json(processData(data));
});

export default router;
