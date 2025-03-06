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
      <p><strong>IC:</strong> ${patient.patientIC || "N/A"}</p>
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