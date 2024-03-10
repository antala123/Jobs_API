import mongoose from "mongoose";
import validator from "validator";
import Jwt from "jsonwebtoken";

// User:
const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is Require'] },
    email: { type: String, required: [true, 'Email is Require'], unique: true, validator: validator.isEmail },
    password: { type: String, required: [true, 'Password is Require'], select: true },
    location: { type: String, default: 'India' }
}, { timestamps: true })

// JWT Token:
userSchema.methods.createJWT = function () {
    return Jwt.sign({ id: this.id }, process.env.JWT_KEY, { expiresIn: process.env.ACCESS_KEY });
}

export default mongoose.model('user', userSchema);