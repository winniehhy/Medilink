document.getElementById("search-patient").addEventListener("click", function() {
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
                window.location.href = "update_patient_info";
            } else {
                alert("Patient not found.");
            }
        })
        .catch(error => console.error("❌ Error fetching patient data:", error));
});
