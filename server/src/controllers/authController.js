import * as UserRepository from "../repositories/user.js";

export const register = async (req, res) => {
    try {
        const { uid } = req.user;
        const { name, email } = req.body;

        const newUser = await UserRepository.createUser(uid, name, email);

        res.status(201).json({
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { uid } = req.user;

        const { role } = await UserRepository.getUserByUid(uid);

        res.status(201).json({
            role
        });
    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const { uid } = req.user;

        const userDoc = await UserRepository.getUserByUid(uid);
        if (!userDoc) {
            return res.status(404).json({
                success: false,
                data: null
            });
        }
        const { name, email, role } = userDoc;

        res.status(201).json({
            success: true,
            data: {name, email, role},
        });
    } catch (error) {
        res.status(500).json({
            sucess: false
        });
    }
};