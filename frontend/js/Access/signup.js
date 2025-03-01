function submitProfile(profileType) {
	fetch("http://localhost:4000/api/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ profile: profileType })
	})
	.then(response => response.json())
	.then(data => {
		alert(data.message);
	})
	.catch(error => console.error("Error submitting profile:", error));
}
