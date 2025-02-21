const iris = require("intersystems-iris-native");

// **Singleton Connection**
let connection;
let db;

function connectToDB() {
    if (db) return db; // Return existing connection

    try {
        connection = iris.createConnection({
            host: "localhost", 
            port: 1972,         
            ns: "USER",         
            user: "demo",   
            pwd: "demo"       
        });

        console.log("✅ Connected to InterSystems IRIS via Native API!");
        db = connection.createIris();
        return db;
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        return null;
    }
}

// **Function to Fetch Data (SQL)**
function getData(key) {
    const db = connectToDB();
    if (!db) return null;

    try {
        const sql = "SELECT value_column FROM TestTable WHERE key_column = ?";
        const statement = db.execute(sql, [key]);

        if (statement.next()) {
            return statement.get(1); // Get the first column value
        }
        return null;
    } catch (error) {
        console.error("❌ SQL Query Error:", error);
        return null;
    }
}

// **Function to Insert Data (SQL)**
function insertData(key, value) {
    const db = connectToDB();
    if (!db) return false;

    try {
        // Correct SQL Query for inserting data
        const sql = "INSERT INTO TestTable (key_column, value_column) VALUES (?, ?)";
        const statement = db.execute(sql, [key, value]);

        console.log(`✅ Inserted: ${key} = ${value}`);
        return true;
    } catch (error) {
        console.error("❌ SQL Insert Error:", error);
        return false;
    }
}

// **✅ Export All Functions**
module.exports = { connectToDB, getData, insertData };
