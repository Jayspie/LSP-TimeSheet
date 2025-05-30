import sql from "/Users/jamarionhines/Documents/GitHub/LSP-TimeSheet/other/db.js";
const time = async function clock_outCheck() {
  const isClockOut = await sql`SELECT
    *
FROM
    TIMESHEET 
WHERE 
    clock_out IS NULL`;

  /*var schedule = await sql`SELECT
    work_date,
    start_time,
    end_time
FROM
    SCHEDULE
WHERE
    last_name = ${isClockOut[0].last_name}
    AND first_name = ${isClockOut[0].first_name};`;
*/
  return isClockOut;
};

export default time;
