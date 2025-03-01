Class Medilink.Patient Extends %Persistent
{

Property PatientID As %String;

Property Staff As %String;

Property AdmissionDate As %String;

Property PatientName As %String;

Property PatientIC As %String;

Property Sex As %String;

// Define a unique index on PatientID

Index PatientIDIndex On PatientID [ Unique ];

ClassMethod GeneratePatientID() As %String
{
        Set lastPatient = ""
        &sql(SELECT TOP 1 PatientID INTO :lastPatient FROM Medilink.Patient ORDER BY PatientID DESC)
        
        If SQLCODE '= 0 || lastPatient = "" {
            Quit "P1"
        }

        Set num = $Extract(lastPatient, 2, *) + 1
        Quit "P" _ num
}

ClassMethod InsertPatientData(pStaff As %String, pAdmissionDate As %String, pPatientName As %String, pPatientIC As %String, pSex As %String) As %Status
{
    Set tSC = $$$OK
    Set patientID = ..GeneratePatientID()

    // Check if the generated PatientID already exists
    //&sql(SELECT COUNT(*) INTO :count FROM Medilink.Patient WHERE PatientID = :patientID)
    //DO ##class(%SYS.System).WriteToConsoleLog(count)
    //If count > 0 {
    //    Quit $$$ERROR($$$GeneralError, "PatientID already exists: "_patientID)
    //}

    &sql(
        INSERT INTO Medilink.Patient (PatientID, Staff, AdmissionDate, PatientName, PatientIC, Sex)
        VALUES (:patientID, :pStaff, :pAdmissionDate, :pPatientName, :pPatientIC, :pSex)
    )

    DO ##class(%SYS.System).WriteToConsoleLog(SQLCODE)
    
    If SQLCODE < 0 {
        Set tSC = $$$ERROR($$$GeneralError, "SQL Insert Failed: "_SQLCODE)
    }
    
    Quit tSC
}

ClassMethod GetPatientByIC(pPatientIC As %String) As %String
{
        Set tSQL = "SELECT * FROM Medilink.Patient WHERE PatientIC = ?"
        Set tStatement = ##class(%SQL.Statement).%New()
        Set tSC = tStatement.%Prepare(tSQL)
        If $$$ISERR(tSC) { Quit "{}" }
        
        Set tResult = tStatement.%Execute(pPatientIC)
        If 'tResult.%Next() { Quit "{}" }

        Set patientJSON = "{""PatientID"":"""_tResult.PatientID_""", ""Staff"":"""_tResult.Staff_""", ""AdmissionDate"":"""_tResult.AdmissionDate_""", ""PatientName"":"""_tResult.PatientName_""", ""PatientIC"":"""_tResult.PatientIC_""", ""Sex"":"""_tResult.Sex_"""}"
        Quit patientJSON
}

Storage Default
{
<Data name="Medilink_PatientDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>PatientID</Value>
</Value>
<Value name="3">
<Value>Staff</Value>
</Value>
<Value name="4">
<Value>AdmissionDate</Value>
</Value>
<Value name="5">
<Value>PatientName</Value>
</Value>
<Value name="6">
<Value>PatientIC</Value>
</Value>
<Value name="7">
<Value>Sex</Value>
</Value>
</Data>
<DataLocation>^Medilink.PatientD</DataLocation>
<ExtentSize>1</ExtentSize>
<IdLocation>^Medilink.PatientD</IdLocation>
<IndexLocation>^Medilink.PatientI</IndexLocation>
<Property name="%%CLASSNAME">
<AverageFieldSize>2</AverageFieldSize>
<OutlierSelectivity>.999999:</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="%%ID">
<AverageFieldSize>3</AverageFieldSize>
<Selectivity>1</Selectivity>
</Property>
<Property name="AdmissionDate">
<AverageFieldSize>2</AverageFieldSize>
<OutlierSelectivity>.999999:</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="PatientIC">
<AverageFieldSize>7</AverageFieldSize>
<OutlierSelectivity>.999999:"abcde"</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="PatientID">
<AverageFieldSize>4</AverageFieldSize>
<Selectivity>1</Selectivity>
</Property>
<Property name="PatientName">
<AverageFieldSize>14</AverageFieldSize>
<OutlierSelectivity>.999999:"JackieAHHHHH"</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="Sex">
<AverageFieldSize>6</AverageFieldSize>
<OutlierSelectivity>.999999:"Male"</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="Staff">
<AverageFieldSize>8</AverageFieldSize>
<OutlierSelectivity>.999999:"Jackie"</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<SQLMap name="IDKEY">
<BlockCount>-4</BlockCount>
</SQLMap>
<SQLMap name="PatientIDIndex">
<BlockCount>-4</BlockCount>
</SQLMap>
<StreamLocation>^Medilink.PatientS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
