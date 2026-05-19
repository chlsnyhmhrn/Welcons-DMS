import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "$chelsea1825",
  database: "welcons_doc",
});

console.log("✅ MySQL Connected");

export default db;