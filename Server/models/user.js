import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String },
    surname: { type: String },
    fathername: { type: String },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: String },
    telegram: { type: String, default: null },
    whatsapp: { type: String, default: null },
    birthDate: { type: Date },
    password: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    companyName: String,
    iinNumber: { type: String, unique: true, sparse: true },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
    status: { type: String, default: null },
    image: { type: String, default: null },
    creditCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "CreditCard" }],
    sendDate: Date,
});

export default mongoose.model("User", userSchema);
