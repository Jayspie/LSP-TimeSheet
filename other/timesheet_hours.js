import sql from "../other/db.js";

async function timesheet() {
  const timesheet = await sql`UPDATE TIMESHEET
SET total_hours = CONCAT(
  EXTRACT(HOUR FROM clock_out - clock_in), 'h ',
  EXTRACT(MINUTE FROM clock_out - clock_in), 'm'
)
WHERE total_hours IS NULL
AND clock_out IS NOT NULL;
`;
  return timesheet;
}

(async () => {
  try {
    const data = await timesheet();
    console.log(data);
  } catch (err) {
    console.error("Error fetching timesheet:", err);
    process.exit(1); // Exit with error code
  }
  process.exit(0); // Exit successfully
})();
