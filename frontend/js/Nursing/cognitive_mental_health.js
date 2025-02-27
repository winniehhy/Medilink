function addCondition(groupId, inputId) {
	const conditionInput = document.getElementById(inputId);
	const conditionValue = conditionInput.value.trim();

	if (conditionValue) {
		// Create a new checkbox with the input value
		const newCheckbox = document.createElement("label");
		newCheckbox.innerHTML = `<input type="checkbox" name="${groupId}" value="${conditionValue}" checked> ${conditionValue}`;
		// Append to the correct group
		document.getElementById(groupId).appendChild(newCheckbox);

		// Clear the input field after adding
		conditionInput.value = "";
	} else {
		alert("Please enter a valid condition.");
	}
}