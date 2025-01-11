import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: String,
    surname: String,
    phone: String,
    email: String,
    birthDate: Date,
    address: String
});

export const Customer = mongoose.model("Customer", customerSchema);
