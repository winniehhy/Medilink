// Function to load all patients when page loads
function loadPatients() {
  fetch('http://localhost:4000/api/patients')
    .then(response => response.json())
    .then(data => {

      //debug
      console.log("API Response:", data);
      console.log("First patient sample:", data.data ? data.data[0] : null);

      if (data.success) {
        displayPatients(data.data);
      } else {
        document.getElementById("patientList").innerHTML = 
          `<div class="error-message">${data.error || "Failed to load patients"}</div>`;
      }
    })
    .catch(error => {
      console.error("Error loading patients:", error);
      document.getElementById("patientList").innerHTML = 
        `<div class="error-message">Error loading patients: ${error.message}</div>`;
    });
}

// Function to display patients in the grid
function displayPatients(patients) {
  const grid = document.getElementById("patientList");
  grid.innerHTML = "";
  
  if (!patients || patients.length === 0) {
    grid.innerHTML = "<div class='no-results'>No patients found</div>";
    return;
  }

  patients.forEach(patient => {
    const card = document.createElement("div");
    card.className = "patient-card";
    
    card.innerHTML = `
      <p><strong>Name:</strong> ${patient.patientName || "N/A"}</p>
      <p><strong>IC:</strong> ${patient.patientIc || "N/A"}</p>
      <p><strong>Staff:</strong> ${patient.staff || "N/A"}</p>
      <p><strong>Admission Date:</strong> ${patient.admissionDate || "N/A"}</p>
      <p><strong>Sex:</strong> ${patient.sex || "N/A"}</p>
      <p><strong>Ambulation:</strong> ${patient.ambulation || "N/A"}</p>
      <p><strong>Walking Aids:</strong> ${patient.walkingAids || "N/A"}</p>
      <p><strong>Cognitive Conditions:</strong> ${patient.cognitiveConditions || "N/A"}</p>
      <p><strong>Mental Health Condition:</strong> ${patient.mentalHealthConditions || "N/A"}</p>
      <p><strong>Document Needed:</strong> ${patient.documentsNeeded|| "N/A"}</p>
      <button class="patient-button" 
        data-id="${patient.patientIc}" 
        data-status="${patient.readyToDischarge ? 'true' : 'false'}">
        ${patient.readyToDischarge ? "Marked for Discharge" : "Ready to Discharge"}
      </button>
    `;
    
    // Add event listener to the button
    const button = card.querySelector('.patient-button');
    button.addEventListener('click', function() {
      markReadyForDischarge(this.dataset.id, this.dataset.status !== 'true');
    });
    
    grid.appendChild(card);
  });
}

// Function to search for a patient using IC
function searchPatient() {
  const searchValue = document.getElementById("searchInput").value.trim();
  
  if (!searchValue) {
    // If search is empty, reload all patients
    loadPatients();
    return;
  }
  
  // Show loading indicator
  document.getElementById("patientList").innerHTML = 
    "<div class='loading'>Searching...</div>";
  
  // Fetch patient data from backend
  fetch(`http://localhost:4000/api/get-patient?ic=${encodeURIComponent(searchValue)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Display the single patient
        displayPatients([data.patient]);
      } else {
        document.getElementById("patientList").innerHTML = 
          "<div class='no-results'>Patient not found. Please check the IC number.</div>";
      }
    })
    .catch(error => {
      console.error("Error searching patient:", error);
      document.getElementById("patientList").innerHTML = 
        `<div class="error-message">Search error: ${error.message || "Unknown error"}</div>`;
    });
}

// Function to mark a patient as ready for discharge
function markReadyForDischarge(patientIc, readyStatus) {
  fetch('http://localhost:4000/api/update-patient-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ic: patientIc,
      readyToDischarge: readyStatus,
      comments: "Marked by hospital staff"
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Reload patients to reflect changes
      loadPatients();
    } else {
      throw new Error(data.error || "Update failed");
    }
  })
  .catch(error => {
    console.error("Error updating patient status:", error);
    alert(`Failed to update patient status: ${error.message}`);
  });
}


function unifiedSearch() {
  const searchValue = document.getElementById("unifiedSearchInput").value.trim();
  
  if (!searchValue) {
    // If search is empty, reload all patients
    loadPatients();
    return;
  }
  
  // Show loading indicator
  document.getElementById("patientList").innerHTML = 
    "<div class='loading'>Searching...</div>";
  
  // Detect if this is likely an IC search or a semantic search
  const isLikelyIC = /^[0-9-]+$/.test(searchValue) || // Only digits and hyphens
                     searchValue.length <= 16;        // Assuming ICs are typically shorter
  
  if (isLikelyIC) {
    // Perform IC-based search
    console.log("Detected IC search:", searchValue);
    
    fetch(`http://localhost:4000/api/get-patient?ic=${encodeURIComponent(searchValue)}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Display the single patient
          displayPatients([data.patient]);
        } else {
          // If not found by IC, fall back to semantic search
          console.log("Patient not found by IC, trying semantic search");
          performSemanticSearch(searchValue);
        }
      })
      .catch(error => {
        console.error("Error searching patient:", error);
        document.getElementById("patientList").innerHTML = 
          `<div class="error-message">Search error: ${error.message || "Unknown error"}</div>`;
      });
  } else {
    // Perform semantic search
    console.log("Detected semantic search:", searchValue);
    performSemanticSearch(searchValue);
  }
}

// Helper function to perform semantic search
function performSemanticSearch(query) {
  fetch(`http://localhost:4000/api/semantic-search?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        displayPatients(data.data);
      } else {
        document.getElementById("patientList").innerHTML = 
          `<div class='error-message'>${data.error || "Search failed"}</div>`;
      }
    })
    .catch(error => {
      console.error("Error with semantic search:", error);
      document.getElementById("patientList").innerHTML = 
        `<div class="error-message">Search error: ${error.message}</div>`;
    });
}



// Add event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add event listener for search button
  document.getElementById("unifiedSearchButton").addEventListener("click", unifiedSearch);
  
  document.getElementById("unifiedSearchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      unifiedSearch();
    }
  });
  
  
  // Load initial patient data
  loadPatients();
});