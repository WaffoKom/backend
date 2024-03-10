import express from "express";
import createArticle, {
  deleteArticle,
  updateArticle,
} from "../controllers/articles.controllers.js";
import { getArticleById, getArticles } from "../models/articles.models.js";
import { authorize, isAdmin, isUser } from "../models/user.models.js";

const router = express.Router();

router.post("/articles/admin", createArticle);
router.delete("/article/:id/admin", deleteArticle);
router.get("/article/:id/admin", getArticleById);
router.get("/articles/admin", isAdmin, getArticles);
router.put("/article/:id/admin", isAdmin, updateArticle);

export default router;
