import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postDate: { type: Date, default: Date.now() },
    rating: { type: Number, default: 0, required: true },
    text: { type: String, default: "" },
});

export default mongoose.model("Review", reviewSchema);
