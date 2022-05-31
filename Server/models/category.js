import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    level: String,
    previewUrl: { type: String, default: null },
});

export default mongoose.model("Category", categorySchema);
