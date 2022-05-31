import mongoose from "mongoose";

const tenantSchema = mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    surname: String,
});

export default mongoose.model("Tenant", tenantSchema);
