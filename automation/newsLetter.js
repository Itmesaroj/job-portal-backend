const cron = require("node-cron");
const UserModel = require("../Model/UserModel");
const JobModel = require("../Model/JobModel");
const sendEmail = require("../utils/sendEmail");

const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
   

    try {
    
      const jobs = await JobModel.find({ newsLetterSent: false });

      for (const job of jobs) {
      
        const filteredUsers = await UserModel.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });

      
        for (const user of filteredUsers) {
          const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;
          const message = `Hi ${user.name},\n\nGreat news! A new job that fits your niche has just been posted. The position is for a ${job.title} with ${job.companyName}, and they are looking to hire immediately.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nDon’t wait too long! Job openings like these are filled quickly. \n\nWe’re here to support you in your job search. Best of luck!\n\nBest Regards,\nNicheNest Team`;

          
          await sendEmail({
            email: user.email,
            subject,
            message,
          });
        }

        
        job.newsLetterSent = true;
        await job.save();
      }
    } catch (error) {
      
      console.error("Error during Cron Job execution", error);
    }
  });
};

module.exports = newsLetterCron;
