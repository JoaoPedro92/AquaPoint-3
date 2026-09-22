import { Router } from "express";
import { getAllFavorites, getFavoriteById, getFavoriteByUserId, createFavorite, deleteByUserAndPointId } from "../controllers/favorites.controller.js";

const router = Router();

router.get("/", getAllFavorites);
router.get("/:id", getFavoriteById);
router.get("/user/:id", getFavoriteByUserId);
router.post("/", createFavorite);
router.delete("/", deleteByUserAndPointId);

export default router;