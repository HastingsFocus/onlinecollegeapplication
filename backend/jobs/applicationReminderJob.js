import cron from "node-cron";
import { sendApplicationReminders } from "../services/applicationReminderService.js";


cron.schedule(
  "0 9 * * *",
  async () => {

    console.log(
      "Running application reminder job..."
    );

    await sendApplicationReminders();

  }
);