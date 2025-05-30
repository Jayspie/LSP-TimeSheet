import express from "express";
const timesheet = express.Router();
import sql from "../../other/db.js";
timesheet.use(express.json());

timesheet.get("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
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

export default timesheet;
