const UserModel = require("../Model/UserModel");
const cloudinary = require("cloudinary").v2;
const generateToken = require("../utils/generateToke");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Register function
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      role,
      password,
      firstNiche,
      secondNiche,
      thirdNiche,
      coverLetter,
    } = req.body;

 
    if (!name || !email || !phone || !address || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

   
    if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
      return res.status(400).json({
        success: false,
        message: "Please provide your preferred job niches",
      });
    }

    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, saltRounds); 

   
    const userData = {
      name,
      email,
      address,
      phone,
      password: hashedPassword, 
      role,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
      coverLetter,
    };

 
    if (req.files && req.files.resume) {
      const { resume } = req.files;
      
      if (resume) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "Job_Seekers_Resume" }
          );

          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return res.status(500).json({
              success: false,
              message: "Failed to upload resume to cloud"
            });
          }

          userData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
          };
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload resume"
          });
        }
      }
    }

   
    const user = new UserModel(userData);
    await user.save();

   
    const token = await generateToken(user._id);

    
   

    
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
        token,
      });
  } catch (error) {
    next(error);
  }
};

// Login function
const login = async (req, res, next) => {
  try {
    const { email, role, password } = req.body;
    
 
    if (!email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

   
    const user = await UserModel.findOne({ email });
   

    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please register.",
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password); 
    

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

   
    if (user.role !== role) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    
    const token = await generateToken(user._id);
   
    
    res.status(200)
      .json({
        success: true,
        message: "User logged in successfully.",
        user,
        token,
      });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// logout
const logout=async(req,res,next)=>{
 return res.status(200).json({success:true,message:"logout successfully"})
}

const getUser=async(req,res,next)=>{
  try{
    const id=req.body.id
    
    if(!id){
      return res.status(404).json({success:false,message:"user id is undfine"})
    }
    const user=await UserModel.findById(id)
    if(!user){
      return res.status(404).json({success:false,message:"no user exist in database on this user"})
    }
    return res.status(200).json({success:true,message:"request successfull",data:user})
  }catch(err){
    next(err)
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const { id, oldPassword, newPassword, confirmPassword } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "User ID is required" });
    if (!oldPassword || !newPassword || !confirmPassword) 
      return res.status(400).json({ success: false, message: "All fields are required" });
    if (newPassword !== confirmPassword) 
      return res.status(400).json({ success: false, message: "New password and confirm password do not match" });

 
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Old password is incorrect" });

  
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    const result = await UserModel.findByIdAndUpdate(id, { password: hashPassword }, { new: true });
   
    if (!result) return res.status(500).json({ success: false, message: "Password update failed" });

    return res.status(200).json({ success: true, message: "Password successfully updated" });

  } catch (error) {
    next(error);
  }
};


const profileUpdate = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      coverLetter: req.body.coverLetter,
      niches: {
        firstNiche: req.body.firstNiche,
        secondNiche: req.body.secondNiche,
        thirdNiche: req.body.thirdNiche,
      },
    };

    const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;

    if (req.body.role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all your preferred job niches."
      });
    }

    if (req.files && req.files.resume) {

      const resume = req.files.resume;

      const user = await UserModel.findById(req.body.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
      if (user.resume && user.resume.public_id) {
        await cloudinary.uploader.destroy(user.resume.public_id);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_Seekers_Resume",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.body.id, newUserData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile successfully updated",
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { login, register,logout,getUser,updatePassword,profileUpdate };
