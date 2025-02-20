const express = require("express");
const bodyParser = require("body-parser");
const irisDB = require("./iris");
const path = require("path");  // ✅ Import path module

const app = express();
app.use(bodyParser.json());

// Serve static files from "frontend" folder
app.use(express.static(path.join(__dirname, "frontend")));

// Redirect to homepage.html when the server starts
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "homepage.html"));
});

// Serve signup.html when /signup is accessed
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "signup.html"));
});

// **GET API: Fetch Data**
app.get("/api/data", async (req, res) => {
    try {
        const data = irisDB.getData();
        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// **POST API: Insert Data**
app.post("/api/data", async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key || !value) return res.status(400).json({ error: "Missing key or value" });

        const success = irisDB.insertData(key, value);
        if (!success) return res.status(500).json({ error: "Failed to insert data" });

        res.json({ message: "Data inserted successfully!" });
    } catch (error) {
        console.error("❌ Error inserting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// **Check Database Connection**
app.get("/api/check-connection", (req, res) => {
    const db = irisDB.connectToDB();
    if (db) {
        res.json({ message: "Database connected successfully!" });
    } else {
        res.status(500).json({ error: "Database connection failed" });
    }
});

// **Start Server**
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 REST API running on http://localhost:${PORT}`));