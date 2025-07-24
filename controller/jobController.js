const JobModel = require("../Model/JobModel");
const authorization = require("../utils/authrization");

// POST Job
const postJob = async (req, res, next) => {
  try {
    const isMatch = await authorization("Employer", req.body.id);
    if (!isMatch) {
      return res.status(403).json({ success: false, message: "You are not eligible to post a job." });
    }

    const {
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities,
      qualifications,
      offers,
      salary,
      hiringMultipleCandidates,
      personalWebsiteTitle,
      personalWebsiteUrl,
      jobNiche,
    } = req.body;

    // Required field validation
    if (!title || !jobType || !location || !companyName || !introduction || !responsibilities || !qualifications || !salary || !jobNiche) {
      return res.status(400).json({ success: false, message: "Please provide complete job details." });
    }

    // Personal website validation
    if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
      return res.status(400).json({ success: false, message: "Provide both the website URL and title, or leave both blank." });
    }

    const postedBy = req.body.id;
    const newJob = new JobModel({
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities,
      qualifications,
      offers,
      salary,
      hiringMultipleCandidates,
      personalWebsite: {
        title: personalWebsiteTitle,
        url: personalWebsiteUrl,
      },
      jobNiche,
      postedBy,
    });

    await newJob.save();

    return res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      data: newJob,
    });
  } catch (err) {
    next(err);
  }
};

// GET All Jobs with optional filters
const getAllJobs = async (req, res, next) => {
  try {
    const { city, niche, searchKeyword } = req.query;
    const query = {};

    if (city) {
      query.location = city;
    }
    if (niche) {
      query.jobNiche = niche;
    }
    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { companyName: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } },
      ];
    }

    const jobs = await JobModel.find(query);
    return res.status(200).json({
      success: true,
      message: "Jobs data successfully retrieved.",
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// GET My Jobs (only Employer's posted jobs)
const getMyJobs = async (req, res, next) => {
  try {
    const isMatch = await authorization("Employer",req.body.id);

    if (!isMatch) {
      return res.status(403).json({ success: false, message: "Only employers can access this data." });
    }

    const jobs = await JobModel.find({ postedBy: req.body.id });
    return res.status(200).json({
      success: true,
      message: "All jobs posted by you.",
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE Job
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isMatch = await authorization("Employer",req.body.id);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "You are not authorized to delete this job." });
    }

    const deletedJob = await JobModel.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
      data: deletedJob,
    });
  } catch (err) {
    next(err);
  }
};
const getASingleJob=async(req,res,next)=>{
    try{
        const { id } = req.params;

        const job = await JobModel.findById(id);
        if (!job) {
            return res.status(404).json({success:false,message:"Oops! Job not found"})
        }
       res.status(200).json({success: true,job,"message":"job geted"});
    }catch(err){
        next(err)
    }
}
module.exports = { postJob, getAllJobs, getMyJobs, deleteJob ,getASingleJob};
