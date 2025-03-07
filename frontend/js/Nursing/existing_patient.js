document.getElementById("search-patient").addEventListener("click", function() {
    let ic = document.getElementById("search-ic").value.trim();
    ic = encodeURIComponent(ic);

    if (!ic) {
        alert("Please enter IC.");
        return;
    }

    fetch(`http://localhost:4000/api/get-patient?ic=${encodeURIComponent(ic)}`)
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