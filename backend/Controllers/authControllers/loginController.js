import bcrypt from 'bcrypt';
import User from '../../Database/user.js';
import JWT from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

export default async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User with this email does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    // Generate JWT
    const token = JWT.sign(
      { email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      email: user.email,
      username: user.username,
      token
    });

  } catch (error) {
    console.error(`Error while logging in: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
