// --------------------------------------------Basic Information Tab---------------------------------------------------
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

// -----------------------------------------------Cognitive and Mental Health Tab---------------------------------------------
function addCondition(groupId, inputId) {
	const conditionInput = document.getElementById(inputId);
	const conditionValue = conditionInput.value.trim();

	if (conditionValue) {
		const newCheckbox = document.createElement("label");
		newCheckbox.innerHTML = `<input type="checkbox" name="${groupId}" value="${conditionValue}" checked> ${conditionValue}`;
		document.getElementById(groupId).appendChild(newCheckbox);
		conditionInput.value = "";
	} else {
		alert("Please enter a valid condition.");
	}
};

// -----------------------------------------------Document Needed Tab---------------------------------------------------
function addDocuments() {
	const documentInput = document.getElementById("new-document");
	const documentValue = documentInput.value.trim();

	if (documentValue) {
		const newCheckbox = document.createElement("label");
		newCheckbox.innerHTML = `<input type="checkbox" name="document-needed" value="${documentValue}" checked> ${documentValue}`;
		document.getElementById("document-list").appendChild(newCheckbox);
		documentInput.value = "";
	} else {
		alert("Please enter a valid document name.");
	}
};

// -------------------------------------------- Page Load: Prefill Data ---------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript Loaded");
    let currentTab = 0; // Default to first tab
    showTab(currentTab);

    // ------------------ Prefill Data from Session ------------------
    fetch("http://localhost:4000/api/get-session-patient", {
        method: "GET",
        credentials: "include" 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("✅ Prefilling form with:", data.patient);
            const patient = data.patient;

            // Prefill basic information
            document.getElementById("staff").value = patient.staff || "";
            document.getElementById("admission-date").value = patient.admissionDate || "";
            document.getElementById("patient-name").value = patient.patientName || "";
            document.getElementById("patient-ic").value = patient.patientIc || "";

            // Prefill sex
            const sexRadio = document.querySelector(`input[name="sex"][value="${patient.sex}"]`);
            if (sexRadio) sexRadio.checked = true;

            // Prefill ambulation
            const ambulationRadio = document.querySelector(`input[name="ambulation"][value="${patient.ambulation}"]`);
            if (ambulationRadio) ambulationRadio.checked = true;

            // Prefill walking aids
            document.getElementById("walking-aids").value = patient.walkingAids || "";

            // // Prefill cognitive conditions
            // if (patient.cognitiveConditions) {
            //     patient.cognitiveConditions.split(", ").forEach(condition => {
            //         const cognitiveCheckbox = document.querySelector(`input[name="cognitive"][value="${condition}"]`);
            //         if (cognitiveCheckbox) cognitiveCheckbox.checked = true;
            //     });
            // }

            // // Prefill mental health conditions
            // if (patient.mentalHealthConditions) {
            //     patient.mentalHealthConditions.split(", ").forEach(condition => {
            //         const mentalHealthCheckbox = document.querySelector(`input[name="mental_health"][value="${condition}"]`);
            //         if (mentalHealthCheckbox) mentalHealthCheckbox.checked = true;
            //     });
            // }

            // // Prefill documents needed
            // if (patient.documentsNeeded) {
            //     patient.documentsNeeded.split(", ").forEach(condition => {
            //         const documentCheckbox = document.querySelector(`input[name="document-needed"][value="${condition.trim()}"]`);
            //         if (documentCheckbox) documentCheckbox.checked = true;
            //     });
            // }

            // Prefill cognitive conditions
            fillCheckboxes("cognitive", "cognitive-conditions", patient.cognitiveConditions);

            // Prefill mental health conditions
            fillCheckboxes("mental_health", "mental_health_conditions", patient.mentalHealthConditions);

            // Prefill documents needed
            fillCheckboxes("document-needed", "document-list", patient.documentsNeeded);
        } else {
            alert("No patient data found in session.");
        }
    })
    .catch(error => console.error("❌ Error fetching session patient data:", error));

    // ------------------ Tab Navigation ------------------
    function showTab(index) {
        const tabs = document.querySelectorAll(".tab");
        const sections = document.querySelectorAll(".section-progress-fill");
        
        if (index >= tabs.length) return; // Prevent overflow

        tabs.forEach((tab, i) => tab.style.display = i === index ? "block" : "none");
        sections.forEach((section, i) => section.classList.toggle("active-section", i === index));
        currentTab = index;
        console.log("📌 Switched to tab:", currentTab);
    }

    // Next button functionality
    document.querySelectorAll(".next-button").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentTab < document.querySelectorAll(".tab").length - 1) {
                showTab(++currentTab);
            }
        });
    });

    // Previous button functionality
    document.querySelectorAll(".prev-button").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentTab > 0) {
                showTab(--currentTab);
            }
        });
    });

    // Section progress bar navigation
    document.querySelectorAll(".section-link").forEach((link, index) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            showTab(index);
        });
    });

    // ------------------ Update Patient Data ------------------
    document.getElementById("update-button").addEventListener("click", function (e) {
        e.preventDefault();
        
        // Collect all the form data
        const updatedData = {
            staff: document.getElementById("staff").value,
            admissionDate: document.getElementById("admission-date").value,
            patientName: document.getElementById("patient-name").value,
            patientIc: document.getElementById("patient-ic").value,
            sex: document.querySelector('input[name="sex"]:checked')?.value || "",
            ambulation: document.querySelector('input[name="ambulation"]:checked')?.value || "",
            walkingAids: document.getElementById("walking-aids").value,
            cognitiveConditions: getCheckedValues("cognitive"),
            mentalHealthConditions: getCheckedValues("mental_health"),
            documentsNeeded: getCheckedValues("document-needed")
        };
        
        console.log("📤 Sending updated patient data:", updatedData);
        
        // Send the data to the server
        fetch("http://localhost:4000/api/update-patient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(responseData => {
            alert(responseData.message);
            if (responseData.success) {
                window.location.href = "nursing_homepage";
            }
        })
        .catch(error => console.error("❌ Error updating patient:", error));
    });
    // ------------------ Utility Functions ------------------
    /**
     * Function to fill checkboxes, adding new ones if missing.
     * @param {string} inputName - The name attribute of the checkboxes.
     * @param {string} containerId - The ID of the container holding the checkboxes.
     * @param {string} values - The comma-separated string of selected values.
     */
    function fillCheckboxes(inputName, containerId, values) {
        if (!values) return; // Exit if no values

        const container = document.getElementById(containerId);
        const valueArray = values.split(", ").map(v => v.trim());

        valueArray.forEach(value => {
            // Check if the checkbox already exists
            let checkbox = document.querySelector(`input[name="${inputName}"][value="${value}"]`);
            
            if (!checkbox) {
                // Create a new checkbox if it does not exist
                const label = document.createElement("label");
                label.innerHTML = `<input type="checkbox" name="${inputName}" value="${value}" checked> ${value}`;
                container.appendChild(label);
            } else {
                // Check the existing checkbox
                checkbox.checked = true;
            }
        });
    }

    function getCheckedValues(groupName) {
        return Array.from(document.querySelectorAll(`input[name="${groupName}"]:checked`))
            .map(checkbox => checkbox.value)
            .join(", ");
    }
});
