import express from "express";
import sql from "./other/db.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import employ from "./routes/admin/employees.js";
import loc from "./routes/admin/location.js";
import schedule from "./routes/admin/scheedule.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "view")));
app.use("/admin/employees", employ);
app.use("/admin/location", loc);
app.use("/admin/schedule", schedule);

app.get("/", async (req, res) => {
  // Displays the homepage at "/"
  res.sendFile(path.join(__dirname, "view", "clock.html"));
});

//ADMIN CLOCK_IN/OUT
app.get("/timesheet:id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    try {
      const schedule = await sql` SELECT * FROM TIMESHEET;`;
      res.status(200).json(schedule);
    } catch (error) {
      console.error("[server] Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  } else {
    res.status(500).json({ error: "dont have acess" });
  }
});

//CLOCK_IN/OUT
app.post("/clock_in:id", async (req, res) => {
  const clock_in = new Date();
  const emp_id = await sql`SELECT id FROM employees WHERE id=${Number(
    req.params.id.replace(":", "")
  )}`;
  const all_emp = await sql`SELECT id FROM employees`;
  const all_loc = await sql`SELECT
    location_name
FROM
    locations`;
  const { location_name } = req.body;
  if (
    all_emp.some((emp) => emp.id === emp_id[0]?.id) &&
    all_loc.some((loc) => loc.location_name === location_name)
  ) {
    const { location_name } = req.body;
    const emp_name =
      await sql`SELECT * FROM employees WHERE id = ${emp_id[0]?.id}`;
    console.log(emp_name[0].last_name);
    try {
      const result = await sql`
      insert into timesheet (employees_ID, last_name, first_name, location_name, clock_in)
      values (${emp_id[0]?.id}, ${emp_name[0].last_name}, ${emp_name[0].first_name}, ${location_name},${clock_in})
      returning *
    `;
      res.status(201).json(result);
    } catch (error) {
      console.error("[server] Timesheet error:", error);
      res.status(500).json({ error: "Failed to clock in" });
    }
  } else {
    res.status(500).json({ error: "Dont have access" });
  }
});

app.put("/clock_out:id", async (req, res) => {
  const clock_out = new Date();
  console.log(clock_out);
  const emp_id = await sql`SELECT id FROM employees WHERE id=${Number(
    req.params.id.replace(":", "")
  )}`;
  const all_emp = await sql`SELECT id FROM employees`;
  const emp_time = await sql`SELECT clock_in FROM timesheet
WHERE employees_id = ${emp_id[0]?.id}
ORDER BY clock_in DESC
LIMIT 1`;
  if (all_emp.some((emp) => emp.id === emp_id[0]?.id)) {
    try {
      const result = await sql`
  UPDATE
    TIMESHEET
SET
    clock_out = ${clock_out}
WHERE
    employees_ID = ${emp_id[0]?.id}
    AND clock_in = ${emp_time[0].clock_in}
    `;
      res.status(201).json(result);
    } catch (error) {
      console.error("[server] Timesheet error:", error);
      res.status(500).json({ error: "Failed to clock out" });
    }
  } else {
    res.status(500).json({ error: "Dont have access" });
  }
});

app.listen(80, () => {
  console.log("[server] Application started on port 80!");
});
