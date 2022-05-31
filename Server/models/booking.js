import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    transactionNumber: { type: Number, unique: true, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingStatus: String,
    dateFrom: Date,
    dateTill: Date,
    address: String,
});

export default mongoose.model("Booking", bookingSchema);
