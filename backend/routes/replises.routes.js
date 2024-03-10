import express from "express";
import { createReplyComment } from "../controllers/replies.controllers.js";

const router = express.Router();

router.post("/comments/:CommentId/replies", createReplyComment);
router.put("/comments/:commentId/replies/:replyId");
router.get("/comments/:commentId/replies/:replyId");
router.get("/comments/:commentId/replies");
router.get("/comments/:commentId/replies/:replyId");
router.get("/replies/");

export default router;
