import User from "../Model/User.js";
import bcrypt from "bcrypt";

// Update:
export const Update = async (req, res, next) => {

    try {
        const { name, email, password, location } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const userUpdated = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: { name, email, password: hashPassword, location } },
            { new: true }
        );

        // Access Token:
        const Accesstoken = userUpdated.createJWT();

        res.status(200).send({ message: "Update Successfully...", userUpdated, Accesstoken: Accesstoken });
    }
    catch (error) {
        next(error);
    }
}
