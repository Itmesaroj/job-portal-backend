const express=require("express")
const router=express.Router()
const {register, login, logout, getUser, updatePassword, profileUpdate}=require("../controller/userController")
const authmiddleware = require("../middleware/Authmiddleware")


router.post("/register",register)
router.post("/login",login)
router.get("/logout",authmiddleware,logout)
router.get("/getuser",authmiddleware,getUser)
router.put("/update/password",authmiddleware,updatePassword)
router.put("/update/profile",authmiddleware,profileUpdate)
module.exports=router