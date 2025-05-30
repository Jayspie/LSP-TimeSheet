import express from "express";
const schedule = express.Router();
import sql from "../../other/db.js";
schedule.use(express.json());

schedule.get("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    try {
      const schedule = await sql`
              select *
              from schedule
              ORDER BY work_date ASC
          `;
      res.status(200).json(schedule);
    } catch (error) {
      console.error("[server] Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  } else {
    res.status(500).json({ error: "dont have acess" });
  }
});

schedule.post("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    const { work_date, id, location_name, start_time, end_time } = req.body;
    try {
      const emp_name = await sql`SELECT * FROM employees WHERE id = ${id}`;
      const loc_add =
        await sql`SELECT * FROM locations WHERE location_name = ${location_name}`;

      console.log(
        `${work_date}, ${emp_name[0].last_name}, ${emp_name[0].first_name}, ${location_name},${loc_add[0].location_address}, ${start_time}, ${end_time}`
      );
      const result = await sql`insert into schedule (
              work_date ,
              last_name ,
              first_name ,
              location_name ,
              location_address ,
              start_time ,
              end_time)
          values (${work_date}, ${emp_name[0].last_name}, ${emp_name[0].first_name}, ${location_name},${loc_add[0].location_address}, ${start_time}, ${end_time})returning *`;
      res.status(201).json(result);
    } catch (error) {
      console.error("[server] Error adding employee:", error);
      res.status(500).json({ error: "Failed to add employee" });
    }
  } else {
    res.status(500).json({ error: "Dont have access" });
  }
});

schedule.put("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    const {
      id,
      work_date,
      last_name,
      first_name,
      location_name,
      location_address,
      start_time,
      end_time,
    } = req.body;

    try {
      // Fetch the current values for the given employee.
      console.log(req.body);
      const [schedule] = await sql`
              SELECT work_date ,last_name ,first_name ,location_name ,location_address ,start_time ,end_time
              FROM schedule 
              WHERE id = ${id}`;
      console.log(schedule.last_name);

      if (!schedule) {
        return res.status(404).json({ error: "Schedule Not Found" });
      }

      // Initialize an array to store update queries.
      const updates = [];

      if (work_date !== schedule.work_date) {
        updates.push(
          await sql`
              UPDATE schedule 
              SET work_date = ${work_date} 
              WHERE id = ${id}
          `
        );
      }
      if (last_name !== schedule.last_name) {
        updates.push(
          await sql`
              UPDATE schedule 
              SET last_name = ${last_name} 
              WHERE id = ${id}
          `
        );
      }

      if (first_name !== schedule.first_name) {
        updates.push(
          await sql`
              UPDATE schedule 
              SET first_name = ${first_name} 
              WHERE id = ${id}
          `
        );
      }

      if (location_name !== schedule.location_name) {
        updates.push(
          await sql`
              UPDATE schedule 
              SET location_name = ${location_name} 
              WHERE id = ${id}
          `
        );
      }

      if (location_address !== schedule.location_address) {
        updates.push(
          await sql`
              UPDATE schedule 
              SET location_address = ${location_address} 
              WHERE id = ${id}
          `
        );
      }

      if (start_time !== schedule.start_time) {
        updates.push(
          await sql`
              UPDATE schedule 
              SET start_time = ${start_time} 
              WHERE id = ${id}
          `
        );
      }

      if (end_time !== schedule.end_time) {
        updates.push(
          await sql`
              UPDATE schedule 
              SET end_time = ${end_time} 
              WHERE id = ${id}
          `
        );
      }

      // Execute all updates if there are changes.
      if (updates.length > 0) {
        const results = await Promise.all(updates);
        return res.status(200).json({ message: "Schedule updated", results });
      } else {
        return res.status(200).json({ message: "No changes made" });
      }
    } catch (error) {
      console.error("[server] Error updating employee:", error);
      res.status(500).json({ error: "Failed to update employee" });
    }
  } else {
    res.status(500).json({ error: "Dont have access" });
  }
});

schedule.delete("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    try {
      const schedule = await sql`
              DELETE FROM schedule
              WHERE id = ${req.body.id};
          `;
      res.status(200).json(schedule);
    } catch (error) {
      console.error("[server] Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  } else {
    res.status(500).json({ error: "dont have acess" });
  }
});
export default schedule;
