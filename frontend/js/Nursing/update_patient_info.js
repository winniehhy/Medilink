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

// --------------------------------------------------Physical Capability Tab---------------------------------------------------

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

// document.addEventListener("DOMContentLoaded", function () {
//     console.log("✅ JavaScript Loaded");
//     let currentTab = 0; // Default to first tab
//     showTab(currentTab);

//     // ------------------ Prefill Data from Session ------------------
//     fetch("http://localhost:4000/api/get-session-patient", {
//         method: "GET",
//         credentials: "include" 
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             console.log("✅ Prefilling form with:", data.patient);
//             const patient = data.patient;

//             document.getElementById("staff").value = patient.staff || "";
//             document.getElementById("admission-date").value = patient.admissionDate || "";
//             document.getElementById("patient-name").value = patient.patientName || "";
//             document.getElementById("patient-ic").value = patient.patientIc || "";
//             document.querySelector(`input[name="sex"][value="${patient.sex}"]`)?.checked = true;
//             document.querySelector(`input[name="ambulation"][value="${patient.ambulation}"]`)?.checked = true;
//             document.getElementById("walking-aids").value = patient.walkingAids || "";
//             fillCheckboxes("cognitive", patient.cognitiveConditions);
//             fillCheckboxes("mental_health", patient.mentalHealthConditions);
//             fillCheckboxes("document-needed", patient.documentsNeeded);
//         } else {
//             alert("No patient data found in session.");
//         }
//     })
//     .catch(error => console.error("❌ Error fetching session patient data:", error));

//     // ------------------ Tab Navigation ------------------
//     function showTab(index) {
//         const tabs = document.querySelectorAll(".tab");
//         const sections = document.querySelectorAll(".section-progress-fill");
        
//         if (index >= tabs.length) return; // Prevent overflow

//         tabs.forEach((tab, i) => tab.style.display = i === index ? "block" : "none");
//         sections.forEach((section, i) => section.classList.toggle("active-section", i === index));
//         currentTab = index;
//         console.log("📌 Switched to tab:", currentTab);
//     }

//     document.querySelectorAll(".next-button").forEach((btn) => {
//         btn.addEventListener("click", function (e) {
//             e.preventDefault();
//             if (currentTab < document.querySelectorAll(".tab").length - 1) {
//                 showTab(++currentTab);
//             }
//         });
//     });

//     document.querySelectorAll(".prev-button").forEach((btn) => {
//         btn.addEventListener("click", function (e) {
//             e.preventDefault();
//             if (currentTab > 0) {
//                 showTab(--currentTab);
//             }
//         });
//     });

//     document.querySelectorAll(".section-link").forEach((link, index) => {
//         link.addEventListener("click", function (e) {
//             e.preventDefault();
//             showTab(index);
//         });
//     });

//     // ------------------ Update Patient Data ------------------
//     document.getElementById("update-button").addEventListener("click", function (e) {
//         e.preventDefault();
        
//         const updatedData = {
//             staff: document.getElementById("staff").value,
//             admissionDate: document.getElementById("admission-date").value,
//             patientName: document.getElementById("patient-name").value,
//             patientIc: document.getElementById("patient-ic").value,
//             sex: document.querySelector('input[name="sex"]:checked')?.value || "",
//             ambulation: document.querySelector('input[name="ambulation"]:checked')?.value || "",
//             walkingAids: document.getElementById("walking-aids").value,
//             cognitiveConditions: getCheckedValues("cognitive"),
//             mentalHealthConditions: getCheckedValues("mental_health"),
//             documentsNeeded: getCheckedValues("document-needed")
//         };
        
//         console.log("📤 Sending updated patient data:", updatedData);
        
//         fetch("http://localhost:4000/api/update-patient", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(updatedData)
//         })
//         .then(response => response.json())
//         .then(responseData => {
//             alert(responseData.message);
//             if (responseData.success) {
//                 window.location.href = "nursing_homepage";
//             }
//         })
//         .catch(error => console.error("❌ Error updating patient:", error));
//     });

//     // ------------------ Utility Functions ------------------
//     function fillCheckboxes(groupName, values) {
//         if (values) {
//             values.split(", ").forEach(value => {
//                 const checkbox = document.querySelector(`input[name="${groupName}"][value="${value}"]`);
//                 if (checkbox) checkbox.checked = true;
//             });
//         }
//     }

//     function getCheckedValues(groupName) {
//         return Array.from(document.querySelectorAll(`input[name="${groupName}"]:checked`))
//             .map(checkbox => checkbox.value)
//             .join(", ");
//     }

//     function saveData() {
//         const patientData = {
//             staff: document.getElementById("staff")?.value || "",
//             admissionDate: document.getElementById("admission-date")?.value || "",
//             patientName: document.getElementById("patient-name")?.value || "",
//             patientIc: document.getElementById("patient-ic")?.value || "",
//             sex: document.querySelector('input[name="sex"]:checked')?.value || ""
//         };
    
//         const physicalData = {
//             ambulation: document.querySelector('input[name="ambulation"]:checked')?.value || "",
//             walkingAids: document.getElementById("walking-aids")?.value || ""
//         };
    
//         const cognitiveData = {
//             cognitiveConditions: Array.from(document.querySelectorAll('input[name="cognitive"]:checked')).map(c => c.value),
//             mentalHealthConditions: Array.from(document.querySelectorAll('input[name="mental_health"]:checked')).map(m => m.value)
//         };
    
//         const documentData = {
//             documentsNeeded: [...document.querySelectorAll('input[name="document-needed"]:checked')]
//                 .map(d => d.value)
//         };
    
//         console.log("📤 Saving Data:", { patientData, physicalData, cognitiveData, documentData });
    
//         return { patientData, physicalData, cognitiveData, documentData };
//     }
    
//     // const patientData = JSON.parse(localStorage.getItem("patientData"));
	
//     // if (patientData) {
//     //     document.getElementById("staff").value = patientData.staff || "";
//     //     document.getElementById("admission-date").value = patientData.admissionDate || "";
//     //     document.getElementById("patient-name").value = patientData.patientName || "";
//     //     document.getElementById("patient-ic").value = patientData.patientIc || "";
//     //     document.querySelector(`input[name="sex"][value="${patientData.sex}"]`)?.checked = true;
//     // }

//     // document.getElementById("update-button").addEventListener("click", function (e) {
//     //     e.preventDefault();

//     //     const updatedData = {
//     //         staff: document.getElementById("staff").value,
//     //         admissionDate: document.getElementById("admission-date").value,
//     //         patientName: document.getElementById("patient-name").value,
//     //         patientIc: document.getElementById("patient-ic").value,
//     //         sex: document.querySelector('input[name="sex"]:checked')?.value || ""
//     //     };

//     //     fetch("http://localhost:4000/api/update-patient", {
//     //         method: "POST",
//     //         headers: { "Content-Type": "application/json" },
//     //         body: JSON.stringify(updatedData)
//     //     })
//     //     .then(response => response.json())
//     //     .then(responseData => {
//     //         alert(responseData.message);
//     //         if (responseData.success) {
//     //             window.location.href = "nursing_homepage";
//     //         }
//     //     })
//     //     .catch(error => console.error("❌ Error updating patient:", error));
//     // });

//     // function nextTab() {
//     //     const tabs = document.querySelectorAll(".tab");
//     //     if (currentTab < tabs.length - 1) {
//     //         saveData(); 
//     //         currentTab++; // ✅ Correct syntax
//     //         showTab(currentTab);
//     //     } else {
//     //         console.log("🚫 Already at last tab, cannot go forward");
//     //     }
//     // }
    
//     // function prevTab() {
//     //     if (currentTab > 0) {
//     //         saveData();
//     //         currentTab--; // ✅ Correct syntax
//     //         showTab(currentTab);
//     //     } else {
//     //         console.log("🚫 Already at first tab, cannot go back");
//     //     }
//     // }

//     // console.log("✅ JavaScript Loaded"); // Debugging log

//     // // Attach event listeners to Next and Previous buttons
//     // document.querySelectorAll(".next-button").forEach((btn) => {
//     //     btn.addEventListener("click", function (e) {
//     //         e.preventDefault();
//     //         console.log("➡️ Next button clicked");
//     //         nextTab();
//     //     });
//     // });
    
//     // document.querySelectorAll(".prev-button").forEach((btn) => {
//     //     btn.addEventListener("click", function (e) {
//     //         e.preventDefault();
//     //         console.log("⬅️ Previous button clicked");
//     //         prevTab();
//     //     });
//     // });

//     // // Section navigation links
//     // document.querySelectorAll(".section-link").forEach((link, index) => {
//     //     link.addEventListener("click", function (e) {
//     //         e.preventDefault();
//     //         saveData(); // Save before switching
//     //         showTab(index);
//     //     });
//     // });

//     // const submitButton = document.getElementById("submit-button");

//     // if (!submitButton) {
//     //     console.error("❌ Submit button not found! Check your HTML.");
//     // }
//     // else {
//     //     console.log("✅ Submit button detected!");
//     // }

//     // submitButton.addEventListener("click", function (e) {
//     //     e.preventDefault();
//     //     console.log("✅ Submit button clicked");  // Debugging log

//     //     // Collect all form data
//     //     const data = saveData();
//     //     console.log("📤 Data to send:", data);  // Debugging log

        
//     // // Fetch patient data from session
//     // fetch("http://localhost:4000/api/get-session-patient", {
//     //     method: "GET",
//     //     credentials: "include" // Ensures browser sends cookies
//     // })
//     // .then(response => response.json())
//     // .then(data => {
//     //     if (data.success) {
//     //         console.log("✅ Session data received:", data.patient);
//     //         const patient = data.patient;

//     //         document.getElementById("staff").value = patient.staff || "";
//     //         document.getElementById("admission-date").value = patient.admissionDate || "";
//     //         document.getElementById("patient-name").value = patient.patientName || "";
//     //         document.getElementById("patient-ic").value = patient.patientIc || "";
//     //         document.querySelector(`input[name="sex"][value="${patient.sex}"]`)?.checked = true;

//     //         document.querySelector(`input[name="ambulation"][value="${patient.ambulation}"]`)?.checked = true;
//     //         document.getElementById("walking-aids").value = patient.walkingAids || "";

//     //         fillCheckboxes("cognitive", patient.cognitiveConditions);
//     //         fillCheckboxes("mental_health", patient.mentalHealthConditions);
//     //         fillCheckboxes("document-needed", patient.documentsNeeded);
//     //     } else {
//     //         alert("No patient data found in session.");
//     //     }
//     // })
//     // .catch(error => console.error("❌ Error fetching session patient data:", error));
//     // });
// });

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

            // Prefill cognitive conditions
            if (patient.cognitiveConditions) {
                patient.cognitiveConditions.split(", ").forEach(condition => {
                    const cognitiveCheckbox = document.querySelector(`input[name="cognitive"][value="${condition}"]`);
                    if (cognitiveCheckbox) cognitiveCheckbox.checked = true;
                });
            }

            // Prefill mental health conditions
            if (patient.mentalHealthConditions) {
                patient.mentalHealthConditions.split(", ").forEach(condition => {
                    const mentalHealthCheckbox = document.querySelector(`input[name="mental_health"][value="${condition}"]`);
                    if (mentalHealthCheckbox) mentalHealthCheckbox.checked = true;
                });
            }

            // Prefill documents needed
            if (patient.documentsNeeded) {
                patient.documentsNeeded.split(", ").forEach(condition => {
                    const documentCheckbox = document.querySelector(`input[name="document-needed"][value="${condition.trim()}"]`);
                    if (documentCheckbox) documentCheckbox.checked = true;
                });
            }
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
    function getCheckedValues(groupName) {
        return Array.from(document.querySelectorAll(`input[name="${groupName}"]:checked`))
            .map(checkbox => checkbox.value)
            .join(", ");
    }
    
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
    function fillCheckboxes(groupName, values) {
        if (values) {
            values.split(", ").forEach(value => {
                const checkbox = document.querySelector(`input[name="${groupName}"][value="${value}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }

    function getCheckedValues(groupName) {
        return Array.from(document.querySelectorAll(`input[name="${groupName}"]:checked`))
            .map(checkbox => checkbox.value)
            .join(", ");
    }
});

// -------------------------------------------- Update Patient Data ---------------------------------------------------
// document.getElementById("update-button").addEventListener("click", function (e) {
//     e.preventDefault();

//     const updatedData = {
//         staff: document.getElementById("staff").value,
//         admissionDate: document.getElementById("admission-date").value,
//         patientName: document.getElementById("patient-name").value,
//         patientIc: document.getElementById("patient-ic").value,
//         sex: document.querySelector('input[name="sex"]:checked')?.value || "",
//         ambulation: document.querySelector('input[name="ambulation"]:checked')?.value || "",
//         walkingAids: document.getElementById("walking-aids").value,
//         cognitiveConditions: getCheckedValues("cognitive"),
//         mentalHealthConditions: getCheckedValues("mental_health"),
//         documentsNeeded: getCheckedValues("document-needed")
//     };

//     console.log("📤 Sending updated patient data:", updatedData);

//     fetch("http://localhost:4000/api/update-patient", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedData)
//     })
//     .then(response => response.json())
//     .then(responseData => {
//         alert(responseData.message);
//         if (responseData.success) {
//             window.location.href = "nursing_homepage";
//         }
//     })
//     .catch(error => console.error("❌ Error updating patient:", error));
// });

// // Function to get values of checked checkboxes
// function getCheckedValues(groupName) {
//     return Array.from(document.querySelectorAll(`input[name="${groupName}"]:checked`))
//         .map(checkbox => checkbox.value)
//         .join(", ");
// }
