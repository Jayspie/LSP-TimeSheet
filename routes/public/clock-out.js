import express from "express";
const clock_out = express.Router();
import sql from "../../other/db.js";
clock_out.use(express.json());
/*works for right now 
but later on it needs to be changed
maybe change the schedule to 
work date start time and work date end time
For example:
{
    "id": 10,
    "work_date": "2025-01-12T06:00:00.000Z",
    "last_name": "doe",
    "first_name": "john",
    "location_name": "wall mart park",
    "location_address": "New York, NY,USA",
    "start_time": "2025-01-12T14:30:00.000Z",(in CST)
    "end_time": "2025-01-13T14:30:00.000Z"(in CST)
  },
*/
clock_out.put("/:id", async (req, res) => {
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
  console.log(typeof req.body.timestamp);
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

export default clock_out;
