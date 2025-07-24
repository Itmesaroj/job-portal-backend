const authorization = require("../utils/authrization");
const AppModel = require("../Model/ApplicationModel");
const JobModel = require("../Model/JobModel");
const UserModel = require("../Model/UserModel");
const cloudinary = require("cloudinary").v2;

const postApplication = async (req, res, next) => {
  try {
    const { id, name, email, phone, address, coverLetter } = req.body;
    const job_id = req.params.id;

    // Authorization check for Job Seeker role
    const isMatch = await authorization("Job Seeker", id);
    if (!isMatch) {
      return res.status(403).json({ success: false, message: "Only job seekers can apply." });
    }

    // Validate input fields
    if (!name || !email || !phone || !address || !coverLetter) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const jobSeekerInfo = { id, name, email, phone, address, coverLetter, role: "Job Seeker" };

    // Validate job existence
    const jobDetails = await JobModel.findById(job_id);
    if (!jobDetails) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    // Check if already applied
    const isAlreadyApplied = await AppModel.findOne({
      "jobInfo.jobId": job_id,
      "jobSeekerInfo.id": id
    });
    if (isAlreadyApplied) {
      return res.status(400).json({ success: false, message: "You have already applied for this job." });
    }

    // Resume upload handling
    if (req.files && req.files.resume) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
          folder: "Job_Seekers_Resume"
        });
        jobSeekerInfo.resume = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url
        };
      } catch (err) {
        return res.status(500).json({ success: false, message: "Cloudinary upload failed." });
      }
    } else {
      // Check if resume is available in the user profile
      const user = await UserModel.findById(id);
      if (!user || !user.resume || !user.resume.url) {
        return res.status(400).json({ success: false, message: "Please upload your resume." });
      }
      jobSeekerInfo.resume = { public_id: user.resume.public_id, url: user.resume.url };
    }

    // Employer info
    const employeeInfo = { id: jobDetails.postedBy, role: "Employer" };

    // Job info
    const jobInfo = { jobId: job_id, jobTitle: jobDetails.title };

    // Create new application
    const application = await AppModel.create({ jobSeekerInfo, employeeInfo, jobInfo });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: application
    });
  } catch (err) {
    next(err);
  }
};

const employerGetAllApplication = async (req, res, next) => {
  try {
    const isMatch = await authorization("Employer", req.body.id);
    if (!isMatch) {
      return res.status(403).json({ success: false, message: "Only employers can view applications." });
    }

    const employerID = req.body.id;
    const applications = await AppModel.find({
      "employeeInfo.id": employerID,
      "deletedBy.employer": false
    });

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

const jobSeekerGetAllApplication = async (req, res, next) => {
  try {
    const isMatch = await authorization("Job Seeker", req.body.id);
    if (!isMatch) {
      return res.status(403).json({ success: false, message: "Only job seekers can view their applications." });
    }

    const SeekerID = req.body.id;
    const applications = await AppModel.find({
      "jobSeekerInfo.id": SeekerID,
      "deletedBy.jobSeeker": false,
    });

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};


const applicationDelete=async(req,res,next)=>{
  try{
    const applicationID=req.params.id
    const application=await AppModel.findById(applicationID)
    if(!application){
      return res.status(400).json({success:false ,message:"Application not found"})
    }
    const user=await UserModel.findById(req.body.id)
    const role=user.role
    switch (role) {
      case "Job Seeker":
        application.deletedBy.jobSeeker = true;
        await application.save();
        break;
      case "Employer":
        application.deletedBy.employer = true;
        await application.save();
        break;
  
      default:
        console.log("Default case for application delete function.");
        break;
    }
  
    if (
      application.deletedBy.employer === true &&
      application.deletedBy.jobSeeker === true
    ) {
      await application.deleteOne();
    }
    console.log("appication deleted")
    res.status(200).json({
      success: true,
      message: "Application Deleted.",
    });
  }catch(err){
    next(err)
  }
}
module.exports = { postApplication, employerGetAllApplication, jobSeekerGetAllApplication,applicationDelete };
