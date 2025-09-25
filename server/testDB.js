const pool = require('./utils/db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("DB connected at:", res.rows[0].now);
    process.exit();
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
})();
