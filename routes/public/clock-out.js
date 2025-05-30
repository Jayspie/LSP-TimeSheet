import express from "express";
const clock_out = express.Router();
import sql from "../../other/db.js";
clock_out.use(express.json());

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
