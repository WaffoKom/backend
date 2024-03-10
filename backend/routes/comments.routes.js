import express from "express";
import getAllComments, { getComment } from "../models/comments.models.js";
import addComment, {
  deleteAllComments,
  deleteComment,
  updateComment,
} from "../controllers/comments.controllers.js";

const router = express.Router();

router.get("/comment/:id", getComment);
router.get("/comments/", getAllComments);
router.delete("/comment/:id", deleteComment);
router.delete("/comments/", deleteAllComments);
router.put("/comment/:id", updateComment);
router.post("/comments/", addComment);

export default router;
