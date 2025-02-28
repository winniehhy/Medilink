const express = require("./backend/node_modules/express");
const session = require("./backend/node_modules/express-session");
const bodyParser = require("./backend/node_modules/body-parser");
const { insertHospitalData, insertNursingHomeData, validatePassword,validateNursingHomeLogin, getHospitalAccounts } = require("./iris");
const path = require("path");
const cors = require('./backend/node_modules/cors');
const bcrypt = require("./backend/node_modules/bcryptjs");

// Initialize Express app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: "mySuperSecretKey", // save to .env later
  resave: false,
  saveUninitialized: true
}));

// Serve static files from "frontend" folder
app.use(express.static(path.join(__dirname, "frontend")));

// Static Routes - grouped together
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "Pages/Access/homepage.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "Pages/Access/signup.html"));
});

app.get("/logIn", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "Pages/Access/logIn.html"));
});

app.get("/signup_form_hospital", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "Pages/Access/signup_form_hospital.html"));
});

app.get("/signup_form_nursing", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "Pages/Access/signup_form_nursing.html"));
});

app.get("/signup_form_nursing_criteria", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "Pages/Access/signup_form_nursing_criteria.html"));
});

/*--------------------------------------- SIGN UP ROUTES ------------------------------------------------------- */

function isValidSGPhoneNumber(phone) {
    const localPattern = /^[689]\d{7}$/;
    const internationalPattern = /^\+65[689]\d{7}$/;

    return localPattern.test(phone) || internationalPattern.test(phone);
}

// Hospital Signup Route
app.post("/api/hospital-signup", async (req, res) => {
	const { username, password, hospitalName, hospitalAddress, hospitalPhone } = req.body;
  
	// Validate required fields
	if (!username || !password || !hospitalName || !hospitalAddress || !hospitalPhone) {
	  return res.status(400).json({ error: "Missing fields!" });
	}
  
	// Validate password length
	if (password.length < 6) {
	  return res.status(400).json({ error: "Password must be at least 6 characters long." });
	}

	if (!isValidSGPhoneNumber(hospitalPhone)) {
		return res.status(400).json({ error: "Invalid Singapore phone number." });
	}
  
	try {
	  const salt = await bcrypt.genSalt(10);
	  const hashedPassword = await bcrypt.hash(password, salt);
  
	  await insertHospitalData(username, hashedPassword, hospitalName, hospitalAddress, hospitalPhone);
	  
	  res.status(201).json({ message: "Hospital account created successfully!" });
  
	} catch (error) {
	  console.error("Error during hospital signup:", error.message);
  
	  if (error.message === "Username already exists") {
		return res.status(409).json({ error: "Username already exists" });
	  }
  
	  res.status(500).json({ error: "Internal server error" });
	}
  });
  

// Nursing Home Signup Routes (Two-Step Process)
// Step 1: Store initial data in session
app.post("/api/nursinghome-signup-temp", async (req, res) => {
  const { username, password, nursingHomeName, nursingHomeAddress, nursingHomePhone } = req.body;

  if (!username || !password || !nursingHomeName || !nursingHomeAddress || !nursingHomePhone) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  if (!isValidSGPhoneNumber(nursingHomePhone)) {
	return res.status(400).json({ error: "Invalid Singapore phone number." });
}

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.session.signupData = {
      username,
      nursingHomeName,
      nursingHomeAddress,
      nursingHomePhone,
      hashedPassword
    };

    res.status(200).json({ message: "Data stored in session successfully" });
  } catch (error) {
    console.error("Error during nursing home signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Step 2: Complete nursing home signup process
app.post("/api/nursinghome-signup", async (req, res) => {
	if (!req.session.signupData) {
	  return res.status(400).send("First step data missing.");
	}
  
	const finalData = { ...req.session.signupData, ...req.body };
	console.log("final data", finalData);
  
	try {
	  await insertNursingHomeData(finalData);
	  res.status(201).json({ message: "Nursing Home account created successfully!" });
	} catch (error) {
	  console.error("Error during nursing home signup:", error.message);
  
	  if (error.message === "Username already exists") {
		return res.status(409).json({ error: "Username already exists" });
	  }
  
	  return res.status(500).json({ error: "Internal server error" });
	} finally {
	  req.session.destroy(); // Destroy session AFTER response is sent
	}
  });
  
  

/*--------------------------------------- LOGIN ROUTES ------------------------------------------------------- */

// Hospital Login Route
app.post("/api/hospital-login", async (req, res) => {
  console.log("Received login request:", req.body);

  const { username, password } = req.body;
  
  if (!username || !password) {
    console.log("Missing credentials");
    return res.status(400).json({ 
      error: "Please provide both username and password" 
    });
  }

  try {
	const isValid = await validatePassword(username, password, "hospital");
	if (isValid) {
		console.log("Login successful!");
		res.json({ message: "Login successful"});
	} else {
		console.log("Invalid username or password");
		res.status(401).json({ error: loginResult.error || "Invalid username or password"});
	}
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: "Internal server error. Please try again." 
    });
  }
});

app.post("/api/nursinghome-login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Please provide username and password" });
    }

    console.log("Attempting nursing home login for:", username);

    // 1) Fetch the account record (including hashed password)
    const { success, accountData, error } = validateNursingHomeLogin(username, password);
    
    if (!success) {
        // e.g. user not found
        return res.status(401).json({ error });
    }

    // 2) Compare the plain text password with the stored hash
    try {
        const isMatch = await bcrypt.compare(password, accountData.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        
        // 3) If matched, login is successful
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error("Error comparing password:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/*--------------------------------------- DATA ACCESS ROUTES ------------------------------------------------------- */

// Hospital Search API
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

/*----------------------------------------- REGISTER PATIENT --------------------------------------------------- */

const { insertPatientData } = require("./iris"); // Import function

// API Route to store patient information
app.post("/api/save-patient", async (req, res) => {
    const { staff, patientId, admissionDate, patientName, patientIc, sex } = req.body;

    if (!staff || !patientId || !admissionDate || !patientName || !patientIc || !sex) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const success = await insertPatientData(staff, patientId, admissionDate, patientName, patientIc, sex);

        if (!success) {
            return res.status(500).json({ error: "Failed to insert patient record." });
        }

        res.status(201).json({ message: "Patient record saved successfully!" });
    } catch (error) {
        console.error("Error saving patient record:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


/*--------------------------------------- UTILITY ROUTES ------------------------------------------------------- */

// Check Database Connection
app.get("/api/check-connection", (req, res) => {
  const db = irisDB.connectToDB();
  if (db) {
    res.json({ message: "Database connected successfully!" });
  } else {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Start Server
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 REST API running on http://localhost:${PORT}`));