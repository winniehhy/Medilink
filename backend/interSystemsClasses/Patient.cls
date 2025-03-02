Class Medilink.Patient Extends %Persistent
{

Property PatientID As %String;

Property Staff As %String;

Property AdmissionDate As %String;

Property PatientName As %String;

Property PatientIC As %String;

Property Sex As %String;

Property Ambulation As %String;

Property WalkingAids As %String;

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

ClassMethod InsertPhysicalCapabilityData(patientIc As %String, ambulation As %String, walkingAids As %String) As %Status
{
  // 1) Attempt to find the existing patient by patientIc
  //    If your class uses "patientIc" as the IDKey, you can do:
  set tPatient = ##class(Medilink.Patient).%OpenId(patientIc)
  
  // 2) If the row doesn't exist, decide whether to create or throw an error
  if tPatient="" {
    Quit $$$ERROR($$$GeneralError,"No existing patient found for: "_patientIc)
  }

  // 3) Update fields
  set tPatient.Ambulation = ambulation
  set tPatient.WalkingAids = walkingAids

  // 4) Save
  set sc = tPatient.%Save()
  Quit:sc
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
<Data name="PatientDefaultData">
<Subscript>"1"</Subscript>
<Value name="1">
<Value>Ambulation</Value>
</Value>
<Value name="2">
<Value>WalkingAids</Value>
</Value>
</Data>
<DataLocation>^Medilink.PatientD</DataLocation>
<DefaultData>PatientDefaultData</DefaultData>
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
