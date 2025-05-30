import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import employ from "./routes/admin/employees.js";
import loc from "./routes/admin/location.js";
import schedule from "./routes/admin/scheedule.js";
import timesheet from "./routes/admin/timeshee.js";
import clock_in from "./routes/public/clock-in.js";
import clock_out from "./routes/public/clock-out.js";
import public_timesheet from "./routes/public/public_timesheet.js";
import time from "./other/time.js";
import { log } from "console";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.static(path.join(__dirname, "view")));
app.use("/admin_view", express.static(path.join(__dirname, "admin_view")));

app.use("/admin/employees", employ);
app.use("/admin/location", loc);
app.use("/admin/schedule", schedule);
app.use("/admin/timesheet", timesheet);
app.use("/clock-in", clock_in);
app.use("/clock-out", clock_out);
app.use("/timesheet", public_timesheet);

app.get("/", async (req, res) => {
  // Displays the homepage at "/"
  res.sendFile(path.join(__dirname, "view", "clock.html"));
});
app.get("/1", async (req, res) => {
  // Displays dashboard page at "/1"
  res.sendFile(path.join(__dirname, "admin_view", "dashbord.html"));
});

// You could do this inside an async IIFE since top-level await isn't used here:
/*(async () => {
  const times = await time();
  console.log(times);
  /*for (let i = 0; i < times.length; i++) {
    console.log(
      `Employee: ${times[i].employees_id} did not clock out \n ${JSON.stringify(
        times[i],
        null,
        2
      )}`
    );
  }
})();*/

app.listen(80, () => {
  console.log("[server] Application started on port 80!");
});
