// Date of Admission
document.addEventListener("DOMContentLoaded", function () {
	let dateInput = document.getElementById("admission-date");

	// Get today's date
	let today = new Date();
	let day = String(today.getDate()).padStart(2, '0'); // Ensure 2-digit format
	let month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	let year = today.getFullYear();

	// Format: DD/MM/YYYY
	let formattedDate = `${day}/${month}/${year}`;

	// Set the input value
	dateInput.value = formattedDate;

	// Ensure only valid date format is entered
	dateInput.addEventListener("input", function (event) {
		let inputValue = event.target.value;
		let regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

		if (!regex.test(inputValue) && inputValue.length > 0) {
			event.target.style.border = "2px solid red";
		} else {
			event.target.style.border = "";
		}
	});
});

// Next Page Button
// document.querySelector("form").addEventListener("submit", function(event) {
// 	event.preventDefault();

// 	const patientData = {
// 		staff: document.getElementById("staff").value,
// 		patientId: document.getElementById("patient-id").value,
// 		admissionDate: document.getElementById("admission-date").value,
// 		patientName: document.getElementById("patient-name").value,
// 		patientIc: document.getElementById("patient-ic").value,
// 		sex: document.querySelector('input[name="sex"]:checked').value
// 	};

// 	fetch("http://localhost:4000/api/save-patient", {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify(patientData)
// 	})
// 	.then(response => response.json())
// 	.then(data => alert(data.message))
// 	.catch(error => console.error("❌ Error:", error));
// });
document.getElementById("submit").addEventListener("click", function() {

	const patientData = {
		staff: document.getElementById("staff").value,
		admissionDate: document.getElementById("admission-date").value,
		patientName: document.getElementById("patient-name").value,
		patientIc: document.getElementById("patient-ic").value,
		sex: document.querySelector('input[name="sex"]:checked').value
	};

	console.log("📤 Sending patient data:", patientData);
	fetch("http://localhost:4000/api/save-patient", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(patientData)
	})
	.then(response => response.json())
	.then(data => {
		alert(data.message);
		if (data.message.includes("success")) {
			console.log("✅ Navigating to next page...");
			window.location.href = "physical_capability.html"; // ✅ Correct absolute path
		}
	})
	.catch(error => console.error("❌ Error:", error));
});