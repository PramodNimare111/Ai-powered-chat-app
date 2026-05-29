import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import "dotenv/config";
import {ENV} from "../lib/env.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check empty fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        // Check existing user
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        // Save user
        const savedUser = await newUser.save();

        // Generate token
        generateToken(savedUser._id, res);

        // Send response
        res.status(201).json({
            _id: savedUser._id,
            fullName: savedUser.fullName,
            email: savedUser.email,
            profilePic: savedUser.profilePic,
        });

        // Send welcome email
        try {
            await sendWelcomeEmail(
                savedUser.email,
                savedUser.fullName,
                process.env.CLIENT_URL
            );
        } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const login = async (req,res) => {
    const{email, password}=req.body;

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});
        
        generateToken(user._id , res);
        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic,
        });
    }catch(error){
        console.error("Error in login controller", error);
        res.status(500).json({mesage : "Internal server error"});
    }
}

export const logout = (_,res) => {
    res.cookie("jwt","", {maxAge:0});
    res.status(200).json({message : "Logout Successfully"});
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;

        if (!profilePic) {
            return res.status(400).json({
                message: "Profile pic is required"
            });
        }

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new: true}
        );

        res.status(200).json(updatedUser);

    } catch (error) {

        console.log("Error in update profile:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};
