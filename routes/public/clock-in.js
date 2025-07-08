import express from "express";
import sql from "../../other/db.js";

const clock_in = express.Router();
clock_in.use(express.json());

const between = (x, min, max) => {
  return x >= min && x <= max;
};

const testloclat = "29.85981";
const testloclng = "-95.53534";
var late;
const utctime = new Date();
const utc_local = new Date(utctime.toLocaleDateString("en-US"));

clock_in.post("/:id", async (req, res) => {
  const emp_id = await sql`
    SELECT id FROM employees WHERE id=${Number(req.params.id.replace(":", ""))}
  `;

  const all_emp = await sql`SELECT id FROM employees`;

  if (all_emp.some((emp) => emp.id === emp_id[0]?.id)) {
    console.log(req.body.lat, req.body.lng, req.body.time, req.body.timestamp);
    function formatTime(date) {
      const pad = (n) => String(n).padStart(2, "0");
      return (
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes()) +
        ":" +
        pad(date.getSeconds())
      );
    }

    var time = req.body.timestamp;
    var originalDate = new Date(time);

    var dateHead = new Date(originalDate.getTime() + 5 * 60 * 1000);
    var dateBehind = new Date(originalDate.getTime() - 5 * 60 * 1000);

    var timehead = formatTime(dateHead);
    var timebehind = formatTime(dateBehind);
    const emp_name = await sql`
      SELECT * FROM employees WHERE id = ${emp_id[0]?.id}
    `;

    var time = utc_local.toISOString().split("T")[0] + "T00:00:00.000Z";
    console.log(
      req.body.db_time,
      emp_name[0].last_name,
      emp_name[0].first_name
    );

    const sche = await sql`
      SELECT * FROM SCHEDULE 
      WHERE work_date=${req.body.db_time} 
      AND start_time BETWEEN ${timebehind} AND ${timehead}
      AND last_name=${emp_name[0].last_name} 
      AND first_name=${emp_name[0].first_name}
    `;
    console.log(sche);
    if (sche.length !== 1) {
      return res.status(401).json({ error: "You are not on schedule" });
    }
    if (req.body.time < Number(sche[0].start_time.replaceAll(":", ""))) {
      return res.status(200).json({ error: "You clock in too early" });
    } else if (
      req.body.time >
      Number(sche[0].start_time.replaceAll(":", "")) + 500
    ) {
      return res.status(200).json({ error: "You clock in too late" });
    }

    const location = await sql`
      SELECT * FROM Locations WHERE location_name=${sche[0].location_name}
    `;

    if (
      between(req.body.lat, location[0].lat_2, location[0].lat_1) &&
      between(req.body.lng, location[0].long_2, location[0].long_1)
    ) {
      // Location is valid
      console.log("YOur in");
    } else {
      console.log("YOur out");
      return res.status(401).json({ error: "You are not at location" });
    }

    try {
      const result = await sql`
        insert into TIMESHEET (employees_ID, last_name, first_name, location_name, clock_in)
        values (
          ${emp_id[0]?.id}, 
          ${emp_name[0].last_name}, 
          ${emp_name[0].first_name}, 
          ${sche[0].location_name},
          ${req.body.timestamp}
        )
        returning *
      `;
      res.status(201).json(result);
    } catch (error) {
      console.error("[server] Timesheet error:", error);
      res.status(500).json({ error: "Failed to clock in" });
    }
  } else {
    return res.status(403).json({ error: "Don't have access" });
  }
});

export default clock_in;
