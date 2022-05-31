import express from "express";

import {
    getFrequentRequest,
    getFrequentRequests,
    createFrequentRequest,
    updateFrequentRequest,
    deleteFrequentRequest,
} from "../controllers/frequentRequests.js";

const router = express.Router();

router.get("/:id", getFrequentRequest);
router.get("/", getFrequentRequests);
router.post("/", createFrequentRequest);
router.patch("/:id", updateFrequentRequest);
router.delete("/:id", deleteFrequentRequest);

export default router;
