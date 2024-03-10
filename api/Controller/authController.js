import User from "../Model/User.js";
import bcrypt from "bcrypt";

// Register:
export const Register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Validate:

        if (!name) {
            return next("Please Provide Name...");
        }
        if (!email) {
            return next("Please Provide Email...");
        }
        if (!password) {
            return next("Please Provide Password...");
        }

        // Email Validation:
        const emailcheck = await User.findOne({ email: email });
        if (emailcheck) {
            return next("Email Already Register Please Login...");
        }

        // Password Hash:
        const hashPassword = await bcrypt.hash(password, 10);



        // Data Create:
        const userCreated = await User.create({
            name,
            email,
            password: hashPassword
        })

        // Access Token:
        const Accesstoken = userCreated.createJWT();

        res.status(201).send({ userCreated, Accesstoken });
    }
    catch (error) {
        return next(error);
    }
}

// Login:
export const Login = async (req, res, next) => {

    const { email, password } = req.body;

    // Validate email and password:
    if (!email || !password) {
        return next("Please Provide Email and Password");
    }

    // find email:
    const emailcheck = await User.findOne({ email: email }).select("+password");
    if (!emailcheck) {
        return next("Email Not Register Please Register...");
    }

    // compare password:
    const isMatch = await bcrypt.compare(password, emailcheck.password);
    if (!isMatch) {
        return next("Password Not Match Please Try Again...");
    }

    emailcheck.password = undefined;
    // Access Token:
    const Accesstoken = emailcheck.createJWT();

    res.status(200).send({ message: "Login Successfully...", emailcheck, Accesstoken });
}


