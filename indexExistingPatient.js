// indexExistingPatients.js
require('./backend/node_modules/dotenv').config();
const { GetAllPatients } = require('./iris');
const vectorService = require('./backend/services/vectorService');

async function indexAllExistingPatients() {
  try {
    console.log("📊 Fetching all patients from database");
    const patients = await GetAllPatients();
    
    console.log(`Found ${patients.length} patients to index`);
    
    // Process patients in batches to avoid rate limits
    const batchSize = 5;
    
    for (let i = 0; i < patients.length; i += batchSize) {
      const batch = patients.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1} (${batch.length} patients)`);
      
      await Promise.all(batch.map(async (patient) => {
        console.log(`Indexing patient: ${patient.patientName} (${patient.patientIc})`);
        await vectorService.indexPatient(patient);
      }));
      
      // Add delay between batches to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log("✅ All patients have been indexed");
  } catch (error) {
    console.error("Error indexing patients:", error);
  }
}

// Run the indexing function
indexAllExistingPatients();