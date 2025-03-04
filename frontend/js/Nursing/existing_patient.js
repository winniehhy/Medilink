document.getElementById("search-patient").addEventListener("click", function() {
    const name = document.getElementById("search-name").value.trim();
    let ic = document.getElementById("search-ic").value.trim();
    ic = encodeURIComponent(ic);

    if (!name || !ic) {
        alert("Please enter both name and IC.");
        return;
    }

    fetch(`http://localhost:4000/api/get-patient?name=${encodeURIComponent(name)}&ic=${ic}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("✅ Patient data stored in session:", data.patient);
                setTimeout(() => {
                    window.location.href = "update_patient_info";
                }, 500);
            } else {
                alert("Patient not found.");
            }
        })
        .catch(error => console.error("❌ Error fetching patient data:", error));
});