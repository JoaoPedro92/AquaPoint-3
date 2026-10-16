import { Router } from "express";
import { getAllTrustLevels, getTrustLevelById } from "../controllers/trustLevels.controller.js";

const router = Router();

router.get("/", getAllTrustLevels);
router.get("/:id", getTrustLevelById);

export default router;