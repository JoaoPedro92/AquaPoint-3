import { Router } from "express";
import { authenticateUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/", authenticateUser);

export default router;