import mongoose from "mongoose";
import Comment from "../models/comments.models.js";

const ReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
});

const Reply = mongoose.model("Reply", ReplySchema);

export { Reply };
// Recupere toutes les reponses d'un commentaire specifique
export async function getAllRepliesComment(req, res) {
  const { commentId } = req.params;

  try {
    // Validation des données
    if (!commentId) {
      res.status(400).send({ error: "Données invalides" });
    }

    // Recherche du commentaire
    const comment = await Comment.findById(commentId).populate("replies");
    if (!comment) {
      res.status(400).send({ error: "Commentaire non trouvé" });
    }

    // Récupération des réponses
    const replies = comment.replies;

    return replies;
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}
// Recupere toutes les reponses aux commentaires  de tout les commentaires
export async function getAllReplies(req, res) {
  try {
    // Récupération de tous les commentaires avec leurs réponses
    const comments = await Comment.find({}).populate("replies");

    // Extraction de toutes les réponses
    const replies = comments.reduce((acc, comment) => {
      return acc.concat(comment.replies);
    }, []);

    return replies;
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}
// Recupere la reponse a un commnentaire specifique
export async function getReplyComment(req, res) {
  const { commentId, replyId } = req.params;

  try {
    // Validation des données
    if (!commentId || !replyId) {
      res.status(400).send({ error: "Données invalides" });
    }

    // Recherche du commentaire
    const comment = await Comment.findById(commentId).populate("replies");
    if (!comment) {
      res.status(400).send({ error: "Commentaire non trouvé" });
    }

    // Vérification de l'existence de la réponse
    const reply = comment.replies.find((r) => r._id.toString() === replyId);
    if (!reply) {
      res.status(400).send({ error: "Réponse non trouvée" });
    }

    return reply;
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}
