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
app.use(express.static("frontend"));

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
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// API endpoint to retrieve data from IRIS
app.get("/api/data", (req, res) => {
    try {
        const value = irisNative.get("^testglobal", "1");
        res.json({ message: `Value from IRIS: ${value}` });
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
