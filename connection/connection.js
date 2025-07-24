const mongoose=require("mongoose")

function connection(){
    return mongoose.connect(process.env.MONGODB_URL)
}

module.exports=connection