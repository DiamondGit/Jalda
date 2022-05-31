import mongoose from "mongoose";
import Booking from "../models/booking.js";

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.findByUserId(req.userId);

        res.status(200).json(bookings);
    } catch (error) {
        res.status(404).json(error);
    }
};

export const getBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id).populate({
            path: "userId",
            path: "postId",
        });
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json(error);
    }
};

export const createBooking = async (req, res) => {
    const bookingData = req.body;

    if (!req.userId) return res.json({ message: "Unauthenticated" });

    const booking = new Booking({ ...bookingData, userId: req.userId });

    try {
        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(409).json(error);
    }
};

export const updateBooking = async (req, res) => {
    const { id } = req.params;
    const booking = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No booking with that Id");

    const updatedBooking = await Booking.findByIdAndUpdate(id, { ...booking, id }, { new: true });

    res.json(updatedBooking);
};
