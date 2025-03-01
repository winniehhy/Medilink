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

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("nextButton").addEventListener("click", async () => {
		// 1) Get values
		const username = document.getElementById("username").value.trim();
		const password = document.getElementById("password").value.trim();
		const nursingHomeName = document.getElementById("nursingHomeName").value.trim();
		const nursingHomeAddress = document.getElementById("nursingHomeAddress").value.trim();
		const nursingHomePhone = document.getElementById("nursingHomePhone").value.trim();

		// 2) Validate fields
		let errorMessage = "";
		if (!username) errorMessage += "Username is required.\n";
		if (!password) errorMessage += "Password is required.\n";
		if (!nursingHomeName) errorMessage += "Nursing home name is required.\n";
		if (!nursingHomeAddress) errorMessage += "Nursing home address is required.\n";
		if (!nursingHomePhone) errorMessage += "Nursing home phone number is required.\n";

		if (errorMessage) {
			alert(errorMessage);
			return; // Stop execution if validation fails
		}

		try {
			// 3) Send POST to Node.js route
			const response = await fetch("/api/nursinghome-signup-temp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username,
					password,
					nursingHomeName,
					nursingHomeAddress,
					nursingHomePhone
				})
			});

			// 4) Handle response
			const data = await response.json();
			if (response.ok) {
				window.location.href = '/signup_form_nursing_criteria';
			} else {
				alert("Error: " + (data.error || "Unknown error"));
			}
		} catch (error) {
			console.error("Fetch error:", error);
			alert("Something went wrong. Check console for details.");
		}
	});
});
