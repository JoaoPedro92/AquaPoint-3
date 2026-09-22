import { Router } from "express";
import { getAllUsers, getUserById, getUserProfilePicture, createUser, comparePasswords, updateUser, updatePassword, changeIsAdmin, deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUsers);       
router.get("/:id", getUserById);
router.get("/:id/profile-picture", getUserProfilePicture);
router.post('/', createUser);
router.post('/compare-passwords', comparePasswords);
router.put('/:id', updateUser);
router.put('/:id/change-isadmin', changeIsAdmin);
router.put('/:id/update-password', updatePassword);
router.delete('/:id', deleteUser);

export default router;