import express from "express";

import {
    getPosts,
    getPost,
    getPostPreview,
    getSimilarPosts,
    createPost,
    updatePost,
    deletePost,
    favPost,
    addReview,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", getPost);
router.patch("/preview", getPostPreview);
router.patch("/:id", auth, updatePost);
router.patch("/:id/addToFavorites", auth, favPost);
router.patch("/:id/review", auth, addReview);
router.patch("/:id/similars", getSimilarPosts);
router.delete("/:id", auth, deletePost);
router.get("/", getPosts);
router.post("/", auth, createPost);

export default router;
