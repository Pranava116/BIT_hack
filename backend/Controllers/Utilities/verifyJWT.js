import JWT from 'jsonwebtoken'

export default async function verifyJWT(req, res, next) {
    try {
        // Check for token in Authorization header first, then cookies
        let token = null;
        
        // Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim(); // Trim whitespace
        }
        
        // If not in header, check cookies
        if (!token) {
            token = req.cookies?.token?.trim();
        }

        // If token not found
        if (!token) {
            console.log('JWT Verification: No token found');
            return res.status(401).json({ message: "Token not available" });
        }

        try {
            // Use the same fallback as login/signup controllers for consistency
            const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

            const payload = JWT.verify(token, JWT_SECRET);
            // Mounting the payload (containing user's info to the request object)
            req.user = payload;
            console.log('JWT Verification: Success for user', payload.email || payload.username);
            next();
        } catch (err) {
            console.error('JWT Verification Error:', err.message);
            // Provide more specific error messages
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token has expired. Please login again." });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: "Invalid JWT Token" });
            } else {
                return res.status(401).json({ message: "Invalid JWT Token", error: err.message });
            }
        }

    } catch (err) {
        console.error(`Error while Verifying JWT Token: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}