import { Router } from "express";
import { getAllLocals, getLocalById, getLocalByName, addNewLocal } from "../controllers/locals.controller.js";

const router = Router();

router.get("/", getAllLocals);
router.get("/:id", getLocalById);
router.get("/name/:name", getLocalByName);
router.post("/", addNewLocal);

export default router;