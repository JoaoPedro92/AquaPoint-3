import { Router } from "express";
import { getAllTrustLogs, getTrustLogById, getTrustLogByPointId, getTrustLogsByUserId, getTrustLogsByUserAndAquapointId, getMostRecentTrustLogByUserAndAquapointId, isVoteEnableByUserAndAquapointId, createTrustLog, deleteTrustLog } from "../controllers/trustLogs.controller.js";


const router = Router();

router.get("/", getAllTrustLogs);
router.get("/:id", getTrustLogById);
router.get("/aquapoint/:id", getTrustLogByPointId);
router.get("/user/:id", getTrustLogsByUserId);
router.get("/user/:userId/aquapoint/:pointId", getTrustLogsByUserAndAquapointId);
router.get("/user/:userId/aquapoint/:pointId/most-recent", getMostRecentTrustLogByUserAndAquapointId);
router.get("/user/:userId/aquapoint/:pointId/is-vote-enable", isVoteEnableByUserAndAquapointId);
router.post("/", createTrustLog);
router.delete("/", deleteTrustLog);

export default router;