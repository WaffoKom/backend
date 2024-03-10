import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
});

const Comment = mongoose.model("Comment", CommentSchema);
export { Comment };

export default async function getAllComments(req, res) {
  const count = await Comment.countDocuments({});

  try {
    const comments = await Comment.find();
    if (count > 0) {
      res.status(201).json(comments);
      return comments;
    } else {
      res.status(400).send({ error: "IL n'as pas de commentaire" });
      return null;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
export async function getComment(req, res) {
  const id = req.params.id;
  try {
    const comment = await Comment.findOne({ _id: id });
    if (comment) {
      res.status(201).json(comment);
      return comment;
    } else {
      res.status(400).send({ error: "Le commentaire n'est pas present" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
}
