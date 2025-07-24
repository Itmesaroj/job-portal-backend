const express=require("express")
const router=express.Router()
const Authmiddleware=require("../middleware/Authmiddleware")
const {postApplication, employerGetAllApplication, jobSeekerGetAllApplication, applicationDelete,} = require("../controller/applicationController")


router.post("/postApplication/:id",Authmiddleware,postApplication)

router.get("/employer/getallAppliction",Authmiddleware,employerGetAllApplication)

router.get("/jobSeeker/getallAppliction",Authmiddleware,jobSeekerGetAllApplication)
router.delete("/delete/:id", Authmiddleware, applicationDelete);
module.exports=router