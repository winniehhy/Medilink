function addDocuments() {
	const documentInput = document.getElementById("new-document");
	const documentValue = documentInput.value.trim(); // Use documentValue instead of conditionValue

	if (documentValue) {
		// Create a new checkbox with the input value
		const newCheckbox = document.createElement("label");
		// Checked the checkbox by default
		newCheckbox.innerHTML = `<input type="checkbox" name="document-needed" value="${documentValue}" checked> ${documentValue}`;
		// Append the new checkbox to the document list
		document.getElementById("document-list").appendChild(newCheckbox);

		// Clear the input field after adding
		documentInput.value = "";
	} else {
		alert("Please enter a valid document name.");
	}
}