const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { insertHospitalData , insertNursingHomeData, validateHospitalLogin, getHospitalAccounts } = require("./iris");
const path = require("path");  // ✅ Import path module
const cors = require('cors');
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors()); // double check
app.use(bodyParser.json());

app.use(session({
	secret: "mySuperSecretKey", // save to .env later
	resave: false,
	saveUninitialized: true
  }));

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

app.get("/signup_form_nursing_criteria", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "signup_form_nursing_criteria.html"));
});

/*--------------------------------------- SIGN UP ------------------------------------------------------- */

// HOSPITAL SIGNUP ROUTE
app.post("/api/hospital-signup", async (req, res) => {
    const { username, password, hospitalName, hospitalAddress, hospitalPhone } = req.body;
  
    if (!username || !password || !hospitalName || !hospitalAddress || !hospitalPhone) {
        return res.status(400).json({ error: "Missing fields!" });
    }

    try {
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const success = await insertHospitalData(username, hashedPassword, hospitalName, hospitalAddress, hospitalPhone);
        
        if (!success) {
            return res.status(500).json({ error: "Failed to insert hospital account" });
        }

        res.status(201).json({ message: "Hospital account created successfully!" });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// NURSING HOME SIGNUP ROUTE: FIRST PAGE
app.post("/api/nursinghome-signup-temp", (req, res) => {
    const { username, password, nursingHomeName, nursingHomeAddress, nursingHomePhone } = req.body;

    if (!username || !password || !nursingHomeName || !nursingHomeAddress || !nursingHomePhone) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    req.session.signupData = { // store data in session
        username,
        nursingHomeName,
        nursingHomeAddress,
        nursingHomePhone,
        password // Placeholder, need to hash it later and remove from session
    };

    res.status(200).json({ message: "Data stored in session successfully" });
});

	
// NURSING HOME SIGNUP ROUTE: SECOND PAGE
app.post("/api/nursinghome-signup", (req, res) => {
	if (!req.session.signupData) {
	  return res.status(400).send("First step data missing.");
	}
  
	const finalData = { ...req.session.signupData, ...req.body };
	console.log("final data", finalData);
	const success = insertNursingHomeData(finalData);
  
	req.session.destroy(); // Clear session after storing
	res.status(200).json({message: "Signup completed"});
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
  
/*--------------------------------------- Patient Search Bar ------------------------------------------------------- */
app.get('/api/hospital-search', async (req, res) => {
    try {
        const hospitals = getHospitalAccounts();
        if (!hospitals) {
            return res.status(500).json({ success: false, error: "Failed to fetch hospital data" });
        }
        res.json({ success: true, data: hospitals });
    } catch (error) {
        console.error("Error fetching hospital data:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
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
