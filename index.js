import express from "express";
import sql from "./db.js";
import 'dotenv/config';

const app = express();
app.use(express.json());

//ADMIN FOR EMPLOYEE LISTING

app.get("/employees:id", async (req, res) => { //
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
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

app.post("/employees:id", async (req, res) => {
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
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

app.put("/employees:id", async (req, res) => {
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
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
                updates.push(await sql`
            UPDATE Employees 
            SET last_name = ${last_name} 
            WHERE id = ${id}
        `);
            }

            if (first_name !== employee.first_name) {
                updates.push(await sql`
            UPDATE Employees 
            SET first_name = ${first_name} 
            WHERE id = ${id}
        `);
            }

            if (employeesadmin !== employee.admin) {
                updates.push(await sql`
            UPDATE Employees 
            SET admin = ${employeesadmin} 
            WHERE id = ${id}
        `);
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

app.delete("/employees:id", async (req, res) => {
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
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

//ADMIN FOR LOCATION LISTING

app.get("/location:id", async (req, res) => { //
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
    )}`;
    if (admin[0]?.admin == true) {
        try {
            const employees = await sql`
           SELECT* FROM locations ORDER BY location_name ASC;
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

app.post("/location:id", async (req, res) => { //
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
    )}`;
    if (admin[0]?.admin == true) {
        const { location_name, location_address } = req.body;
     
            fetch(`
                https://maps.googleapis.com/maps/api/geocode/json?address=${location_address}&key=${process.env.API_KEY}`)
                .then((response) => {
                    return response.json();
                })
                .then(async (jsonData) => {
                    let latog = jsonData.results[0].geometry.location.lat;//east to west 
                    let lngog = jsonData.results[0].geometry.location.lng;//north to south
                    let lat1 = latog + 0.001;
                    let lng1 = lngog + 0.001;
                    let lat2 = latog - 0.001;
                    let lng2 = lngog - 0.001;

                    const result = await sql`
                    INSERT INTO Locations (location_name, location_address, lat_1, long_1, lat_2, long_2)
                    values (${location_name}, ${location_address}, ${lat1}, ${lng1}, ${lat2}, ${lng2})
                    returning *`
                    res.status(200).json(result);
                })
                .catch((error) => {
                    console.log(error);
                });
            
    } else {
        res.status(500).json({ error: "dont have acess" });
    }
});

app.put("/location:id", async (req, res) => {
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
    )}`;
    if (admin[0]?.admin == true) {
        const { location_name, location_address,id } = req.body;

        fetch(`
            https://maps.googleapis.com/maps/api/geocode/json?address=${location_address}&key=${process.env.API_KEY}`)
            .then((response) => {
                return response.json();
            })
            .then(async (jsonData) => {
                let latog = jsonData.results[0].geometry.location.lat;//east to west 
                let lngog = jsonData.results[0].geometry.location.lng;//north to south
                let lat1 = latog + 0.001;
                let lng1 = lngog + 0.001;
                let lat2 = latog - 0.001;
                let lng2 = lngog - 0.001;

                const result = await sql`
                UPDATE Locations
                SET location_name=${location_name}, location_address=${location_address}, lat_1=${lat1}, long_1=${lng1}, lat_2=${lat2}, long_2=${lng2}
                WHERE id = ${id}`
                res.status(200).json(result);
            })
            .catch((error) => {
                console.log(error);
            });
        
    } else {
        res.status(500).json({ error: "Dont have access" });
    }
});

app.delete("/location:id", async (req, res) => {
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
    )}`;
    if (admin[0]?.admin == true) {
        try {
            const employees = await sql`
            DELETE FROM locations
            WHERE location_name = ${req.body.location_name};
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

//ADMIN FOR SCHEDULE
app.get("/schedule:id", async (req, res) => { 
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
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

app.post("/schedule:id", async (req, res) => {
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
    )}`;
    if (admin[0]?.admin == true) {
        const { work_date ,
            last_name ,
            first_name ,
            location_name ,
            location_address ,
            start_time ,
            end_time} = req.body;
        try {
            const result = await sql`
      insert into schedule (work_date ,
            last_name ,
            first_name ,
            location_name ,
            location_address ,
            start_time ,
            end_time)
      values (${work_date}, ${last_name}, ${first_name}, ${location_name},${location_address}, ${start_time}, ${end_time})
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

app.put("/schedule:id", async (req, res) => {
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
    )}`;
    if (admin[0]?.admin == true) {
        const { id, work_date ,
            last_name ,
            first_name ,
            location_name ,
            location_address ,
            start_time ,
            end_time } = req.body;

        try {
            // Fetch the current values for the given employee.
            const [schedule] = await sql`
            SELECT work_date ,last_name ,first_name ,location_name ,location_address ,start_time ,end_time
            FROM schedule 
            WHERE id = ${id}`;

            if (!schedule) {
                return res.status(404).json({ error: "Employee not found" });
            }

            // Initialize an array to store update queries.
            const updates = [];

            if (work_date !== schedule.work_date) {
                updates.push(await sql`
            UPDATE schedule 
            SET work_date = ${work_date} 
            WHERE id = ${id}
        `);
            }

            if (last_name !== schedule.last_name) {
                updates.push(await sql`
            UPDATE schedule 
            SET last_name = ${last_name} 
            WHERE id = ${id}
        `);
            }

            if (first_name !== schedule.first_name) {
                updates.push(await sql`
            UPDATE schedule 
            SET first_name = ${first_name} 
            WHERE id = ${id}
        `);
            }

            if (location_name !== schedule.location_name) {
                updates.push(await sql`
            UPDATE schedule 
            SET location_name = ${location_name} 
            WHERE id = ${id}
        `);
            }

            if (location_address !== schedule.last_nalocation_addressme) {
                updates.push(await sql`
            UPDATE schedule 
            SET location_address = ${location_address} 
            WHERE id = ${id}
        `);
            }

            if (start_time !== schedule.start_time) {
                updates.push(await sql`
            UPDATE schedule 
            SET start_time = ${start_time} 
            WHERE id = ${id}
        `);
            }

            if (end_time !== schedule.end_time) {
                updates.push(await sql`
            UPDATE schedule 
            SET end_time = ${end_time} 
            WHERE id = ${id}
        `);
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

app.delete("/schedule:id", async (req, res) => {
    const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
        req.params.id.replace(":", "")
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








app.listen(80, () => {
    console.log("[server] Application started on port 80!");
});