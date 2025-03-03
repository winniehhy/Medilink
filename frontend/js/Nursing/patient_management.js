document.getElementById("search-patient").addEventListener("click", function () {
    const name = document.getElementById("search-name").value.trim();
    const ic = document.getElementById("search-ic").value.trim();

    if (!name || !ic) {
        alert("Please enter both name and IC.");
        return;
    }

    fetch(`http://localhost:4000/api/get-patient?name=${encodeURIComponent(name)}&ic=${encodeURIComponent(ic)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("patientData", JSON.stringify(data.patient));
                loadPatientData(data.patient);
            } else {
                alert("Patient not found.");
            }
        })
        .catch(error => console.error("❌ Error fetching patient data:", error));
});

function loadPatientData(patientData) {
    document.getElementById("search-section").style.display = "none";
    document.getElementById("update-section").style.display = "block";

    document.getElementById("staff").value = patientData.staff || "";
    document.getElementById("admission-date").value = patientData.admissionDate || "";
    document.getElementById("patient-name").value = patientData.patientName || "";
    document.getElementById("patient-ic").value = patientData.patientIc || "";
}

document.getElementById("update-button").addEventListener("click", function (e) {
    e.preventDefault();

    const updatedData = {
        staff: document.getElementById("staff").value,
        admissionDate: document.getElementById("admission-date").value,
        patientName: document.getElementById("patient-name").value,
        patientIc: document.getElementById("patient-ic").value
    };

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
