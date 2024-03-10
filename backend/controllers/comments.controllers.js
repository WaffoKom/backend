import { Comment } from "../models/comments.models.js";
import { Reply } from "../models/replies.models.js";

export default async function addComment(req, res) {
  try {
    const { content, author, articleId } = req.body;
    const commentId = req.params.id;

    // Déterminer s'il s'agit d'un commentaire ou d'une réponse
    const newItem = commentId
      ? new Reply({ content, author, commentId })
      : new Comment({ content, author, articleId });

    // Validation des données (optionnel)

    const savedItem = await newItem.save();

    // Mise à jour du document parent (si c'est une réponse)

    if (commentId) {
      const parentComment = await Comment.findById(commentId).populate(
        "author"
      );
      console.log(parentComment.author.name);
      parentComment.replies.push(savedItem._id);
      await parentComment.save();
    }

    res.status(201).json({
      success: true,
      message: "Commentaire ajouté avec succès",
      comment: savedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du commentaire",
      error: error.message,
    });
  }
}

export async function deleteAllComments(req, res) {}
export async function deleteComment(req, res) {}
export async function updateComment(req, res) {}
