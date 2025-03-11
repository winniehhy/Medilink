// // Update patient_status.js to always fetch fresh data
// document.addEventListener("DOMContentLoaded", function() {
//     // Get patientIC from URL or session
//     const urlParams = new URLSearchParams(window.location.search);
//     let patientIC = urlParams.get('ic');
    
//     if (!patientIC) {
//         // Fallback to session if no IC in URL
//         fetch("http://localhost:4000/api/get-session-patient")
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success && data.patient && data.patient.patientIC) {
//                     patientIC = data.patient.patientIC;
//                     fetchFreshPatientData(patientIC);
//                 } else {
//                     showError("No patient data available");
//                 }
//             })
//             .catch(error => {
//                 showError("Error loading session data: " + error.message);
//             });
//     } else {
//         // If we have the IC directly, fetch the fresh data
//         fetchFreshPatientData(patientIC);
//     }
// });

// function fetchFreshPatientData(patientIC) {
//     console.log(`🔄 Fetching fresh data for patient: ${patientIC}`);
    
//     // Always get latest data from database
//     fetch(`http://localhost:4000/api/get-patient?ic=${encodeURIComponent(patientIC)}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 displayPatientStatus(data.patient);
//             } else {
//                 showError("Patient data not found");
//             }
//         })
//         .catch(error => {
//             showError("Error fetching patient data: " + error.message);
//         });
// }

// function displayPatientStatus(patient) {
//     console.log("📋 Patient data:", patient);
    
//     // Robust check for readyToDischarge
//     const isReadyToDischarge = 
//         patient.readyToDischarge === 1 || 
//         patient.readyToDischarge === "1" || 
//         patient.readyToDischarge === true;
    
//     document.getElementById("poll-result").textContent = isReadyToDischarge ? "Yes" : "No";
//     document.getElementById("poll-result").className = isReadyToDischarge ? "status-ready" : "status-not-ready";
    
//     // Display comments if available
//     const commentsElement = document.getElementById("comments");
//     if (commentsElement) {
//         commentsElement.textContent = patient.comments || "No comments available.";
//     }
// }

// function showError(message) {
//     console.error(`❌ Error: ${message}`);
//     document.getElementById("poll-result").textContent = "Error";
//     document.getElementById("poll-result").className = "status-error";
    
//     const commentsElement = document.getElementById("comments");
//     if (commentsElement) {
//         commentsElement.textContent = message;
//     }
// }

document.addEventListener("DOMContentLoaded", function() {
	fetch("http://localhost:4000/api/get-session-patient", {
		method: "GET",
		credentials: "include" 
	})
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			console.log("✅ Prefilling form with:", data.patient);
			const patient = data.patient;

			// Fixing the boolean comparison
			if (patient.readyToDischarge == 1)
				document.getElementById("poll-result").textContent = "Yes";
			else
			{
				const pollResult = document.getElementById("poll-result");
    			pollResult.textContent = "No";
    			pollResult.style.color = "red";
			}

			// Debug: Log comments
			console.log("📌 Patient comments:", patient.comments);

			const commentsElement = document.getElementById("comments");
			if (commentsElement) {
				commentsElement.textContent = patient.comments || "No comments available.";
				console.log("📌 Patient comments updated:", patient.comments);
			} else 
			{
				console.error("❌ Error: Element #patient-comments not found!");
			}
		} else {
			alert("No patient data found in session.");
		}
	})
	.catch(error => console.error("❌ Error fetching patient data:", error));
});