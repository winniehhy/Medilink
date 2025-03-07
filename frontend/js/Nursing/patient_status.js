// Update patient_status.js to always fetch fresh data
document.addEventListener("DOMContentLoaded", function() {
    // Get patientIC from URL or session
    const urlParams = new URLSearchParams(window.location.search);
    let patientIC = urlParams.get('ic');
    
    if (!patientIC) {
        // Fallback to session if no IC in URL
        fetch("http://localhost:4000/api/get-session-patient")
            .then(response => response.json())
            .then(data => {
                if (data.success && data.patient && data.patient.patientIC) {
                    patientIC = data.patient.patientIC;
                    fetchFreshPatientData(patientIC);
                } else {
                    showError("No patient data available");
                }
            })
            .catch(error => {
                showError("Error loading session data: " + error.message);
            });
    } else {
        // If we have the IC directly, fetch the fresh data
        fetchFreshPatientData(patientIC);
    }
});

function fetchFreshPatientData(patientIC) {
    console.log(`🔄 Fetching fresh data for patient: ${patientIC}`);
    
    // Always get latest data from database
    fetch(`http://localhost:4000/api/get-patient?ic=${encodeURIComponent(patientIC)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayPatientStatus(data.patient);
            } else {
                showError("Patient data not found");
            }
        })
        .catch(error => {
            showError("Error fetching patient data: " + error.message);
        });
}

function displayPatientStatus(patient) {
    console.log("📋 Patient data:", patient);
    
    // Robust check for readyToDischarge
    const isReadyToDischarge = 
        patient.readyToDischarge === 1 || 
        patient.readyToDischarge === "1" || 
        patient.readyToDischarge === true;
    
    document.getElementById("poll-result").textContent = isReadyToDischarge ? "Yes" : "No";
    document.getElementById("poll-result").className = isReadyToDischarge ? "status-ready" : "status-not-ready";
    
    // Display comments if available
    const commentsElement = document.getElementById("comments");
    if (commentsElement) {
        commentsElement.textContent = patient.comments || "No comments available.";
    }
}

function showError(message) {
    console.error(`❌ Error: ${message}`);
    document.getElementById("poll-result").textContent = "Error";
    document.getElementById("poll-result").className = "status-error";
    
    const commentsElement = document.getElementById("comments");
    if (commentsElement) {
        commentsElement.textContent = message;
    }
}