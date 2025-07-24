const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must contain at least 3 characters"],
    maxlength: [25, "Name cannot exceed 25 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  niches: {
    firstNiche: String,
    secondNiche: String,
    thirdNiche: String
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must contain at least 8 characters"]
  },
  resume: {
    public_id: String,
    url: String
  },
  coverLetter: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});




const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
