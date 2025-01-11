import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "employee"], default: "employee" }

});

export const User = mongoose.model("User", userSchema);
