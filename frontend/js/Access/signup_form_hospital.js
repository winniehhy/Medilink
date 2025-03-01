function goBack() {
	window.history.back();
  }

document.getElementById("togglePassword").addEventListener("click", function () {
	let passwordField = document.getElementById("password");
	let eyeOpen = document.getElementById("eyeOpen");
	let eyeClosed = document.getElementById("eyeClosed");

	if (passwordField.type === "password") {
	passwordField.type = "text";
	eyeOpen.style.display = "none";
	eyeClosed.style.display = "inline";
	} else {
	passwordField.type = "password";
	eyeOpen.style.display = "inline";
	eyeClosed.style.display = "none";
	}
});

// Attach event listener AFTER the DOM loads
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("doneButton").addEventListener("click", async () => {
		// 1) Get values
		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;
		const hospitalName = document.getElementById("hospitalName").value;
		const hospitalAddress = document.getElementById("hospitalAddress").value;
		const hospitalPhone = document.getElementById("hospitalPhone").value;

		try {
		// 2) Send POST to Node.js route
		const response = await fetch("/api/hospital-signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
			username,
			password,
			hospitalName,
			hospitalAddress,
			hospitalPhone
			})
		});

		// 3) Handle response
		const data = await response.json();
		if (response.ok) {
			alert("Hospital account created successfully!");
			console.log("Server response:", data);
			window.location.href = '/logIn';
		} else {
			alert("Error: " + (data.error || "Unknown error"));
		}
		} catch (error) {
		console.error("Fetch error:", error);
		alert("Something went wrong. Check console for details.");
		}
	});
});
