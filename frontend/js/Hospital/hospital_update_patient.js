document.addEventListener('DOMContentLoaded', function() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const patientIC = urlParams.get('ic');
    const patientName = urlParams.get('name');
    const currentStatus = urlParams.get('status') === 'true';
    
    console.log("📋 Patient details:", { 
        patientIC, 
        patientName, 
        currentStatus: currentStatus ? "Ready for discharge" : "Not ready"
    });
    
    // Update page title with patient name
    const titleElement = document.querySelector('.title');
    if (titleElement && patientName) {
        titleElement.textContent = `Update discharge status for ${patientName}`;
    }
    
    // Pre-select radio button based on current status
    if (currentStatus) {
        const yesRadio = document.querySelector('input[value="yes"]');
        if (yesRadio) yesRadio.checked = true;
    }
    
    // Add event listener to the Save button
    document.querySelector('.save-button').addEventListener('click', function() {
        // Get the selected radio button value
        const yesRadio = document.querySelector('input[value="yes"]');
        const readyToDischarge = yesRadio.checked;
        
        // Get comments from text input
        const comments = document.querySelector('.fill-text-input').value.trim();
        
        if (!patientIC) {
            alert('Error: Patient identifier is missing.');
            return;
        }
        
        console.log(`💾 Submitting update:`, {
            patientIC,
            readyToDischarge,
            comments: comments || "N/A"
        });
        
        // Show loading state
        this.disabled = true;
        this.textContent = 'Saving...';
        
        fetch('http://localhost:4000/api/update-patient-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                patientIC: patientIC, // Use consistent parameter name
                readyToDischarge: readyToDischarge,
                comments: comments || "Marked by hospital staff"
            })
        })
        .then(response => {
            console.log("📤 Response status:", response.status);
            return response.json();
        })
        .then(data => {
            console.log("📥 Response data:", data);
            
            if (data.success) {
                alert('Patient status updated successfully!');
                window.location.href = 'hospital_homepage';
                // window.location.href = 'hospital_homepage.html';
            } else {
                throw new Error(data.error || 'Failed to update status');
            }
        })
        .catch(error => {
            console.error('❌ Error updating patient status:', error);
            alert(`Failed to update patient status: ${error.message}`);
            this.disabled = false;
            this.textContent = 'Save';
        });
    });
});