// Function to load all patients when page loads
function loadPatients() {
  fetch('http://localhost:4000/api/patients')
    .then(response => response.json())
    .then(data => {
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
  console.log("Patients to display:", patients);
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
      <p><strong>IC:</strong> ${patient.patientIC || patient.patientIc || "N/A"}</p>
      <p><strong>Staff:</strong> ${patient.staff || "N/A"}</p>
      <p><strong>Admission Date:</strong> ${patient.admissionDate || "N/A"}</p>
      <p><strong>Sex:</strong> ${patient.sex || "N/A"}</p>
      <p><strong>Ambulation:</strong> ${patient.ambulation || "N/A"}</p>
      <p><strong>Walking Aids:</strong> ${patient.walkingAids || "N/A"}</p>
      <p><strong>Cognitive Conditions:</strong> ${patient.cognitiveConditions || "N/A"}</p>
      <p><strong>Mental Health Condition:</strong> ${patient.mentalHealthConditions || "N/A"}</p>
      <p><strong>Document Needed:</strong> ${patient.documentsNeeded|| "N/A"}</p>
      <button class="patient-button" 
        style="${patient.readyToDischarge ? 'background-color: green; color: white;' : ''}"
        data-id="${patient.patientIC}" 
        data-status="${patient.readyToDischarge ? 'true' : 'false'}">
        ${patient.readyToDischarge ? "Marked for Discharge" : "Ready to Discharge"}
      </button>
    `;
    
    // Add event listener to the button
    const button = card.querySelector('.patient-button');
    button.addEventListener('click', function() {
      const patientIC = this.dataset.id;
      const currentStatus = this.dataset.status === 'true';

      //debug
     // Log all the patient data when the button is clicked
    console.log('🏥 Ready to Discharge button clicked');
    console.log('=== PATIENT DATA ===');
    console.log('Patient ID:', patient.patientID);
    console.log('Patient IC:', patient.patientIC);
    console.log('Patient Name:', patient.patientName);
    console.log('Staff:', patient.staff);
    console.log('Admission Date:', patient.admissionDate);
    console.log('Sex:', patient.sex);
    console.log('Ambulation:', patient.ambulation);
    console.log('Walking Aids:', patient.walkingAids);
    console.log('Cognitive Conditions:', patient.cognitiveConditions);
    console.log('Mental Health Conditions:', patient.mentalHealthConditions);
    console.log('Documents Needed:', patient.documentsNeeded);
    console.log('Current Discharge Status:', currentStatus ? 'Ready for discharge' : 'Not ready for discharge');
    console.log('==================');
  
     // Show confirmation with patient details
    const confirmMessage = `Update discharge status for patient:\n\nName: ${patient.patientName}\nIC: ${patient.patientIC || patient.patientIc}`;
  
    if (confirm(confirmMessage)) {
    // If confirmed, proceed to the update page
      window.location.href = `../hospital_update_patient?ic=${encodeURIComponent(patient.patientIC)}&name=${encodeURIComponent(patient.patientName)}&status=${currentStatus}`;
    }

    });
    
    grid.appendChild(card);
  });
}

/*------- vector-------------- */
function performVectorSearch() {
  const searchValue = document.getElementById("searchInput").value.trim();
  
  if (!searchValue) {
    // If search is empty, reload all patients
    loadPatients();
    return;
  }
  
  // Show loading indicator
  document.getElementById("patientList").innerHTML = 
    "<div class='loading'>Searching for similar patients...</div>";
  
  // Use the vector search endpoint
  fetch(`http://localhost:4000/api/vector-search?query=${encodeURIComponent(searchValue)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (data.data && data.data.length > 0) {
          // Display the semantic search results
          displayPatients(data.data);
          
          // Add a header to indicate these are semantic search results
          const searchHeader = document.createElement("div");
          searchHeader.className = "search-results-header";
          searchHeader.innerHTML = `<h3>Semantic search results for: "${searchValue}"</h3>`;
          document.getElementById("patientList").prepend(searchHeader);
        } else {
          document.getElementById("patientList").innerHTML = 
            "<div class='no-results'>No similar patients found. Try a different search term.</div>";
        }
      } else {
        document.getElementById("patientList").innerHTML = 
          `<div class="error-message">${data.error || "Search failed"}</div>`;
      }
    })
    .catch(error => {
      console.error("Error during vector search:", error);
      document.getElementById("patientList").innerHTML = 
        `<div class="error-message">Search error: ${error.message || "Unknown error"}</div>`;
    });
}


// Function to search for a patient using IC
function searchPatient() {
  const searchValue = document.getElementById("searchInput").value.trim();
  console.log("Search value:", searchValue);
  if (!searchValue) {
    console.log("Empty search, loading all patients");
    // If search is empty, reload all patients
    loadPatients();
    return;
  }
  
  // Check if it looks like an IC number (simple heuristic)
  const isIC = /^\d{5,12}$/.test(searchValue) || // All digits
              /^[A-Z]\d{6,7}[A-Z]$/.test(searchValue);// Format like S1234567Z
  console.log("Is IC number?", isIC);
  
  if (isIC) {
    console.log("Doing IC search");
    // Use traditional search for IC numbers
    // Show loading indicator
    document.getElementById("patientList").innerHTML = 
      "<div class='loading'>Searching...</div>";
    
    // Fetch patient data from backend
    fetch(`http://localhost:4000/api/get-patient?ic=${encodeURIComponent(searchValue)}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("Search result patient:", data.patient);

          // Check both possible property names
          console.log("Patient IC (uppercase):", data.patient.patientIC);
          console.log("Patient IC (lowercase):", data.patient.patientIc);
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
  } else {
    // Use semantic search for non-IC queries like "walking-stick"
    console.log("Doing vector search for:", searchValue);
    performVectorSearch();
  }
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
      comments: "N/A"
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









// Add event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add event listener for search button
  document.getElementById("searchButton").addEventListener("click", searchPatient);
  
  // Add event listener for search input (press Enter)
  document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      searchPatient();
    }
  });
  
  // Load initial patient data
  loadPatients();
});