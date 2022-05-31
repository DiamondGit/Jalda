import express from "express";

import { getBooking, getBookings } from "../controllers/bookings.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getBookings);
router.get("/:id", auth, getBooking);

export default router;
