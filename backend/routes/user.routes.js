import express from "express";
import addUser, {
  updateUser,
  deleteUser,
  deleteAllUsers,
} from "../controllers/user.controllers.js";
import {
  getUsers,
  getUserOne,
  isAdmin,
  isUser,
} from "../models/user.models.js";

const router = express.Router();

// Route pour gérer l'ajout d'utilisateur

router.post("/utilisateurs", isAdmin, addUser);
router.get("/utilisateurs", isAdmin, getUsers);
router.get("/utilisateur/:id", isAdmin, getUserOne);
router.put("/utilisateur/:id/update", isAdmin, updateUser);
router.delete("/utilisateur/:id", isAdmin, deleteUser);
router.delete("/utilisateurs", isAdmin, deleteAllUsers);

export default router;
