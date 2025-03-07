const { CohereClient } = require('cohere-ai');

// Initialize with your API key
const cohere = new CohereClient({
  token: ''
});

// Function to generate embeddings for patient data
async function generatePatientEmbeddings(patients) {
  // Extract relevant text from each patient to create embeddings
  const patientTexts = patients.map(patient => {
    return `Patient name: ${patient.patientName || ''}. 
            Patient ID: ${patient.patientID || ''}. 
            Ambulation: ${patient.ambulation || ''}. 
            Walking aids: ${patient.walkingAids || ''}. 
            Cognitive conditions: ${patient.cognitiveConditions || ''}. 
            Mental health conditions: ${patient.mentalHealthConditions || ''}.
            Documents needed: ${patient.documentsNeeded || ''}.`;
  });

  try {
    console.log(`Generating embeddings for ${patientTexts.length} patients`);
    
    // Generate embeddings with Cohere API
    const response = await cohere.embed({
      texts: patientTexts,
      model: 'embed-english-v3.0',
      inputType: 'search_document'
    });
    
    // Debug the response structure
    console.log("Cohere response keys:", Object.keys(response));
    
    // Return embeddings with patient IDs - FIXED: embeddings are directly in response.embeddings
    return patients.map((patient, i) => ({
      patientID: patient.patientID,
      patientIC: patient.patientIC, 
      embedding: response.embeddings[i]  // FIXED: removed .body
    }));
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

// Function to search patients with vector similarity
async function searchPatients(query, patientEmbeddings) {
  try {
    console.log(`Searching for "${query}" in ${patientEmbeddings.length} patient embeddings`);
    
    // Generate embedding for the search query
    const queryResponse = await cohere.embed({
      texts: [query],
      model: 'embed-english-v3.0',
      inputType: 'search_query'
    });
    
    // FIXED: removed .body
    const queryEmbedding = queryResponse.embeddings[0];
    
    // Calculate cosine similarity between query and all patient embeddings
    const searchResults = patientEmbeddings.map(patient => {
      const similarity = cosineSimilarity(queryEmbedding, patient.embedding);
      return {
        patientID: patient.patientID,
        patientIC: patient.patientIC,
        similarity
      };
    });
    
    // Sort by similarity (highest first)
    return searchResults.sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error('Error during search:', error);
    throw error;
  }
}

// Utility function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}

module.exports = {
  generatePatientEmbeddings,
  searchPatients
};