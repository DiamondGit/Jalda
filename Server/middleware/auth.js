import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(403).json({ message: "Unauthenticated" });
        } else {
            const token = req.headers.authorization.split(" ")[1];

            const decodedData = jwt.verify(token, "jalda");

            req.userId = decodedData?.id;

            if (decodedData.id) {
                const user = await UserModel.findById(decodedData.id).populate("roles");
                user.roles.map((role) => {
                    if (role.name === "Admin") req.isAdmin = true;
                });
            }

            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

export default auth;
