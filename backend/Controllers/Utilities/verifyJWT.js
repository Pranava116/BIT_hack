import JWT from 'jsonwebtoken'

export default async function verifyJWT(req, res, next) {
    try {
        // Check for token in Authorization header first, then cookies
        let token = null;
        
        // Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        console.log('JWT Verification: Authorization header:', authHeader ? 'Present' : 'Missing');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim(); // Trim whitespace
            console.log('JWT Verification: Token extracted from header, length:', token.length);
        }
        
        // If not in header, check cookies
        if (!token) {
            token = req.cookies?.token?.trim();
            if (token) {
                console.log('JWT Verification: Token extracted from cookies, length:', token.length);
            }
        }

        // If token not found
        if (!token) {
            console.log('JWT Verification: No token found in header or cookies');
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
            console.error('JWT Verification Error:', err.name, err.message);
            console.error('JWT Verification: Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
            // Provide more specific error messages
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token has expired. Please login again." });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: "Invalid JWT Token", error: err.message });
            } else {
                return res.status(401).json({ message: "Invalid JWT Token", error: err.message });
            }
        }

    } catch (err) {
        console.error(`Error while Verifying JWT Token: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}