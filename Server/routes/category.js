import express from "express";

import {
    getCategory,
    getMainCategories,
    getChildCategories,
    createCategory,
    updateCategory,
    getCategories,
    getCategoryCustom,
} from "../controllers/category.js";

const router = express.Router();

router.get("/category_ids", getCategoryCustom);

router.get("/main/", getMainCategories);
router.get("/:id", getCategory);
router.get("/:id/child", getChildCategories);
router.get("/", getCategories);

router.post("/", createCategory);
router.patch("/:id", updateCategory);

export default router;
