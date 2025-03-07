const iris = require("./backend/intersystems-iris-native");
const bcrypt = require('./backend/node_modules/bcrypt');

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

/*---------------------------------------- NURSING HOME-------------------------------------------- */

function insertNursingHomeData(finalData) {
    return new Promise((resolve, reject) => {
        const db = connectToDB();
        if (!db) throw new Error("Database connection failed");
	
        // Log original parameter types and values
        // const args = [username, hashedPassword, nursingHomeName, nursingHomeAddress, nursingHomePhone, party_responsibility, available_days, timeSlotFrom, timeSlotTo, treatments, selectedTreatments];
        // console.log("Prepared parameters:", args);

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


// Single validation function that works for both hospital and nursing home
async function validatePassword(inputUsername, inputPassword, requestParty) {
    const db = connectToDB();
    if (!db) {
        console.error("Database connection failed during login");
        return false;
    }

    try {
        let retrievedHash = "";

        if (requestParty === "hospital") {
            retrievedHash = db.classMethodValue(
                "Medilink.HospitalAccount",
                "GetHashedPasswordByUsername",
                inputUsername
            );
        } else if (requestParty === "nursinghome") {
            retrievedHash = db.classMethodValue(
                "Medilink.NursingHomeAccount",
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

/*---------------------------------------- GET PATIENT -------------------------------------------- */
function getPatientData( ic) {
    const db = connectToDB();
    if (!db) return null;

    try {
        const result = db.classMethodValue("Medilink.Patient", "GetPatientData",ic);
        const patient = JSON.parse(result);
        if (patient.error) {
            console.error("Patient retrieval error:", patient.error);
            return null;
        }
        return patient;
    } catch (error) {
        console.error("❌ Error fetching patient data:", error);
        return null;
    }
}


/*---------------------------------------- UPDATE PATIENT DATA-------------------------------------------- */

function updatePatientData(patientData) {
    const db = connectToDB();
    if (!db) return false;

    console.log("🛠️ updatePatientData:", {patientData});

    try {
        db.classMethodVoid(
            "Medilink.Patient", 
            "UpdatePatientData",
            // Parameter order MUST match the ClassMethod definition in Patient.cls
            patientData.patientName,    // PatientName
            patientData.patientIc,      // PatientIC
            patientData.staff,          // Staff
            patientData.admissionDate,  // AdmissionDate
            patientData.sex,            // Sex
            patientData.ambulation,     // Ambulation
            patientData.walkingAids,    // WalkingAids
            patientData.cognitiveConditions,  // CognitiveConditions
            patientData.mentalHealthConditions, // MentalHealthConditions
            patientData.documentsNeeded // DocumentsNeeded
        );
        return true;
    } catch (error) {
        console.error("❌ Error updating patient data:", error);
        return false;
    }
}

/*---------------------------------------- UPDATE PATIENT STATUS -------------------------------------------- */
function updatePatientStatus(patientIC, readyToDischarge, comments) {
    return new Promise((resolve, reject) => {
        const db = connectToDB();
        if (!db) {
            console.error("❌ Database connection failed");
            return reject(new Error("Database connection failed"));
        }

        try {
            // Convert inputs to proper types
            const parsedIC = String(patientIC).trim();
            
            // Make sure readyToDischarge is a proper numeric 1 or 0
            const dischargeValue = readyToDischarge ? 1 : 0;
            
            const commentValue = comments ? String(comments).trim() : "N/A";
            
            console.log(`🔄 Updating status for patient ${parsedIC}:`, {
                readyToDischarge: dischargeValue,
                comments: commentValue
            });
            
            // Add try-catch specifically around the database call
            try {
                db.classMethodVoid(
                    "Medilink.Patient", 
                    "UpdatePatientStatus",
                    parsedIC,
                    dischargeValue,
                    commentValue
                );
                
                console.log(`✅ Patient status updated for ${parsedIC}: Discharge = ${dischargeValue}, Comments = "${commentValue}"`);
                
                // After updating, fetch the patient to verify change
                const updatedPatient = db.classMethodValue(
                    "Medilink.Patient",
                    "GetPatientData",
                    parsedIC
                );
                
                console.log(`📊 Updated patient data:`, updatedPatient);
                resolve(true);
            } catch (dbError) {
                console.error(`❌ Database error updating patient ${parsedIC}:`, dbError);
                reject(dbError);
            }
        } catch (error) {
            console.error("❌ Error in updatePatientStatus:", error);
            reject(error);
        } finally {
            // Close the database connection
            if (db && typeof db.close === 'function') {
                db.close();
            }
        }
    });
}

/*------------------------------------- HOSPITAL ----------------------------------------*/

async function GetAllPatients() {
    const db = connectToDB();
    if (!db) return false;
    
    try {
        // Use db instead of iris since db has the classMethodValue method
        const jsonData = db.classMethodValue(
            "Medilink.Patient", 
            "GetAllPatients"
        );
        
        // Log the raw data for debugging
        console.log("Raw JSON data length:", jsonData.length);
        
        // Parse the JSON string returned from IRIS
        const patients = JSON.parse(jsonData);
        
        if (patients.error) {
            console.error("❌ Error in IRIS GetAllPatients method:", patients.error);
            throw new Error(patients.error);
        }
        
        console.log(`✅ Retrieved ${patients.length} patients successfully`);
        return patients;
    } catch (err) {
        console.error("❌ Error getting all patients:", err);
        throw err;
    } finally {
          // Only close if the db object has a close method
          if (db && typeof db.close === 'function') {
            db.close();
        }
    }
}


/*------------------------------------- Vector Search ----------------------------- */
const { generatePatientEmbeddings, searchPatients } = require('./backend/services/vector');

// Global cache for patient embeddings
let patientEmbeddingsCache = [];

// Function to update embeddings cache
async function updatePatientEmbeddingsCache() {
  try {
    const patients = await GetAllPatients();
    if (!patients || patients.length === 0) {
      console.error('❌ No patients found to create embeddings');
      return false;
    }
    patientEmbeddingsCache = await generatePatientEmbeddings(patients);
    console.log(`✅ Updated embeddings cache for ${patients.length} patients`);
    return true;
  } catch (error) {
    console.error('❌ Error updating embeddings cache:', error);
    return false;
  }
}

// Function to perform vector search on patients
async function vectorSearchPatients(query, limit = 10) {
  try {
    // Check if embeddings cache needs to be initialized
    if (patientEmbeddingsCache.length === 0) {
      const success = await updatePatientEmbeddingsCache();
      if (!success) {
        return [];
      }
    }
    
    // Search patients based on query
    const results = await searchPatients(query, patientEmbeddingsCache);
    
    // Get full patient data for top results
    const topResults = results.slice(0, limit);
    const patientICs = topResults.map(result => result.patientIC);
    
    // Get complete patient records
    const patientRecords = [];
    for (const ic of patientICs) {
      const patient = await getPatientData(ic);
      if (patient) {
        // Add similarity score to patient record
        const resultItem = topResults.find(r => r.patientIC === ic);
        patient.similarityScore = resultItem.similarity;
        patientRecords.push(patient);
      }
    }
    
    return patientRecords;
  } catch (error) {
    console.error('❌ Error performing vector search:', error);
    return [];
  }
}



/*---------------------------------------- EXPORTS -------------------------------------------- */

module.exports = {
    insertHospitalData,
    insertNursingHomeData,
    validatePassword,
    getHospitalAccounts,
    getNursingHomeAccount,

    insertPatientData,
    getPatientData,
    updatePatientData,
    updatePatientStatus,

    GetAllPatients,
    vectorSearchPatients,
    updatePatientEmbeddingsCache

};