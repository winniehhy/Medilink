function prevPage() {
	window.history.back();
}

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
				document.getElementById("poll-result").textContent = "No";

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

