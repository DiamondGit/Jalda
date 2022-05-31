import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    images: [String],
    category: { type: [String], required: true },
    rating: {
        1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        avg: Number,
        total: Number,
    },
    raters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    description: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    price: { type: Number, default: 0, required: true },
    fields: [
        {
            name: { type: String, required: true },
            info: { type: String },
        },
    ],
    postDate: {
        type: Date,
        default: new Date(),
    },
});
postSchema.index({ "$**": "text" });
export default mongoose.model("Post", postSchema);
