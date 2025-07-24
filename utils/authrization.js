const UserModel = require("../Model/UserModel");

async function authorization(role,userId) {
  try {
    if (!role) {
      return false;
    }

    if (!userId) {
      return false; 
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return false; 
    }
    return user.role === role;
  } catch (error) {
    console.log("Authorization error")
    return false; 
  }
}

module.exports = authorization;
