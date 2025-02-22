const iris = require("intersystems-iris-native");

let connection;
let db;

function connectToDB() {
  if (db) return db;
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

function insertHospitalData(username, password, hospitalName, hospitalAddress, hospitalPhone) {
  const db = connectToDB();
  if (!db) return false;

  // Log original parameter types and values
  console.log("Original parameter types:", {
    username: typeof username,
    password: typeof password,
    hospitalName: typeof hospitalName,
    hospitalAddress: typeof hospitalAddress,
    hospitalPhone: typeof hospitalPhone
  });
  console.log("Original parameter values:", { username, password, hospitalName, hospitalAddress, hospitalPhone });

  // Convert each parameter using JSON.stringify
  const args = [
    JSON.stringify(username),
    JSON.stringify(password),
    JSON.stringify(hospitalName || ""),
    JSON.stringify(hospitalAddress || ""),
    JSON.stringify(hospitalPhone || "")
  ];
  
  // Log converted parameters and their types
  console.log("Converted parameters:", args);
  args.forEach((arg, index) => {
    console.log(`Parameter ${index + 1} type after conversion: ${typeof arg}`);
  });

  try {
    db.classMethodVoid(
      "Medilink.HospitalAccount",
      "InsertHospitalData",
      ...args
    );
    console.log(`✅ Inserted hospital account for: ${username}`);
    return true;
  } catch (error) {
    console.error("❌ Error calling class method:", error);
    return false;
  }
}

function validateHospitalLogin(username, password) {
    console.log("Attempting to validate login for:", username); // Add logging
    
    const db = connectToDB();
    if (!db) {
        console.error("Database connection failed during login"); // Add logging
        return { success: false, error: "Database connection failed" };
    }

    try {
        // Convert parameters to strings
        const args = [
            JSON.stringify(username),
            JSON.stringify(password)
        ];

        console.log("Calling IRIS ValidateLogin method"); // Add logging
        
        // Call the ValidateLogin method from your IRIS class
        const result = db.classMethodValue(
            "Medilink.HospitalAccount",
            "ValidateLogin",
            ...args
        );

        console.log("IRIS ValidateLogin result:", result); // Add logging

        if (result === "1" || result === 1) {
            return { 
                success: true,
                message: "Login successful"
            };
        } else {
            return { 
                success: false,
                error: "Invalid username or password"
            };
        }
    } catch (error) {
        console.error("Login validation error:", error); // Add logging
        return { 
            success: false, 
            error: `Login validation failed: ${error.message}`
        };
    }
}

module.exports = {
  insertHospitalData,
  validateHospitalLogin
};