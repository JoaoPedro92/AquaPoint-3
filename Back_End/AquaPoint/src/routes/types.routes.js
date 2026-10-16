import { Router } from "express";
import { getAllTypes, getTypeById } from "../controllers/types.controller.js";

const router = Router();

router.get("/", getAllTypes);
router.get("/:id", getTypeById);

export default router;