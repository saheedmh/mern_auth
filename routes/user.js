import express from 'express'
import bcrypt from 'bcrypt'
 const router = express.Router();
import {User} from   '../models/User.js'
import  jwt   from 'jsonwebtoken';
import nodemailer from 'nodemailer'
//sign page
/** router.post('/signup', async (req,res)=>{
    const {name, email, password} = req.body;
    const  users = await User.findOne({email})
    if(users){
return res.json({message:"user already existed"})
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = new User({
    name,
    email,
    password: hashpassword,
    })
    await newUser.save();
    return res.json({status:true, message:"record register"})
 })
*/
 /** */
 // ✅ Correct Signup Logic
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Generate Token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send Cookie + Response
        return res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000 
        }).json({ status: true, message: "Registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating user" });
    }
});
 // login page
 router.post('/login', async (req, res)=>{

 return res.cookie('token', token, {
    httpOnly: true,
    secure: true,      // Must be true for Render
    sameSite: 'none',  // Must be 'none' for Vercel -> Render
    maxAge: 3600000 
}).json({ 
    status: true,      // <--- ADD THIS LINE if it's missing!
    message: "login successful", 
    user: { id: user._id, name: user.name } 
});
    const {email, password} = req.body;
    try{
 const user = await User.findOne({email})
 if(!user)
    return res.status(400).json({message:"user not found"});
 
   const match = await bcrypt.compare(password, user.password)


   if(!match){
    return res.status(400).json({message: "password is incorrect"})
   }

   //const token = JsonWebTokenError.sign({username: "user.name"}, process.env.KEY, {expireIn:'1hr'} )
   //res.cookie('token', token, {httpOnly:true, maxAge:360000})
   const token = jwt.sign({id: user._id, name: user.name},
    process.env.JWT_SECRET,
    {expiresIn: '1hr'}
   );
   return res.json({message: "login successful", 
    token,
    user: {id: user._id, name:user.name}});
}  
catch(err){
    console.error("Login error", err);
    res.status(500).json({message:'Internal server error'})
}})
/**router.post('/forgot-password', async (req, res) => {
const {email} = req.body;
try{
    const user = await User.findOne({email})
    if(!user){
        return res.json({message:"user not registered"})
    }


    
const token = jwt.sign({id: user._id}, process.env.KEY, {expiresIn: "5m"})
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'menyagaseid2@gmail.com',
    pass: 'menyaga12'
  }
});

let mailOptions = {
  from: 'menyagaseid2@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'reset password',
  text: `http://localhost:5173/resetpassword/${token}`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    return res.json({message: "error sending email"});
  } else {
    return res.json({status: true, message:'Email'});
  }
});

}


catch(err){
      console.log(err)  
    }
})
**/
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log("📨 Forgot password request for:", email);

  try {
    // 1. Find user in DB
    const user = await User.findOne({ email });
    console.log("🔍 Found user:", user);

    if (!user) {
      console.log("❌ User not found.");
      return res.status(404).json({ message: "User not registered" });
    }

    // 2. Create JWT token (expires in 5 minutes)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" }
      //token valid for minutes
    );
    console.log("🔐 Token generated:", token);
ss
    // 3. Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 4. Compose email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset Your Password',
      text: `${user.name}, Click this link to reset your password: ${process.env.FRONTEND_URL}/resetpassword/${token}`
    };

    // 5. Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("📧 Error sending email:", error);
        return res.status(500).json({ message: "Failed to send reset email" });
      } else {
        console.log("✅ Email sent:", info.response);
        return res.json({ message: "Reset email sent successfully" });
      }
    });

  } catch (err) {
  console.error("🔥 Error in /forgot-password:", err.message || err);
  res.status(500).json({ message: "Something went wrong" });
}
});

// 🛠️ Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 1. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update the user
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("❌ Reset password error:", err.message || err);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
});




router.get("/dashboard", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});



 export {router as UserRouter};