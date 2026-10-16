import { Router } from "express";
import { getAllStates, getStateById } from "../controllers/states.controller.js";

const router = Router();

router.get("/", getAllStates);
router.get("/:id", getStateById);

export default router;