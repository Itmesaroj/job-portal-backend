const jwt=require("jsonwebtoken")
const generateToken = (userId) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_KEY,
       
        (error, token) => {
          if (error) {
            reject(new Error("Error generating token"));
          } else {
            resolve(token);
          }
        }
      );
    });
  };

module.exports=generateToken