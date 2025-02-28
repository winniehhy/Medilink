// Sample patient data for testing n will be fetching data from the db
const patients = [
	{ name: "John Doe", ic: "A1234567", nursingHome: "Sunway", admissionDate: "2024-02-20" },
	{ name: "Jane Smith", ic: "B7654321", nursingHome: "Maple", admissionDate: "2024-02-15" },
	{ name: "Alice Tan", ic: "C9876543", nursingHome: "Oakwood", admissionDate: "2024-01-10" },
	{ name: "Michelle Tan", ic: "C1236543", nursingHome: "Mickey", admissionDate: "2025-01-10" },
	{ name: "John Doe", ic: "A1234567", nursingHome: "Sunway", admissionDate: "2024-02-20" },
	{ name: "Jane Smith", ic: "B7654321", nursingHome: "Maple", admissionDate: "2024-02-15" },
	{ name: "Alice Tan", ic: "C9876543", nursingHome: "Oakwood", admissionDate: "2024-01-10" },
	{ name: "Michelle Tan", ic: "C1236543", nursingHome: "Mickey", admissionDate: "2025-01-10" },
	{ name: "John Doe", ic: "A1234567", nursingHome: "Sunway", admissionDate: "2024-02-20" },
	{ name: "Jane Smith", ic: "B7654321", nursingHome: "Maple", admissionDate: "2024-02-15" },
	{ name: "Alice Tan", ic: "C9876543", nursingHome: "Oakwood", admissionDate: "2024-01-10" },
	{ name: "Michelle Tan", ic: "C1236543", nursingHome: "Mickey", admissionDate: "2025-01-10" },
	{ name: "John Doe", ic: "A1234567", nursingHome: "Sunway", admissionDate: "2024-02-20" },
	{ name: "Jane Smith", ic: "B7654321", nursingHome: "Maple", admissionDate: "2024-02-15" },
	{ name: "Alice Tan", ic: "C9876543", nursingHome: "Oakwood", admissionDate: "2024-01-10" }
];

function displayPatients(patients) {
	const grid = document.getElementById("patientList");
	grid.innerHTML = "";

	patients.forEach(patient => {
		const card = document.createElement("div");
		card.className = "patient-card";
		card.innerHTML = `
			<p><strong>Name:</strong> ${patient.name}</p>
			<p><strong>IC:</strong> ${patient.ic}</p>
			<p><strong>Nursing Home:</strong> ${patient.nursingHome}</p>
			<p><strong>Admission Date:</strong> ${patient.admissionDate}</p>
			<button class="patient-button">Ready to Discharge</button>
		`;
		grid.appendChild(card);
	});
}

function searchPatient() {
	const searchValue = document.getElementById("searchInput").value;
	const filteredPatients = patients.filter(patient => 
		patient.ic.includes(searchValue)
	);
	displayPatients(filteredPatients);
}

displayPatients(patients);