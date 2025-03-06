require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAI } = require('openai');

// Initialize OpenAI for embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone
const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY
  });

  console.log("✅ Pinecone client initialized!");

// Get or create index
let index;
async function initializeIndex() {
	// Check if index exists, create it if not
	const indexName = 'patient-index2';
	
	try {
	  console.log("Checking for existing indexes...");
	  const indexesList = await pinecone.listIndexes();
	  
	  // In the new SDK, this returns an object with an "indexes" array property
	  console.log("Available indexes:", indexesList);
	  
	  // Extract index names from the response
	  const indexNames = indexesList.indexes.map(idx => idx.name);
	  console.log("Index names:", indexNames);
	  
	  if (!indexNames.includes(indexName)) {
		console.log(`Creating new index: ${indexName}`);
		await pinecone.createIndex({
		  name: indexName,
		  dimension: 3072, // OpenAI embedding dimensions
		  metric: 'cosine'
		});
		// Wait for index to be ready
		console.log("Waiting for index to initialize (30 seconds)...");
		await new Promise(resolve => setTimeout(resolve, 30000));
	  } else {
		console.log(`Index "${indexName}" already exists`);
	  }
	  
	  console.log(`Connecting to index: ${indexName}`);
	  index = pinecone.index(indexName);
	  return index;
	} catch (error) {
	  console.error("Error initializing Pinecone index:", error);
	  throw error;
	}
  }

// Create embeddings from patient data
async function createPatientEmbedding(patient) {
  // Create a text representation of the patient
  const patientText = `
    Name: ${patient.patientName || ''}
    IC: ${patient.patientIc || ''}
    Sex: ${patient.sex || ''}
    Ambulation: ${patient.ambulation || ''}
    Walking Aids: ${patient.walkingAids || ''}
    Cognitive Conditions: ${patient.cognitiveConditions || ''}
    Mental Health Conditions: ${patient.mentalHealthConditions || ''}
    Documents Needed: ${patient.documentsNeeded || ''}
  `;

  // Generate embedding with OpenAI
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: patientText,
  });

  return embeddingResponse.data[0].embedding;
}

// Index patient in vector database
async function indexPatient(patient) {
  if (!index) await initializeIndex();
  
  try {
    console.log(`Creating embedding for patient: ${patient.patientName}`);
    const embedding = await createPatientEmbedding(patient);
    
    console.log(`Indexing patient ${patient.patientIc} in Pinecone`);
    await index.upsert({
      vectors: [{
        id: patient.patientIc, 
        values: embedding,
        metadata: {
          patientName: patient.patientName,
          patientIc: patient.patientIc,
          sex: patient.sex,
          ambulation: patient.ambulation
        }
      }]
    });
    
    console.log(`Successfully indexed patient: ${patient.patientName}`);
    return true;
  } catch (error) {
    console.error("Error indexing patient:", error);
    return false;
  }
}

// Search for similar patients
async function searchSimilarPatients(searchText, limit = 10) {
  if (!index) await initializeIndex();
  
  try {
    console.log(`Creating embedding for search: "${searchText}"`);
    // Generate embedding for search text
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: searchText,
    });
    const searchEmbedding = embeddingResponse.data[0].embedding;
    
    // Query vector database
    console.log(`Searching Pinecone for: "${searchText}"`);
    const results = await index.query({
      vector: searchEmbedding,
      topK: limit,
      includeMetadata: true
    });
    
    console.log(`Found ${results.matches.length} matches`);
    
    // Return IDs of matching patients
    return results.matches.map(match => match.metadata.patientIc);
  } catch (error) {
    console.error("Error searching similar patients:", error);
    return [];
  }
}

module.exports = {
  indexPatient,
  searchSimilarPatients,
  initializeIndex
};