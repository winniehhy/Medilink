document.getElementById("submitPhysical").addEventListener("click", function(e) {
	e.preventDefault(); // Stop any default button behavior
  
	// Only collect ambulation and walkingAids
	const physicalData = {
	  ambulation: document.querySelector('input[name="ambulation"]:checked')?.value || "",
	  walkingAids: document.getElementById("walking-aids").value
	};
  
	console.log("📤 Sending physical capability data:", physicalData);
  
	// POST to your Node backend
	fetch("http://localhost:4000/api/save-physical-capability", {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify(physicalData)
	})
	  .then(response => response.json())
	  .then(data => {
		alert(data.message);
		if (data.message.includes("success")) {
		  // Go to the next page
		  window.location.href = "./Pages/Nursing/cognitive_mental_health.html";
		}
	  })
	  .catch(error => console.error("❌ Error:", error));
  });
  