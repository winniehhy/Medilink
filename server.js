const express = require("express");
const bodyParser = require("body-parser");
const { insertHospitalData , validateHospitalLogin } = require("./iris");
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

app.get("/logIn", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "logIn.html"));
});

app.get("/signup_form_hospital", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "signup_form_hospital.html"));
});

app.get("/signup_form_nursing", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "signup_form_nursing.html"));
});

/*--------------------------------------- SIGN UP ------------------------------------------------------- */

// HOSPITAL SIGNUP ROUTE
app.post("/api/hospital-signup", (req, res) => {
    const { username, password, hospitalName, hospitalAddress, hospitalPhone } = req.body;
  
    // Basic validation for required fields
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }
  
    // Call the function to insert hospital data
    const success = insertHospitalData(username, password, hospitalName, hospitalAddress, hospitalPhone);
  
    if (!success) {
      return res.status(500).json({ error: "Failed to insert hospital account" });
    }
  
    // Send success response back to the frontend
    res.status(201).json({ message: "Hospital account created successfully!" });
  });

  /*--------------------------------------- Log In ------------------------------------------------------- */

  app.post("/api/hospital-login", async (req, res) => {
    console.log("Received login request:", req.body); // Add logging

    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
        console.log("Missing credentials");
        return res.status(400).json({ 
            error: "Please provide both username and password" 
        });
    }

    try {
        // Call the validation function
        const loginResult = validateHospitalLogin(username, password);
        console.log("Login result:", loginResult); // Add logging

        if (loginResult.success) {
            res.json({ 
                message: "Login successful"
            });
        } else {
            res.status(401).json({ 
                error: loginResult.error || "Invalid username or password"
            });
        }
    } catch (error) {
        console.error("Login error:", error); // Add logging
        res.status(500).json({ 
            error: "Internal server error. Please try again." 
        });
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