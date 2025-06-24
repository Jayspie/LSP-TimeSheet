import express from "express";
const public_getloc = express.Router();
import sql from "../../other/db.js";
public_getloc.use(express.json());

public_getloc.get("/:id", async (req, res) => {
  // Gets the users id and see if user id exist
  const emp_id = await sql`
    SELECT id FROM employees WHERE id=${Number(req.params.id.replace(":", ""))}
  `;

  const all_emp = await sql`SELECT id FROM employees`;

  if (all_emp.some((emp) => emp.id === emp_id[0]?.id)) {
    //if the id exist it will try to find the timesheet data and return it to the frontend
    try {
      const location =
        await sql` SELECT location_address FROM Locations WHERE location_name=${req.query.location_name};`;

      const string = JSON.stringify(location[0].location_address);
      return res.status(200).send(string);
    } catch (error) {
      console.error("[server] Error fetching employee:", error);
      return res.status(500).json({ error: "Failed to fetch employee" });
    }
  } else {
    return res.status(500).json({ error: "dont have acess" });
  }
});

export default public_getloc;
