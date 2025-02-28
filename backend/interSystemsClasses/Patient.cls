Class MyApp.Patient Extends (%Persistent)
{
	Property Staff As %String;
	Property PatientID As %String;
	Property AdmissionDate As %Date;
	Property PatientName As %String;
	Property PatientIC As %String;
	Property Sex As %String;

	ClassMethod InsertPatientData(staff As %String, patientId As %String, admissionDate As %Date, patientName As %String, patientIc As %String, sex As %String) As %Boolean
	{
		Try {
			Set patient = ##class(MyApp.Patient).%New()
			Set patient.Staff = staff
			Set patient.PatientID = patientId
			Set patient.AdmissionDate = admissionDate
			Set patient.PatientName = patientName
			Set patient.PatientIC = patientIc
			Set patient.Sex = sex
			
			Do patient.%Save()
			Quit $$$OK
		} Catch ex {
			Write "Error: ", ex.DisplayString(), !
			Quit 0
		}
	}
}
