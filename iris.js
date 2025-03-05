const iris = require("./backend/intersystems-iris-native");
const bcrypt = require('bcrypt');

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
        try {
            const db = connectToDB();
            if (!db) throw new Error("Database connection failed");

            const args = [username, hashedPassword, hospitalName, hospitalAddress, hospitalPhone];
            console.log("Prepared parameters:", args);

            // Check if username exists
            let retrievedUsername = db.classMethodValue(
                "Medilink.HospitalAccount",
                "GetUsername",
                username
            );

            if (retrievedUsername) {
                return reject(new Error("Username already exists"));
            }

            // Insert data
            db.classMethodVoid(
                "Medilink.HospitalAccount",
                "InsertHospitalData",
                ...args
            );

            console.log(`✅ Inserted hospital account for: ${username}`);
            resolve(true);
        } catch (error) {
            console.error("❌ Error calling class method:", error);
            reject(new Error("Database operation failed"));
        }
    });
}

async function validatePassword(inputUsername, inputPassword, requestParty) {
    const db = connectToDB();
    if (!db) {
        console.error("Database connection failed during login");
        return false;
    }

    try {
        let retrievedHash = "";

        if (requestParty === "hospital") {
            retrievedHash = await db.classMethodValue(
                "Medilink.HospitalAccount",
                "GetHashedPasswordByUsername",
                inputUsername
            );
        }

        if (!retrievedHash) {
            console.error("Invalid username or password");
            return false;
        }

        return await bcrypt.compare(inputPassword, retrievedHash);
    } catch (error) {
        console.error("Error during password validation:", error);
        return false;
    }
}

// function validateHospitalLogin(username, password) {
//     console.log("Attempting to validate login for:", username); // Add logging
    
//     const db = connectToDB();
//     if (!db) {
//         console.error("Database connection failed during login"); // Add logging
//         return { success: false, error: "Database connection failed" };
//     }

//     try {
//         // Convert parameters to strings
//         const args = [
//             JSON.stringify(username),
//             JSON.stringify(password)
//         ];

//         console.log("Calling IRIS GetHashedPasswordByUsername method"); // Add logging
        
//         // Call the ValidateLogin method from your IRIS class
//         const result = db.classMethodValue(
//             "Medilink.HospitalAccount",
//             "ValidateLogin",
//             ...args
//         );

//         console.log("IRIS ValidateLogin result:", result); // Add logging

//         if (result === "1" || result === 1) {
//             return { 
//                 success: true,
//                 message: "Login successful"
//             };
//         } else {
//             return { 
//                 success: false,
//                 error: "Invalid username or password"
//             };
//         }
//     } catch (error) {
//         console.error("Login validation error:", error); // Add logging
//         return { 
//             success: false, 
//             error: `Login validation failed: ${error.message}`
//         };
//     }
// }

/*---------------------------------------- NURSING HOME-------------------------------------------- */

function insertNursingHomeData(finalData) {
    return new Promise((resolve, reject) => {
        const db = connectToDB();
        if (!db) throw new Error("Database connection failed");
	
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
			let retrievedUsername = db.classMethodValue(
                "Medilink.NursingHomeAccount",
                "GetUsername",
                finalData.username
            );

            if (retrievedUsername) {
                return reject(new Error("Username already exists"));
            }

            db.classMethodVoid(
                "Medilink.NursingHomeAccount",
                "InsertNursingHomeData",
                ...args
            );
            console.log(`✅ Inserted nursing home account for: ${finalData.username}`);
            resolve(true);
            
        } catch (error) {
            console.error("❌ Error calling class method:", error);
            reject(new Error("Database operation failed"));
        }
    });
}

function validateNursingHomeLogin(username, password) {
    console.log("Attempting to validate login for:", username);
    
    const db = connectToDB();
    if (!db) {
        console.error("Database connection failed during login");
        return { success: false, error: "Database connection failed" };
    }

    try {
        // Call the GetNursingHomeAccountByUsername method with the connection
        const accountDataJson = db.classMethodValue(
            "Medilink.NursingHomeAccount",
            "GetNursingHomeAccountByUsername",
            username
        );
      
        // Parse the JSON response
        const accountData = JSON.parse(accountDataJson);
      
        // Check if we got valid data back
        if (!accountData || accountData.error) {
            return { 
                success: false, 
                error: accountData.error || "User not found" 
            };
        }
      
        // Return the account data
        return { success: true, accountData };
    } catch (error) {
        console.error("Error validating nursing home login:", error);
        return { 
            success: false, 
            error: "Internal server error" 
        };
    }
}  

/*------------------------------------------GET INFORMATION ------------------------------------- */

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


function getNursingHomeAccount(username) {
    console.log("Attempting to get nursing home account for:", username);
    
    const db = connectToDB();
    if (!db) {
        console.error("Database connection failed during nursing home account retrieval");
        return null;
    }

    try {

        const args = [username];

        // Call the GetNursingHomeAccountByUsername method
        const jsonResult = db.classMethodValue(
            "Medilink.NursingHomeAccount", 
            "GetNursingHomeAccountByUsername", 
            ...args
        );
        
        if (!jsonResult) {
            console.log("No nursing home account found");
            return null;
        }
        
        // Parse the result
        const accountData = JSON.parse(jsonResult);
        console.log("Nursing home account retrieved successfully");
        return accountData;
    } catch (error) {
        console.error("Error getting nursing home account:", error);
        return null;
    }
}

/*---------------------------------------- REGISTER PATIENT -------------------------------------------- */
function formatDate(dateString) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
}

function sanitizeInput(input) {
    return JSON.stringify(input).replace(/"/g, ''); // Remove extra quotes
}

async function insertPatientData(
    staff, 
    admissionDate, 
    patientName, 
    patientIc, 
    sex, 
    ambulation, 
    walkingAids, 
    cognitiveConditions, 
    mentalHealthConditions, 
    documentsNeeded
) {
    try {
        const db = connectToDB();
        if (!db) {
            console.error("❌ Database connection failed");
            return false;
        }

        // Convert date format
        const formattedDate = formatDate(admissionDate);
        
        // Sanitize input
        staff = sanitizeInput(staff);
        patientName = sanitizeInput(patientName);
        patientIc = sanitizeInput(patientIc);
        sex = sanitizeInput(sex);
        ambulation = sanitizeInput(ambulation);
        walkingAids = sanitizeInput(walkingAids);
        cognitiveConditions = sanitizeInput(cognitiveConditions.join(", "));
        mentalHealthConditions = sanitizeInput(mentalHealthConditions.join(", "));
        documentsNeeded = sanitizeInput(documentsNeeded.join(", "));
        
        console.log("🛠️ Preparing to insert:", { 
            staff, 
            formattedDate, 
            patientName, 
            patientIc, 
            sex, 
            ambulation, 
            walkingAids, 
            cognitiveConditions, 
            mentalHealthConditions, 
            documentsNeeded 
        });

        // Call IRIS method with formatted date
        db.classMethodVoid(
            "Medilink.Patient",  
            "InsertPatientData",
            staff, 
            formattedDate, 
            patientName, 
            patientIc, 
            sex, 
            ambulation, 
            walkingAids, 
            cognitiveConditions, 
            mentalHealthConditions, 
            documentsNeeded
        );

        console.log(`✅ Successfully inserted patient: ${patientName}`);
        return true;
    } catch (error) {
        console.error("❌ Error inserting patient data:", error);
        return false;
    }
}



/*---------------------------------------- EXPORTS -------------------------------------------- */

module.exports = {
    insertHospitalData,
    insertNursingHomeData,
    validatePassword,
    validateNursingHomeLogin,
    getHospitalAccounts,
    getNursingHomeAccount,

    insertPatientData,
};