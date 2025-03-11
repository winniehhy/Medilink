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

// document.getElementById("submit").addEventListener("click", function() {

// 	const patientData = {
// 		staff: document.getElementById("staff").value,
// 		admissionDate: document.getElementById("admission-date").value,
// 		patientName: document.getElementById("patient-name").value,
// 		patientIc: document.getElementById("patient-ic").value,
// 		sex: document.querySelector('input[name="sex"]:checked').value
// 	};

// 	console.log("📤 Sending patient data:", patientData);
// 	fetch("http://localhost:4000/api/save-patient", {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify(patientData)
// 	})
// 	.then(response => response.json())
// 	.then(data => {
// 		alert(data.message);
// 		// if (data.message.includes("success")) {
// 		// 	console.log("✅ Navigating to next page...");
// 		// 	window.location.href = "physical_capability"; // ✅ Correct absolute path
// 		// }
// 	})
// 	.catch(error => console.error("❌ Error:", error));
// });

// --------------------------------------------------Physical Capability Tab---------------------------------------------------
// document.getElementById("submitPhysical").addEventListener("click", function(e) {
// 	e.preventDefault(); // Stop any default button behavior
  
// 	// Only collect ambulation and walkingAids
// 	const physicalData = {
// 	  ambulation: document.querySelector('input[name="ambulation"]:checked')?.value || "",
// 	  walkingAids: document.getElementById("walking-aids").value
// 	};
  
// 	console.log("📤 Sending physical capability data:", physicalData);
  
// 	// POST to your Node backend
// 	fetch("http://localhost:4000/api/save-physical-capability", {
// 	  method: "POST",
// 	  headers: { "Content-Type": "application/json" },
// 	  body: JSON.stringify(physicalData)
// 	})
// 	  .then(response => response.json())
// 	  .then(data => {
// 		alert(data.message);
// 		// if (data.message.includes("success")) {
// 		//   // Go to the next page
// 		//   window.location.href = "";
// 		// }
// 	  })
// 	  .catch(error => console.error("❌ Error:", error));
//   });

// -----------------------------------------------Cognitive and Mental Health Tab---------------------------------------------
function addCondition(groupId, inputId) {
	const conditionInput = document.getElementById(inputId);
	const conditionValue = conditionInput.value.trim();

	if (conditionValue) {
		// Create a new checkbox with the input value
		const newCheckbox = document.createElement("label");
		newCheckbox.innerHTML = `<input type="checkbox" name="${groupId}" value="${conditionValue}" checked> ${conditionValue}`;
		// Append to the correct group
		document.getElementById(groupId).appendChild(newCheckbox);

		// Clear the input field after adding
		conditionInput.value = "";
	} else {
		alert("Please enter a valid condition.");
	}
};

// document.getElementById("submit").addEventListener("click", function(e) {
//     e.preventDefault(); // Stop any default button behavior

//     // Collect cognitive and mental health conditions
//     const cognitiveData = {
//         cognitiveConditions: Array.from(document.querySelectorAll('input[name="cognitive-condition"]:checked')).map(checkbox => checkbox.value),
//         mentalHealthConditions: Array.from(document.querySelectorAll('input[name="mental-health-condition"]:checked')).map(checkbox => checkbox.value)
//     };

//     console.log("📤 Sending cognitive and mental health data:", cognitiveData);

//     // POST to your Node backend
//     fetch("http://localhost:4000/api/save-cognitive-mental-health", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(cognitiveData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert(data.message);
//         // if (data.message.includes("success")) {
//         //     // Go to the next page
//         //     window.location.href = "./Pages/Nursing/documents_needed.html";
//         // }
//     })
//     .catch(error => console.error("❌ Error:", error));
// });

// -----------------------------------------------Document Needed Tab---------------------------------------------------
function addDocuments() {
	const documentInput = document.getElementById("new-document");
	const documentValue = documentInput.value.trim(); // Use documentValue instead of conditionValue

	if (documentValue) {
		// Create a new checkbox with the input value
		const newCheckbox = document.createElement("label");
		// Checked the checkbox by default
		newCheckbox.innerHTML = `<input type="checkbox" name="document-needed" value="${documentValue}" checked> ${documentValue}`;
		// Append the new checkbox to the document list
		document.getElementById("document-list").appendChild(newCheckbox);

		// Clear the input field after adding
		documentInput.value = "";
	} else {
		alert("Please enter a valid document name.");
	}
};

//-----------------------------------------------------------Tab Navigation---------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    let currentTab = 0; // Default tab index

    function showTab(index) {
        const tabs = document.querySelectorAll(".tab");
        const sections = document.querySelectorAll(".section-progress-fill");
    
        // Hide all tabs and reset section colors
        tabs.forEach((tab, i) => {
            tab.style.display = i === index ? "block" : "none";
        });
    
        // Update section colors
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add("active-section"); // Brighter green for active section
            } else {
                section.classList.remove("active-section"); // Light green for other sections
            }
        });
    
        currentTab = index;
        console.log("Switched to tab:", currentTab);
    }
    
    showTab(currentTab); // Show the default tab

    function saveData() {
        const patientData = {
            staff: document.getElementById("staff")?.value || "",
            admissionDate: document.getElementById("admission-date")?.value || "",
            patientName: document.getElementById("patient-name")?.value || "",
            patientIc: document.getElementById("patient-ic")?.value || "",
            sex: document.querySelector('input[name="sex"]:checked')?.value || ""
        };
    
        const physicalData = {
            ambulation: document.querySelector('input[name="ambulation"]:checked')?.value || "",
            walkingAids: document.getElementById("walking-aids")?.value || ""
        };
    
        // const cognitiveData = {
        //     cognitiveConditions: Array.from(document.querySelectorAll('input[name="cognitive"]:checked')).map(c => c.value),
        //     mentalHealthConditions: Array.from(document.querySelectorAll('input[name="mental_health"]:checked')).map(m => m.value)
        // };
    
        // const documentData = {
        //     documentsNeeded: [...document.querySelectorAll('input[name="document-needed"]:checked')]
        //         .map(d => d.value)
        // };
    
        const cognitiveData = {
            cognitiveConditions: Array.from(document.querySelectorAll('#cognitive-conditions input[type="checkbox"]:checked')).map(c => c.value),
            mentalHealthConditions: Array.from(document.querySelectorAll('#mental_health_conditions input[type="checkbox"]:checked')).map(m => m.value)
        };
    
        const documentData = {
            documentsNeeded: Array.from(document.querySelectorAll('#document-list input[type="checkbox"]:checked')).map(d => d.value)
        };
    
        console.log("📤 Saving Data:", { patientData, physicalData, cognitiveData, documentData });
    
        return { patientData, physicalData, cognitiveData, documentData };
    }
    
    document.addEventListener("DOMContentLoaded", function () {
        const submitButton = document.getElementById("submit-button");
    
        if (!submitButton) {
            console.error("❌ Submit button not found!");
            return;
        }
    
        submitButton.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("✅ Submit button clicked");  // Debugging log
    
            // Collect all form data
            const data = saveData();
            console.log("📤 Data to send:", data);  // Debugging log
    
            fetch("http://localhost:4000/api/save-patient", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(responseData => {
                console.log("✅ Response received:", responseData); // Debugging log
                alert(responseData.message);
    
                if (responseData.message.includes("success")) {
                    window.location.href = "nursing_homepage";
                }
            })
            .catch(error => console.error("❌ Error in fetch:", error));
        });
    });

    function nextTab() {
        const tabs = document.querySelectorAll(".tab");
        if (currentTab < tabs.length - 1) {
            saveData(); // Save before switching
            currentTab++;
            showTab(currentTab);
        }
        else {
            console.log("🚫 Already at last tab, cannot go forward");
        }
    }

    function prevTab() {
        if (currentTab > 0) {
            saveData(); // Save before switching
            currentTab--;
            showTab(currentTab);
        }
        else {
            console.log("🚫 Already at first tab, cannot go back");
        }
    }

    console.log("✅ JavaScript Loaded"); // Debugging log

    // Attach event listeners to Next and Previous buttons
    document.querySelectorAll(".next-button").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("➡️ Next button clicked");
            nextTab();
        });
    });

    document.querySelectorAll(".prev-button").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("⬅️ Previous button clicked");
            prevTab();
        });
    });

    // Section navigation links
    document.querySelectorAll(".section-link").forEach((link, index) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            saveData(); // Save before switching
            showTab(index);
        });
    });

    const submitButton = document.getElementById("submit-button");

    if (!submitButton) {
        console.error("❌ Submit button not found! Check your HTML.");
    }
    else {
        console.log("✅ Submit button detected!");
    }

    submitButton.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("✅ Submit button clicked");  // Debugging log

        // Collect all form data
        const data = saveData();
        console.log("📤 Data to send:", data);  // Debugging log

        fetch("http://localhost:4000/api/save-patient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {
            console.log("✅ Server Response:", responseData); // Debugging log
            alert(responseData.message);

            if (responseData.message.includes("success")) {
                window.location.href = "nursing_homepage";
            }
        })
        .catch(error => console.error("❌ Fetch Error:", error));
    });
});
