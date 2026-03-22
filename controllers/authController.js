const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");



/* =========================

   REGISTER

========================= */

exports.register = async (req, res) => {

  const { name, username, email, password } = req.body;

  try {

    if(!name || !username || !email || !password){

      return res.status(400).json({

        success:false,

        message:"All fields are required"

      });

    }



    const existingUser = await User.findOne({

      $or:[

        { email },

        { username }

      ]

    });



    if(existingUser){

      return res.status(400).json({

        success:false,

        message:"User already exists"

      });

    }



    const salt = await bcrypt.genSalt(10);



    const hashedPassword = await bcrypt.hash(password, salt);



    const user = new User({

      name,

      username,

      email,

      password: hashedPassword

    });



    await user.save();



    res.status(201).json({

      success:true,

      message:"User registered successfully"

    });



  }

  catch(err){

    console.log(err);



    res.status(500).json({

      success:false,

      message:"Server error"

    });

  }

};



/* =========================

   LOGIN (email OR username)

========================= */

exports.login = async (req, res) => {

  const { emailOrUsername, password } = req.body;



  try {



    const user = await User.findOne({

      $or:[

        { email: emailOrUsername },

        { username: emailOrUsername }

      ]

    });



    if(!user){

      return res.status(400).json({

        success:false,

        message:"Invalid credentials"

      });

    }



    const isMatch = await bcrypt.compare(

      password,

      user.password

    );



    if(!isMatch){

      return res.status(400).json({

        success:false,

        message:"Invalid credentials"

      });

    }



    const token = jwt.sign(

      {

        id: user._id,

        name: user.name

      },

      process.env.JWT_SECRET,

      {

        expiresIn:"1h"

      }

    );



    res.json({

      success:true,

      token

    });



  }

  catch(err){

    console.log(err);



    res.status(500).json({

      success:false,

      message:"Server error"

    });

  }

};



/* =========================

   FORGOT PASSWORD

========================= */

exports.forgotPassword = async (req, res) => {

  const { email } = req.body;



  try {



    const user = await User.findOne({ email });



    if(!user){

      return res.status(400).json({

        success:false,

        message:"User not found"

      });

    }



    const token = crypto

      .randomBytes(32)

      .toString("hex");



    user.resetToken = token;



    user.resetTokenExpiry =

      Date.now() + 10 * 60 * 1000;



    await user.save();



    // change url to your vercel frontend url

    const resetLink =

      `https://login-validation.vercel.app/reset-password/${token}`;



    await sendEmail(

      email,

      "Password Reset",

      `Click the link to reset password:\n\n${resetLink}`

    );



    res.json({

      success:true,

      message:"Reset link sent to email"

    });



  }

  catch(err){

    console.log(err);



    res.status(500).json({

      success:false,

      message:"Server error"

    });

  }

};



/* =========================

   RESET PASSWORD

========================= */

exports.resetPassword = async (req, res) => {

  const { token } = req.params;

  const { password } = req.body;



  try {



    const user = await User.findOne({

      resetToken: token,

      resetTokenExpiry: {

        $gt: Date.now()

      }

    });



    if(!user){

      return res.status(400).json({

        success:false,

        message:"Invalid or expired token"

      });

    }



    const salt = await bcrypt.genSalt(10);



    user.password = await bcrypt.hash(

      password,

      salt

    );



    user.resetToken = undefined;

    user.resetTokenExpiry = undefined;



    await user.save();



    res.json({

      success:true,

      message:"Password reset successful"

    });



  }

  catch(err){

    console.log(err);



    res.status(500).json({

      success:false,

      message:"Server error"

    });

  }

};