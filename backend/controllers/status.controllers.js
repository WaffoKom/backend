import mongoose from "mongoose";
import Article from "../models/articles.models.js";

const updateArticleStatus = async (req, res) => {
  const { id, status } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "ID d'article invalide" });
  }

  if (!["brouillon", "publié", "archivé", "En attente"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  const article = await Article.findByIdAndUpdate({ _id: id }, { status });

  if (!article) {
    return res.status(404).json({ error: "Article introuvable" });
  }

  // **Ajout de fonctionnalités supplémentaires**

  // Envoyer une notification par email
  if (status === "publié") {
    // ... code pour envoyer une notification par email
  }

  // Enregistrer l'historique des changements de statut
  const statusChange = {
    previousStatus: article.status,
    newStatus: status,
    timestamp: Date.now(),
  };
  article.statusHistory.push(statusChange);
  await article.save();

  res.json({ message: "Statut de l'article mis à jour avec succès" });
};

export { updateArticleStatus };
