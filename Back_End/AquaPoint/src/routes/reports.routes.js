import { Router } from "express";
import { getAllReports, getReportById, getReportsByUserId, getReportByPointId, createReport, deleteReport } from "../controllers/reports.controller.js";

const router = Router();

router.get("/", getAllReports);       
router.get("/:id", getReportById);  
router.get("/user/:id", getReportsByUserId);
router.get("/aquapoint/:id", getReportByPointId);
router.post("/", createReport);
router.delete("/:id", deleteReport);

export default router;