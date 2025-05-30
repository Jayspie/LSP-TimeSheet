import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

//Route Imports
import employ from "./routes/admin/employees.js";
import loc from "./routes/admin/location.js";
import schedule from "./routes/admin/scheedule.js";
import timesheet from "./routes/admin/timeshee.js";
import clock_in from "./routes/public/clock-in.js";
import clock_out from "./routes/public/clock-out.js";
import public_timesheet from "./routes/public/public_timesheet.js";

//Utilities
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/Admin_view", express.static(path.join(__dirname, "Admin_view")));

//Admin Routes
app.use("/admin/employees", employ);
app.use("/admin/location", loc);
app.use("/admin/schedule", schedule);
app.use("/admin/timesheet", timesheet);

//Public Routes
app.use("/clock-in", clock_in);
app.use("/clock-out", clock_out);
app.use("/timesheet", public_timesheet);

//View Routes
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "clock.html"));
});
app.get("/1", async (req, res) => {
  res.sendFile(path.join(__dirname, "Admin_view", "dashbord.html"));
});

app.listen(80, () => {
  console.log("[server] Application started on port 80!");
});
