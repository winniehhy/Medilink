document.querySelector("form").addEventListener("submit", function(event) {
	event.preventDefault();

	const patientData = {
		staff: document.getElementById("staff").value,
		patientId: document.getElementById("patient-id").value,
		admissionDate: document.getElementById("admission-date").value,
		patientName: document.getElementById("patient-name").value,
		patientIc: document.getElementById("patient-ic").value,
		sex: document.querySelector('input[name="sex"]:checked').value
	};

	fetch("http://localhost:4000/api/save-patient", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(patientData)
	})
	.then(response => response.json())
	.then(data => alert(data.message))
	.catch(error => console.error("❌ Error:", error));
});