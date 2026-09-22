import { Router } from "express";
import { getAllZones, getZoneById, getZoneByName, addNewZone } from "../controllers/zones.controller.js";

const router = Router();

router.get("/", getAllZones);
router.get("/:id", getZoneById);
router.get("/name/:name", getZoneByName);
router.post("/", addNewZone);

export default router;