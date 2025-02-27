function prevPage() {
	window.history.back();
}
const fetchedPollResult = "No"; 
const fetchedDescription = "Patient needs further observation before discharge.";

document.getElementById("poll-result").textContent = fetchedPollResult;
document.getElementById("text-result").textContent = fetchedDescription;