import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: String,
    permisions: [String],
});

export default mongoose.model("Role", roleSchema);
