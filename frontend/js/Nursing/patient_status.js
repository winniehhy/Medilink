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

			if (patient.readyToDischarge == 1)
				document.getElementById("poll-result").textContent = "Yes";
			else
			{
				const pollResult = document.getElementById("poll-result");
				pollResult.textContent = "No";
				pollResult.style.color = "red";
			}

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