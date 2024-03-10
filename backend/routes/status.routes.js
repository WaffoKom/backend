import express from "express";
const router = express.Router();
import {
  createStatus,
  getAllStatusesArticles,
  getStatusArticleById,
  updateArticleStatus,
  deleteArticleStatus,
} from "../controllers/status.controllers.js";

// Créer un statut
router.post("/a", createStatus);

// Obtenir tous les statuts
router.get("/articles/status/", getAllStatusesArticles);

// Obtenir un statut par son ID
router.get("/articles/statut/:id", getStatusArticleById);

// Modifier un statut
router.put("/articles/statut/:id/update", updateArticleStatus);

// Supprimer un statut
router.delete("/articles/statut/:id/delete", deleteArticleStatus);

export default router;
