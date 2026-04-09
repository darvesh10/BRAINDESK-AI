import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import axios from "axios";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Cookie options (ek baar define karo, dono mein use karo)
const cookieOptions = {
  httpOnly: true,      // JS se access nahi hoga (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict",  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, techStack } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, techStack });
    const token = generateToken(user._id);

    // 🍪 Cookie mein set karo (body mein token mat do)
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, techStack: user.techStack });

  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error code
        return res.status(400).json({ message: "Bhai, ye email pehle se register hai!" });
    }
    res.status(500).json({ message: error.message });
}
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    // 🍪 Cookie mein set karo
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ _id: user._id, name: user.name, email: user.email, techStack: user.techStack });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Naya: Logout route (cookie clear karo)
export const logoutUser = async (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 0 }); // Cookie expire kar do
  res.status(200).json({ message: "Logged out successfully" });
};


//redirect user to github for authentication
export const githubLogin = (req,res) => {
  const userId = req.query.userId; // Frontend se userId query parameter ke through milega
  if(!userId) return res.status(400).json({ message: "User ID is required" });
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `http://localhost:5000/api/auth/github/callback`; // GitHub callback URL
  const scope = "repo"; // Required scopes
  // GitHub authorization URL banate hain
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${userId}`;
  res.redirect(githubAuthUrl);// User ko GitHub ke login page par redirect kar do
}

// 2. GitHub wapas yahan aayega token code le kar
export const githubCallback = async (req, res) => {
  try {
    const { code, state } = req.query; 
    const userId = state; // Ye wahi userId hai jo humne bheji thi!

    if (!code || !userId) {
      return res.status(400).json({ message: "Authorization failed or User ID missing." });
    }

    // GitHub ko 'code' wapas de kar asli 'access_token' mangna
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json", // Hume response JSON mein chahiye
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: "Failed to fetch access token from GitHub." });
    }

    // Ab token mil gaya, usko User ke DB mein save kar do
    const user = await User.findById(userId);
    user.githubToken = accessToken;
    await user.save();

    // Sab success hone ke baad user ko wapas frontend pe bhej do (query parameter ke sath taaki UI update ho sake)
    res.redirect("http://localhost:3000/chat");

  } catch (error) {
    console.error("GitHub OAuth Error:", error.message);
    res.status(500).json({ message: "Internal Server Error during GitHub OAuth." });
  }
};

// GOOGLE OAUTH LOGIC

// 1. Redirect user to Google for authentication
export const googleLogin = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `http://localhost:5000/api/auth/google/callback`;
  const scope = "email profile"; // Humein email aur naam chahiye
  
  // Google authorization URL
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&prompt=select_account`;
  
  res.redirect(googleAuthUrl);
};

// 2. Google wapas yahan aayega 'code' le kar
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Google Authorization failed." });
    }

    // A. Code de kar Google se Access Token mango
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: `http://localhost:5000/api/auth/google/callback`,
        grant_type: "authorization_code",
      },
    });

    const { access_token } = tokenResponse.data;

    // B. Token use karke user ki details (Email, Name) nikalo
    const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name } = userResponse.data;

    // C. Apne Database mein check karo user hai ya nahi
    let user = await User.findOne({ email });

    if (!user) {
      // Naya user hai toh create karo (Google walon ka password nahi hota, toh random dal do)
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword, 
        techStack: [], // Default khali
      });
    }

    // D. JWT Token generate karo (Tera purana function)
    const token = generateToken(user._id);

    // E. 🍪 Cookie set karo taaki frontend pe session ban jaye
    res.cookie("token", token, cookieOptions);

    // F. Sab set! Frontend ke chat page pe phek do
    res.redirect("http://localhost:3000/chat");

  } catch (error) {
    console.error("Google OAuth Error:", error?.response?.data || error.message);
    res.redirect("http://localhost:3000/login?error=google-failed");
  }
};