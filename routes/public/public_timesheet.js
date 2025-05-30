import express from "express";
const public_timesheet = express.Router();
import sql from "../../other/db.js";
public_timesheet.use(express.json());

public_timesheet.get("/:id", async (req, res) => {
  // Gets the users id and see if user id exist
  const emp_id = await sql`
    SELECT id FROM employees WHERE id=${Number(req.params.id.replace(":", ""))}
  `;

  const all_emp = await sql`SELECT id FROM employees`;

  if (all_emp.some((emp) => emp.id === emp_id[0]?.id)) {
    //if the id exist it will try to find the timesheet data and return it to the frontend
    try {
      const schedule =
        await sql` SELECT * FROM TIMESHEET WHERE employees_id=${emp_id[0]?.id} ORDER BY
    clock_in DESC;;`;

      const string = JSON.stringify(schedule);
      return res.status(200).send(string);
    } catch (error) {
      console.error("[server] Error fetching employee:", error);
      return res.status(500).json({ error: "Failed to fetch employee" });
    }
  } else {
    return res.status(500).json({ error: "dont have acess" });
  }
});

export default public_timesheet;
