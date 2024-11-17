//Import the db config
const dbConfig = require("../config/db.config");
//Import the path module to get the sql file path
const path = require("path");
//Import the fs module to read the SQL file
const fs = require("fs");
// Install function to run SQL schema
const install = async () => {
  try {
    //Get sql file path from config
    const sqlFilePath = path.resolve(
      __dirname,
      "./sql/initial-queries.sql"
    );
    // Step 1: Read SQL file
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    // Step 2: Split SQL by semicolons to get individual statements
    const statements = sql
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement);
    // console.log(sql);
    // Step 4: Execute each statement sequentially
    for (let statement of statements) {
      await dbConfig.query(statement);
    }
    await dbConfig.end();
    return "Database installation successfull";
  } catch (error) {
    console.error("Error installing database:", error);
    return "Database installation failed";
  }
};

module.exports = { install };
