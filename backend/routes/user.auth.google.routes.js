import express from "express";
import {
  googleLogin,
  googleCallback,
  authenticateJWT,
  logout,
} from "../controllers/google.controllers.js";

const router = express.Router();

// Exemple de route protégée par JWT
const protectedRoute = (req, res) => {
  // L'utilisateur est authentifié, accéder aux ressources protégées
  res.json({ message: "Accès autorisé" });
};

// Définition des routes
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/logout", logout);
router.get("/protected", authenticateJWT, protectedRoute);

export default router;
