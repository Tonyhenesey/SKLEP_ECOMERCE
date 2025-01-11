import { User } from "../models/userModel.js";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });

    try {
        await user.save();
        res.status(201).json({ message: "✅ Użytkownik zarejestrowany!" });
    } catch (error) {
        res.status(400).json({ error: "❌ Email już istnieje!" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
        return res.status(401).json({ error: "❌ Nieprawidłowe dane logowania!" });
    }

    res.json({ message: "✅ Zalogowano!", user: { id: user._id, name: user.name, role: user.role } });
};
