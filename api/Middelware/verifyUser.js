import Jwt from "jsonwebtoken";

const verifyuser = async (req, res, next) => {

    const Header = req.headers.authorization;

    if (!Header || !Header.startsWith('bearer')) {
        return next("Authentication failed...");
    }

    const token = Header.split(' ')[1];
    try {
        const payload = Jwt.verify(token, process.env.JWT_KEY);
        req.user = { id: payload.id }
        next();
    }
    catch (error) {
        return next("Access Token Failed...");
    }
}

export default verifyuser;