import Article from "../models/articles.models.js";
import mongoose from "mongoose";
// import { faker } from "@faker-js/faker";

const createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json({ message: "Article created successfully", article });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Extract validation errors from the error object
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ error: "Validation error", validationErrors });
    } else {
      // Handle other types of errors
      console.error(error); // Log the error for debugging
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  }
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;

  // Validation de l'ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID d'article invalide." });
  }

  try {
    const article = await Article.findByIdAndDelete(id, {
      $set: {
        deletedAt: Date.now(),
      },
    });
    if (!article) {
      return res.status(404).json({ error: "Article introuvable." });
    }
    res
      .status(200)
      .json({ message: "Article supprimé avec succès !", article });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression de l'article.",
    });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags, image, summary } = req.body;

  // Validation de l'ID et des données

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID d'article invalide." });
  }

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Tous les champs obligatoires ne sont pas remplis." });
  }

  // Création des modifications
  const updates = {
    title,
    content,
    category,
    tags,
    image,
    summary,
    deletedAt: req.body.deletedAt ? Date.now() : null,
  };

  // Options de mise à jour
  const options = { new: true }; // Renvoie l'article mis à jour

  try {
    const article = await Article.findByIdAndUpdate(id, updates, options);
    if (!article) {
      return res.status(404).json({ error: "Article introuvable." });
    }
    res
      .status(200)
      .json({ message: "Article mis à jour avec succès !", article });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour de l'article.",
    });
  }
};

export { deleteArticle, updateArticle };
export default createArticle;
