import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
    // Logic to protect route (e.g., check for valid JWT token)
    try {
        const accessToken = req.cookies.accessToken; // 1. Get token from cookies

        if (!accessToken) { // 2 . check if token is present
            return res.status(401).json({ message: "Unauthorized : No token Provided " });
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);//check its legitmate or not // this take two argument (token, secret key)
            const user = await User.findById(decoded.userId).select("-password");//we will get user id // exclude password field to confirm that the user ID from the token still corresponds to an actual, existing user

            if (!user) {
                return res.status(401).json({ message: "Unauthorized : User not found" });
            }
            // in req we will adduser information req.user(user is name we can give any name) and = user (object)
            req.user = user; // Attach the user object to the request for further use
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Unauthorized : Token expired" });
            }
            throw error; // rethrow other errors to be caught by the outer catch block
        }
    } catch (error) {
        console.log("Error in protectRoute Middleware", error.message);
        return res.status(401).json({ message: "Unauthorized : Invalid token" });
    }

}


export const adminROute = async (req, res, next) => {

    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: "Access Denied : Admins only" });
    }
}
