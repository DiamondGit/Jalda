import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import generator from "generate-password";

import UserModel from "../models/user.js";
import RoleModel from "../models/roles.js";
import CreditCardModel from "../models/creditCard.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email }).populate("roles").populate({
            path: "creditCards",
            select: "number name expireDate",
        });

        if (!existingUser) return res.status(404).json({ message: "Несуществующий пользователь." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Неверные учетные данные." });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "jalda", { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Пользователь уже существует." });

        const hashedPassword = await bcrypt.hash(password, 12);

        let userRoles = [];

        const userRole = await RoleModel.findOne().where("name").equals("User");
        userRoles.push(userRole._id);

        const newUser = new UserModel({ ...req.body, password: hashedPassword, roles: userRoles });
        await newUser.save();

        const result = await UserModel.findById(newUser._id).populate("roles").populate({
            path: "creditCards",
            select: "number name expireDate",
        });

        const token = jwt.sign({ email: result.email, id: result._id }, "jalda", { expiresIn: "1h" });

        res.status(201).json({ result, token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });

        console.log(error);
    }
};

export const signupAuthor = async (req, res) => {
    const { email, iinNumber, companyName } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Пользователь уже существует." });

        let userRoles = [];

        const userRole = await RoleModel.findOne().where("name").equals("User");
        userRoles.push(userRole._id);

        const newUser = new UserModel({ ...req.body, roles: userRoles, status: "waiting", sendDate: new Date() });

        await newUser.save();

        res.status(201).json({ message: "Success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const upgradeToAuthor = async (req, res) => {
    const data = req.body;

    try {
        if (!req.userId) return res.json({ message: "Unauthenticated" });
        const _id = req.userId;

        const user = await UserModel.findById(_id);

        const authorRole = await RoleModel.findOne().where("name").equals("Author");
        user.roles.push(authorRole._id);

        const result = await UserModel.findByIdAndUpdate(_id, { ...data, roles: user.roles, sendDate: new Date() }, { new: true })
            .populate("roles")
            .populate({
                path: "creditCards",
                select: "number name expireDate",
            });

        const token = jwt.sign({ email: result.email, id: result._id }, "jalda", { expiresIn: "1h" });

        res.json({ result, token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });

        console.log(error);
    }
};

export const getFavorites = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).populate({
            path: "favorites",
            select: "author title images rating description price fields",
        });

        const posts = user.favorites;

        const postsResult = [];

        if (posts.length > 0) {
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];

                if (post.images) postsResult.push({ ...post._doc, postId: post._doc._id, previewImage: post.images[0], images: null });
                else postsResult.push({ ...post._doc, postId: post._doc._id, previewImage: null });
            }
        }

        res.status(200).json(postsResult);
    } catch (error) {
        res.status(404).json(error);
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find().populate("roles");
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
};

export const editUser = async (req, res) => {
    const data = req.body;

    try {
        if (!req.userId) return res.json({ message: "Unauthenticated" });
        const _id = req.userId;

        const result = await UserModel.findByIdAndUpdate(_id, { ...data, _id }, { new: true })
            .populate("roles")
            .populate({
                path: "creditCards",
                select: "number name expireDate",
            });

        const token = jwt.sign({ email: result.email, id: result._id }, "jalda", { expiresIn: "1h" });

        res.json({ result, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const changePassword = async (req, res) => {
    const { password, newPassword } = req.body;
    try {
        if (!req.userId) return res.json({ message: "Unauthenticated" });
        const _id = req.userId;

        const existingUser = await UserModel.findById(_id);

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) res.status(400).json({ message: "Неверные учетные данные." });

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const result = await UserModel.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true }).populate("roles").populate({
            path: "creditCards",
            select: "number name expireDate",
        });

        const token = jwt.sign({ email: result.email, id: result._id }, "jalda", { expiresIn: "1h" });
        return res.json({ result, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) return res.status(404).json({ message: "Несуществующий пользователь." });
        const password = generator.generate({ length: 8, numbers: true });
        const hashedPassword = await bcrypt.hash(password, 12);

        await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: "jalda.platform@gmail.com",
                pass: "jalda2022",
            },
            secure: true,
        });

        const mailOptions = {
            from: "jalda.platform@gmail.com",
            to: user.email,
            subject: "Востановление паролья",
            text: `Ваш новый пароль: ${password}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(400).json({ message: "Error" });
            }
            console.log("Email sent: " + info.response);
            return res.status(201).json({ message: "Success" });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const addCreditCard = async (req, res) => {
    const cardData = req.body;
    try {
        if (!req.userId) return res.json({ message: "Unauthenticated" });
        const _id = req.userId;
        const existingUser = await UserModel.findById(_id);

        const newCard = new CreditCardModel({ ...cardData, user: _id });
        await newCard.save();

        let creditCards = existingUser.creditCards;
        creditCards.push(newCard._id);

        const result = await UserModel.findByIdAndUpdate(_id, { creditCards: creditCards }, { new: true }).populate("roles").populate({
            path: "creditCards",
            select: "number name expireDate",
        });

        const token = jwt.sign({ email: result.email, id: result._id }, "jalda", { expiresIn: "1h" });
        return res.status(201).json({ result, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
export const deleteCreditCard = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.userId) return res.json({ message: "Unauthenticated" });
        const _id = req.userId;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Credit Card found");

        const existingUser = await UserModel.findById(_id);

        if (!existingUser.creditCards.includes(id)) return res.status(404).send("No Credit Card found");

        let newCreditCards = existingUser.creditCards.filter((cardId) => String(cardId) != String(id));
        await CreditCardModel.findByIdAndRemove(id);

        const result = await UserModel.findByIdAndUpdate(_id, { creditCards: newCreditCards }).populate("roles").populate({
            path: "creditCards",
            select: "number name expireDate",
        });

        const token = jwt.sign({ email: result.email, id: result._id }, "jalda", { expiresIn: "1h" });
        return res.status(201).json({ result, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
