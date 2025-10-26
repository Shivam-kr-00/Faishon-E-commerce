import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js'; // ✅ Correct
// 1. Import redis client (make sure it's configured properly)

//Function to generate access and refresh tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // 2.1 Access token valid for 15 min
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // 2.2 Refresh token valid for 7 days
    return { accessToken, refreshToken }; // 2.3 Return both tokens
};

//Function to store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(userId.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60); // 3.1 Store with expiry of 7 days
};

//. Function to set tokens in HTTP-only cookies
const setCookies = (res, accessToken, refreshToken) => {
    // Set access token cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true, // prevents client-side JS access
        secure: process.env.NODE_ENV === 'production', // send only over HTTPS in production
        sameSite: 'Strict', // CSRF protection
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    //Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

// 5. Signup controller
export const signup = async (req, res) => {
    const { name, password, email } = req.body; // 1 Extract fields from request body
    try {
        // 2 Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 3 Create new user and save to DB
        const user = await User.create({ name, password, email });

        // 4 Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // 5 Store refresh token in Redis
        await storeRefreshToken(user._id, refreshToken);

        // 6 Set tokens in cookies
        setCookies(res, accessToken, refreshToken);

        // 7 Send response
        res.status(201).json({
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            message: "User created successfully"
        });
    } catch (error) {
        // 8 Error handling
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // first get email and password from req body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });

        if (user && await user.comparePassword(password)) {
            const { accessToken, refreshToken } = generateTokens(user._id);//` Generate tokens
            await storeRefreshToken(user._id, refreshToken);// then store refresh token in Redis
            setCookies(res, accessToken, refreshToken); // Set tokens in cookies

            // Send user details in response
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
            );
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    };
};


export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // first verify the token
            await redis.del(decoded.userId.toString());// delete from redis
            // Clear cookies
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(200).json({ message: "Logged out successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        console.error("Error in logout controller:", error.message);
    }
};


export const refreshToken = async (req, res) => {
    try {
        // 1. Get refresh token from cookies
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        // 2. Verify refresh token
        const decoded = jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET);

        // 3. Compare with stored token in Redis
        const storedToken = await redis.get(decoded.userId.toString());
        if (refreshTokenCookie !== storedToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // 4. Generate new access token
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        // 5. Send new access token in cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return res.status(200).json({ message: "Access token refreshed" });
    } catch (error) {
        console.error("Error in refresh token controller:", error.message);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getProfile = async (req, res) => {

    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).jons({ message: "INternal Server Error", error: error.message });
        console.log("Error in getProfile Controller", error);
    }
}
