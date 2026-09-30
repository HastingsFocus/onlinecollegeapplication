import StudentApplication from "../models/StudentApplication.js";
import { getNextIncompleteStep } from "../utils/applicationProgress.js";
import sendEmail from "../utils/sendEmail.js";

export const sendApplicationReminders = async () => {
  try {
    const inactiveDate = new Date();
    inactiveDate.setMinutes(
    inactiveDate.getMinutes() - 3
);

    const applications = await StudentApplication.find({
      status: "Draft",
      lastActivity: { $lte: inactiveDate },
      reminderCount: { $lt: 3 }
    }).populate("userId", "firstName lastName email");

    for (const application of applications) {
      if (!application.userId) continue;

      const progress = getNextIncompleteStep(application.progress);
      const student = application.userId;

      await sendEmail(
    student.email,
    "Complete Your College Application",
    `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">

        <h2>Hello ${student.firstName},</h2>

        <p>
          We noticed that you started your college application
          but have not completed it yet.
        </p>

        <p>Your next step is:</p>

        <h3>${progress.step}</h3>

        <p>
          ${progress.message}
        </p>

        <a href="http://localhost:5173${progress.route}"
           style="
             display:inline-block;
             padding:12px 20px;
             background:#0066cc;
             color:white;
             text-decoration:none;
             border-radius:5px;
           "
        >
          Continue Application
        </a>

        <br/><br/>

        <p>
          Your progress has been saved.
          You can continue from where you stopped.
        </p>

        <p>
          Admissions Office
        </p>

      </div>
    `
);

      application.lastReminderSent = new Date();
      application.reminderCount += 1;
      await application.save();
    }
  } catch (error) {
    console.error("Application reminder error:", error.message);
  }
};