const { postJob,getAllJobs,getMyJobs, deleteJob, getASingleJob} = require("../controller/jobController")
const authMiddleware = require("../middleware/Authmiddleware")

const express=require("express")

const router=express.Router()
router.post("/post", authMiddleware,postJob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs",authMiddleware,getMyJobs);
router.delete("/delete/:id",authMiddleware,deleteJob)
router.get("/get/:id",getASingleJob)
module.exports=router

