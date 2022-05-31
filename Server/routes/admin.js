import express from "express";
import { approveAuthor, deleteUsers, deletePosts, getWaitingAuthors, deleteCategories } from "../controllers/admin.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/waiting_authors", auth, getWaitingAuthors);
router.post("/waiting_authors/approve/:id", auth, approveAuthor);

router.delete("/delete_users", auth, deleteUsers);
router.delete("/delete_posts", auth, deletePosts);
router.delete("/delete_categories", auth, deleteCategories);

export default router;
