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

function insertHospitalData(username, hashedPassword, hospitalName, hospitalAddress, hospitalPhone) {
    return new Promise((resolve, reject) => {
        const db = connectToDB();
        if (!db) return reject("Database connection failed");

		const args = [username, hashedPassword, hospitalName, hospitalAddress, hospitalPhone];
		console.log("Prepared parameters:", args);
        try {
            db.classMethodVoid(
                "Medilink.HospitalAccount",
                "InsertHospitalData",
                ...args
            );
            console.log(`✅ Inserted hospital account for: ${username}`);
            resolve(true);
        } catch (error) {
            console.error("❌ Error calling class method:", error);
            reject(false);
        }
    });
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

function insertNursingHomeData(finalData) {
	return new Promise((resolve, reject) => {
		const db = connectToDB();
		if (!db) return reject("Database connection failed");

		// Log original parameter types and values
		console.log("Original parameter types:", Object.fromEntries(Object.entries(finalData).map(([key, value]) => [key, typeof value])));
		console.log("Original parameter values:", finalData);

		// Process selected_treatments
		let filteredTreatments = [];
		if (finalData.treatments === "Some" && Array.isArray(finalData.selected_treatments)) {
		filteredTreatments = finalData.selected_treatments.filter(t => t !== "Others").map(t => t.startsWith("Others:") ? t.replace("Others: ", "") : t);
		}

		const args = [
			finalData.username,
			finalData.hashedPassword,
			finalData.nursingHomeName,
			finalData.nursingHomeAddress,
			finalData.nursingHomePhone,
			finalData.party_responsibility,
			finalData.available_days.join(","),
			finalData.time_slot.from,
			finalData.time_slot.to,
			finalData.treatments,
			filteredTreatments.join(",")
		];
		console.log("Converted parameters:", args);
		args.forEach((arg, index) => {
			console.log(`Parameter ${index + 1} type after conversion: ${typeof arg}`);
		  });

		try {
			db.classMethodVoid(
				"Medilink.NursingHomeAccount",
				"InsertNursingHomeData",
				...args
			);
			console.log(`✅ Inserted nursing home account for: ${finalData.username}`);
			resolve(true);
			
		} catch (error) {
			console.error("❌ Error calling class method:", error);
			reject(false);
		}
	});
}

function getHospitalAccounts() {
const db = connectToDB();
if (!db) {
	console.error("❌ Database connection failed");
	return null;
}

try {
		// Call ObjectScript method and get JSON
		let jsonResult = db.classMethodValue("Medilink.HospitalAccount", "GetAllHospitals");

		// Convert JSON string to JavaScript array
		let results = JSON.parse(jsonResult);

		console.log("🔍 Query Result:", results);
		return results;
	} catch (error) {
		console.error("❌ Error fetching hospital data:", error.message);
		return [];
	}
}

module.exports = {
  insertHospitalData,
  validateHospitalLogin,
  insertNursingHomeData,
  getHospitalAccounts
};