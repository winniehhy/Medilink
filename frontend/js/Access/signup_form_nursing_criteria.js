function goBack() {
	window.history.back();
}
function selectOption(selected) {
	// Remove 'selected' class from all options
	document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
	
	// Add 'selected' class to the clicked option
	selected.classList.add('selected');
}
function toggleOthersCheckbox() {
	var othersCheckbox = document.getElementById("others");
	var othersInput = document.getElementById("other_treatments");

	if (othersInput.value.trim() !== "") {
		othersCheckbox.checked = true;
	} else {
		othersCheckbox.checked = false;
	}
}
function toggleCheckboxes() {
	var someSelected = document.getElementById("some").checked;
	var checkboxesDiv = document.getElementById("checkbox-options");

	if (someSelected) {
		checkboxesDiv.style.display = "block";
	} else {
		checkboxesDiv.style.display = "none";
	}
}

document.addEventListener("DOMContentLoaded", function () {
function collectFormData() {
	let formData = {};
	let isValid = true;
	let errorMessage = "";

	// 1. Extract selected radio button for ambulance transport responsibility
	const party = document.querySelector('input[name="party"]:checked');
	if (!party) {
		isValid = false;
		errorMessage += "Please select who is responsible for ambulance transport.\n";
	}
	formData.party_responsibility = party ? party.value : null;

	// 2. Extract selected checkboxes for available days
	const selectedDays = [];
	document.querySelectorAll('input[name="days"]:checked').forEach(checkbox => {
		selectedDays.push(checkbox.value);
	});
	if (selectedDays.length === 0) {
		isValid = false;
		errorMessage += "Please select at least one available day.\n";
	}
	formData.available_days = selectedDays;

	// 3. Extract selected time slots
	const timeStart = document.getElementById("time_start").value;
	const timeEnd = document.getElementById("time_end").value;
	if (!timeStart || !timeEnd) {
		isValid = false;
		errorMessage += "Please select a time slot.\n";
	}
	formData.time_slot = { from: timeStart, to: timeEnd };

	// 4. Extract treatment acceptance response
	const treatmentSelection = document.querySelector('input[name="treatments"]:checked');
	if (!treatmentSelection) {
		isValid = false;
		errorMessage += "Please select a treatment acceptance response.\n";
	}
	formData.treatments = treatmentSelection ? treatmentSelection.value : null;

	// 5. Extract specific treatment checkboxes if "Some" treatments are accepted
	if (formData.treatments === "Some") {
		let selectedTreatments = [];
		document.querySelectorAll('#checkbox-options input[type="checkbox"]:checked').forEach(checkbox => {
			selectedTreatments.push(checkbox.value);
		});

		// Check if "Others" has input
		const otherTreatmentText = document.getElementById("other_treatments").value.trim();
		if (otherTreatmentText) {
			selectedTreatments.push(`Others: ${otherTreatmentText}`);
		}

		if (selectedTreatments.length === 0) {
			isValid = false;
			errorMessage += "Please select at least one specific treatment.\n";
		}

		formData.selected_treatments = selectedTreatments;
	}

	if (!isValid) {
		alert(errorMessage);
		return null; // Prevent form submission
	}

	return formData;
}

document.getElementById("submitButton").addEventListener("click", async (event) => {
	event.preventDefault(); // Prevent default form submission
	const formData = collectFormData(); // Collect form data

	if (!formData) return; // Stop if validation failed

	try {
		const response = await fetch("/api/nursinghome-signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData)
		});

		console.log("Response Status:", response.status); // Log HTTP status

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json(); // Read the response body as JSON
		console.log("Server Response:", data); // Log response data

		window.location.href = "/logIn";
	} catch (error) {
		console.error("Error submitting form:", error);
	}
});
});