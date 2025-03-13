import express from "express";
const employ = express.Router();
import sql from "../../other/db.js";
employ.use(express.json());
employ.get("/:admin_id", async (req, res) => {
  //
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    try {
      const employees = await sql`
              select *
              from employees
              ORDER BY id ASC
          `;
      res.status(200).json(employees);
    } catch (error) {
      console.error("[server] Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  } else {
    res.status(500).json({ error: "dont have acess" });
  }
});

employ.post("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  let random_id = Math.floor(Math.random() * (6532 - 1000) + 1000);
  if (admin[0]?.admin == true) {
    const { last_name, first_name, admin } = req.body;
    try {
      const result = await sql`
        insert into employees (id, last_name, first_name, admin)
        values (${random_id}, ${last_name}, ${first_name}, ${admin})
        returning *
      `;
      res.status(201).json(result);
    } catch (error) {
      console.error("[server] Error adding employee:", error);
      res.status(500).json({ error: "Failed to add employee" });
    }
  } else {
    res.status(500).json({ error: "Dont have access" });
  }
});

employ.put("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    const { id, last_name, first_name, employeesadmin } = req.body;

    try {
      // Fetch the current values for the given employee.
      const [employee] = await sql`
              SELECT last_name, first_name, admin 
              FROM employees 
              WHERE id = ${id}`;

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      // Initialize an array to store update queries.
      const updates = [];

      if (last_name !== employee.last_name) {
        updates.push(
          await sql`
              UPDATE Employees 
              SET last_name = ${last_name} 
              WHERE id = ${id}
          `
        );
      }

      if (first_name !== employee.first_name) {
        updates.push(
          await sql`
              UPDATE Employees 
              SET first_name = ${first_name} 
              WHERE id = ${id}
          `
        );
      }

      if (employeesadmin !== employee.admin) {
        updates.push(
          await sql`
              UPDATE Employees 
              SET admin = ${employeesadmin} 
              WHERE id = ${id}
          `
        );
      }

      // Execute all updates if there are changes.
      if (updates.length > 0) {
        const results = await Promise.all(updates);
        return res.status(200).json({ message: "Employee updated", results });
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

employ.delete("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    try {
      const employees = await sql`
              DELETE FROM Employees
              WHERE id = ${req.body.id};
          `;
      res.status(200).json(employees);
    } catch (error) {
      console.error("[server] Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  } else {
    res.status(500).json({ error: "dont have acess" });
  }
});
export default employ;
