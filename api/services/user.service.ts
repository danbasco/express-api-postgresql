import { where } from "sequelize";
import db from "../models/index.js";
import { IUser } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


interface ResponseType {
    status: number;
    message: string;
    data?: any;
}

const createJWT = (uid: string | number) => {
    return jwt.sign({ id: uid }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
};

const locateUserByEmail = async (email: string, includePassword: boolean = false) => {
    return await db.users.findOne({ 
        where: { email },
        attributes: includePassword ? undefined : { exclude: ['password'] } 
    });
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const isValidPassword = (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.])[A-Za-z\d@$!%*?&_.]{8,}$/;
    return passwordRegex.test(password);
}

const validatePassword = (password: string): { valid: boolean; message?: string } => {
    // 1) spaces
    if (/\s/.test(password)) {
        return { valid: false, message: "Password must not contain spaces." };
    }

    // 2) accented or non-ASCII characters
    if (/[^\x00-\x7F]/.test(password)) {
        return { valid: false, message: "Password must not contain accented or non-ASCII characters." };
    }

    // 3) characters not allowed (only A-Za-z0-9 and @$!%*?&_. allowed)
    const allowedRegex = /^[A-Za-z\d@$!%*?&_.]+$/;
    if (!allowedRegex.test(password)) {
        return { valid: false, message: "Password contains invalid characters. Allowed: letters, numbers, and @ $ ! % * ? & _ ." };
    }

    // 4) length
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }

    // 5) composition requirements
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[@$!%*?&_.]/.test(password)) {
        return { valid: false, message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@ $ ! % * ? & _ .)." };
    }

    return { valid: true };
};

export const registerService = async (data: IUser): Promise<ResponseType> => {

    try {
        if (!data || !data.name || !data.password || !data.email) {

            return { status: 400, message: "Name, email, and password are required." };
        }

        // Validação email existente
        const existingUser = await locateUserByEmail(data.email);
        if (existingUser) {
            return { status: 409, message: "Email already exists." };
        }
        
        const validEmail = isValidEmail(data.email);
        if (!validEmail) {
            return { status: 400, message: "Invalid email format." };
        }

        const validPassword = validatePassword(data.password);
        if (!validPassword.valid) {
            return { status: 400, message: validPassword.message || "Invalid password." };
        }

        // Hashing password


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const user = await db.users.create({ 
            name: data.name, 
            email: data.email,
            password: hashedPassword
        });

        await user.save();
        return { status: 201, message: "User registered successfully.", data: { name: user.name, email: user.email } };
    } catch (error) {
        return { status: 500, message: "Internal server error." };
    }
};

export const loginService = async (data: IUser): Promise<ResponseType> => {

    try {
        if (!data || !data.email || !data.password) {
            return { status: 400, message: "Email and password are required." };
        }

        const user = await locateUserByEmail(data.email, true);
        if (!user) {
            console.log("User not found with email:", data.email);
            return { status: 404, message: "User not found." };
        }

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            console.log("Invalid password attempt for email:", data.email); 
            return { status: 401, message: "Invalid password." };
        }
        console.log("User logged in successfully:", data.email);

       const token = createJWT(user._id);

        return { status: 200, message: "Login successfull.", data: { name: user.name, email: user.email, token: token } };

    } catch (error) {
        return { status: 500, message: "Internal server error." };
    }

}