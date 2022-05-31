import Role from "../models/roles.js";

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
};

export const createRole = async (req, res) => {
    const data = req.body;
    const role = new Role(data);

    try {
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        console.log(error);
        res.status(409).json(error);
    }
};
