import bcrypt from 'bcrypt';
import User from '../../Database/user.js';
import JWT from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

export default async function signup(req, res) {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate JWT for the new user
    const token = JWT.sign(
      { email: newUser.email, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    return res.status(201).json({
      success: true,
      message: "User Signed Up Successfully",
      email: newUser.email,
      username: newUser.username,
      token
    });

  } catch (error) {
    console.error(`Error while signing up user: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}
