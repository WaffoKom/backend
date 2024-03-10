import { Comment } from "../models/comments.models.js";
import { Reply } from "../models/replies.models.js";

export async function createReplyComment(req, res) {
  try {
    const { content, author, commentId } = req.body;

    // Validate commentId (optional)
    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "Commentaire invalide",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    const reply = new Reply({ content, author, commentId });
    const savedReply = await reply.save();

    comment.replies.push(savedReply._id);
    await comment.save();

    res.status(201).json({
      success: true,
      message: "Réponse ajoutée avec succès",
      reply: savedReply,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de la réponse",
      error: error.message,
    });
  }
}

export async function deleteReplyComment(req, res) {
  const { commentId, replyId } = req.params;

  try {
    // Validation des données
    if (!commentId || !replyId) {
      res.status(400).send({ error: "Données invalides" });
    }

    // Recherche du commentaire
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(400).send({ error: "Commentaire non trouvé" });
    }

    // Vérification de l'existence de la réponse
    if (!comment.replies.includes(replyId)) {
      res.status(400).send({ error: "Réponse non trouvée" });
    }

    // Suppression de la réponse du commentaire
    comment.replies.pull(replyId);
    await comment.save();

    // Suppression de la réponse
    await Reply.findByIdAndDelete(replyId);

    return { message: "Réponse supprimée avec succès" };
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function updateReplyComment(req, res) {
  const { commentId, replyId } = req.params;
  const { content } = req.body;

  try {
    // Validation des données
    if (!commentId || !replyId || !content) {
      res.status(400).send({ error: "Données invalides" });
    }

    // Recherche du commentaire
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(400).send({ error: "Commentaire non trouvé" });
    }

    // Vérification de l'existence de la réponse
    if (!comment.replies.includes(replyId)) {
      res.status(400).send({ error: "Réponse non trouvée" });
    }

    // Mise à jour du contenu de la réponse
    const reply = await Reply.findByIdAndUpdate(
      replyId,
      { content },
      { new: true }
    );

    return reply;
  } catch (error) {
    res.status(500).send(error.message);
  }
}
