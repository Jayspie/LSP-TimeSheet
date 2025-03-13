import express from "express";
const loc = express.Router();
import sql from "../../other/db.js";
loc.use(express.json());

loc.get("/:admin_id", async (req, res) => {
  //
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
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

loc.post("/:admin_id", async (req, res) => {
  //
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    const { location_name, location_address } = req.body;

    fetch(`
                  https://maps.googleapis.com/maps/api/geocode/json?address=${location_address}&key=${process.env.API_KEY}`)
      .then((response) => {
        return response.json();
      })
      .then(async (jsonData) => {
        let latog = jsonData.results[0].geometry.location.lat; //east to west
        let lngog = jsonData.results[0].geometry.location.lng; //north to south
        let lat1 = latog + 0.001;
        let lng1 = lngog + 0.001;
        let lat2 = latog - 0.001;
        let lng2 = lngog - 0.001;

        const result = await sql`
                      INSERT INTO Locations (location_name, location_address, lat_1, long_1, lat_2, long_2)
                      values (${location_name}, ${location_address}, ${lat1}, ${lng1}, ${lat2}, ${lng2})
                      returning *`;
        res.status(200).json(result);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    res.status(500).json({ error: "dont have acess" });
  }
});

loc.put("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
  )}`;
  if (admin[0]?.admin == true) {
    const { location_name, location_address, id } = req.body;

    fetch(`
              https://maps.googleapis.com/maps/api/geocode/json?address=${location_address}&key=${process.env.API_KEY}`)
      .then((response) => {
        return response.json();
      })
      .then(async (jsonData) => {
        let latog = jsonData.results[0].geometry.location.lat; //east to west
        let lngog = jsonData.results[0].geometry.location.lng; //north to south
        let lat1 = latog + 0.001;
        let lng1 = lngog + 0.001;
        let lat2 = latog - 0.001;
        let lng2 = lngog - 0.001;

        const result = await sql`
                  UPDATE Locations
                  SET location_name=${location_name}, location_address=${location_address}, lat_1=${lat1}, long_1=${lng1}, lat_2=${lat2}, long_2=${lng2}
                  WHERE id = ${id}`;
        res.status(200).json(result);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    res.status(500).json({ error: "Dont have access" });
  }
});

loc.delete("/:admin_id", async (req, res) => {
  const admin = await sql`SELECT admin FROM employees WHERE id=${Number(
    req.params.admin_id.replace(":", "")
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
export default loc;
