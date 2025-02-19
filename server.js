

// const express = require("express");
// const cors = require("cors");
// const irisnative = require("intersystems-iris-native");

// const app = express();
// const PORT = 5000;

// // Enable CORS and JSON parsing
// app.use(cors());
// app.use(express.json());

// // Database credentials
// const dbConfig = {
//     host: "localhost",
//     port: 1972,
//     ns: "USER",
//     user: "_SYSTEM",
//     pwd: "121314",
// };

// // Connect to InterSystems IRIS
// let connection;
// let irisNative;

// try {
//     connection = irisnative.createConnection(dbConfig);
//     irisNative = connection.createIris();
//     console.log("Hello World! You have successfully connected to InterSystems IRIS.");
// } catch (error) {
//     console.error("Failed to connect to IRIS:", error.message);
// }

// // API endpoint
// app.get("/", (req, res) => {
//     res.send("Hello World! You have successfully connected to InterSystems IRIS.");
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


/*------------------ database testing----------------*/

const express = require("express");
const cors = require("cors");
const irisnative = require("intersystems-iris-native");
const path = require("path");

const app = express();
const PORT = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static("frontend/"));

// Database credentials
const dbConfig = {
    host: "localhost",
    port: 1972,
    ns: "USER",
    user: "_SYSTEM",
    pwd: "121314",
};

// Connect to InterSystems IRIS
const connection = irisnative.createConnection(dbConfig);
const irisNative = connection.createIris();

// Serve the HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/", "nursing_homepage.html"));
});

// API endpoint to retrieve data from IRIS
app.get("/api/data", (req, res) => {
    try {
        const key = req.query.key; // Get key from query parameters
        if (!key) {
            return res.status(400).json({ error: "Please provide a key." });
        }
        
        const value = irisNative.get("^testglobal", key); // Fetch based on key
        if (value === undefined) {
            return res.status(404).json({ error: `No value found for key: ${key}` });
        }

        res.json({ message: `Value for ${key}: ${value}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve data from IRIS" });
    }
});


// API endpoint to store data in IRIS
app.post("/api/data", (req, res) => {
    try {
        const { key, value } = req.body;
        irisNative.set(value, "^testglobal", key);
        res.json({ message: `Stored ${value} at ^testglobal(${key})` });
    } catch (error) {
        res.status(500).json({ error: "Failed to store data in IRIS" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
