Class Medilink.Patient Extends %Persistent
{

Property PatientID As %String(MAXLEN = 1000);

Property Staff As %String(MAXLEN = 1000);

Property AdmissionDate As %String(MAXLEN = 1000);

Property PatientName As %String(MAXLEN = 1000);

Property PatientIC As %String(MAXLEN = 1000);

Property Sex As %String(MAXLEN = 1000);

Property Ambulation As %String(MAXLEN = 1000);

// Physical capability: Ambulation

Property WalkingAids As %String(MAXLEN = 1000);

// Physical capability: Walking aids

Property CognitiveConditions As %String(MAXLEN = 1000);

// Cognitive conditions

Property MentalHealthConditions As %String(MAXLEN = 1000);

// Mental health conditions

Property DocumentsNeeded As %String(MAXLEN = 1000);

// Documents needed

Property ReadyToDischarge As %Boolean [ InitialExpression = 0 ];

/// Comments about discharge status
Property Comments As %String(MAXLEN = 1000);

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

ClassMethod InsertPatientData(pStaff As %String, pAdmissionDate As %String, pPatientName As %String, pPatientIC As %String, pSex As %String, pAmbulation As %String, pWalkingAids As %String, pCognitiveConditions As %String, pMentalHealthConditions As %String, pDocumentsNeeded As %String) As %Status
{
      Set tSC = $$$OK
      Set patientID = ..GeneratePatientID()

      &sql(
          INSERT INTO Medilink.Patient (
              PatientID, 
              Staff, 
              AdmissionDate, 
              PatientName, 
              PatientIC, 
              Sex, 
              Ambulation, 
              WalkingAids, 
              CognitiveConditions, 
              MentalHealthConditions, 
              DocumentsNeeded
          )
          VALUES (
              :patientID, 
              :pStaff, 
              :pAdmissionDate, 
              :pPatientName, 
              :pPatientIC, 
              :pSex, 
              :pAmbulation, 
              :pWalkingAids, 
              :pCognitiveConditions, 
              :pMentalHealthConditions, 
              :pDocumentsNeeded
          )
      )

      DO ##class(%SYS.System).WriteToConsoleLog(SQLCODE)
      
      If SQLCODE < 0 {
          Set tSC = $$$ERROR($$$GeneralError, "SQL Insert Failed: "_SQLCODE)
      }
      
      Quit tSC
}

/// Retrieve patient data by Name and IC
ClassMethod GetPatientData(ic As %String) As %String
{
    Set result = ##class(%DynamicObject).%New()
    Try {
        Set query = "SELECT * FROM Medilink.Patient WHERE PatientIC = ?"
        Set statement = ##class(%SQL.Statement).%New()
        Set status = statement.%Prepare(query)
        
        #; If $$$ISERR(status) {
        #;     Throw ##class(%Exception.SQL).CreateFromSQLCODE(SQLCODE, $get(%msg))
        #; }
        
        Set resultSet = statement.%Execute(ic)
        
        If resultSet.%Next() {
            Do result.%Set("staff", resultSet.%Get("Staff"))
            Do result.%Set("admissionDate", resultSet.%Get("AdmissionDate"))
            Do result.%Set("patientName", resultSet.%Get("PatientName"))
            Do result.%Set("patientIc", resultSet.%Get("PatientIC"))
            Do result.%Set("sex", resultSet.%Get("Sex"))
            Do result.%Set("ambulation", resultSet.%Get("Ambulation"))
            Do result.%Set("walkingAids", resultSet.%Get("WalkingAids"))
            Do result.%Set("cognitiveConditions", resultSet.%Get("CognitiveConditions"))
            Do result.%Set("mentalHealthConditions", resultSet.%Get("MentalHealthConditions"))
            Do result.%Set("documentsNeeded", resultSet.%Get("DocumentsNeeded"))

            Do result.%Set("readyToDischarge", resultSet.%Get("ReadyToDischarge"))
            Do result.%Set("comments", resultSet.%Get("Comments"))
        } Else {
            Do result.%Set("error", "Patient not found")
        }
    } Catch ex {
        Do result.%Set("error", "Error retrieving patient data: "_ex.DisplayString())
    }
    
    Quit result.%ToJSON()
}

/// Update patient information in the database 
ClassMethod UpdatePatientData(
    PatientName As %String, 
    PatientIC As %String, 
    Staff As %String, 
    AdmissionDate As %String, 
    Sex As %String, 
    Ambulation As %String, 
    WalkingAids As %String, 
    CognitiveConditions As %String, 
    MentalHealthConditions As %String, 
    DocumentsNeeded As %String
) As %Status
{
    DO ##class(%SYS.System).WriteToConsoleLog("Starting UpdatePatientData")

    Try {
        // Find the patient by PatientIC
        Set obj = ""
        &sql(SELECT %ID INTO :patientID FROM Medilink.Patient WHERE PatientIC = :PatientIC)
        
        If (SQLCODE = 0) {
            Set obj = ##class(Medilink.Patient).%OpenId(patientID)
        }

        // Check if the patient was found
        If obj '= "" {
            // Update patient data
            Set obj.Staff = Staff
            Set obj.AdmissionDate = AdmissionDate
            Set obj.Sex = Sex
            Set obj.Ambulation = Ambulation
            Set obj.WalkingAids = WalkingAids
            Set obj.CognitiveConditions = CognitiveConditions
            Set obj.MentalHealthConditions = MentalHealthConditions
            Set obj.DocumentsNeeded = DocumentsNeeded

            // Save changes
            Set sc = obj.%Save()
            If $$$ISERR(sc) {
                Return $$$ERROR($$$GeneralError, "Error saving patient data: "_$System.Status.GetErrorText(sc))
            }

            DO ##class(%SYS.System).WriteToConsoleLog("Patient data updated successfully")
            Return $$$OK  // Success
        } Else {
            DO ##class(%SYS.System).WriteToConsoleLog("Patient not found")
            Return $$$ERROR($$$GeneralError, "Patient not found with IC: "_PatientIC)
        }
    } Catch ex {
        DO ##class(%SYS.System).WriteToConsoleLog("ERROR: "_ex.DisplayString())
        Return $$$ERROR($$$GeneralError, "Error updating patient data: "_ex.DisplayString())
    }
}

/// Retrieve all patients from the database
ClassMethod GetAllPatients() As %String
{
    Set resultArray = ##class(%DynamicArray).%New()
    
    Try {
        Set query = "SELECT * FROM Medilink.Patient"
        Set statement = ##class(%SQL.Statement).%New()
        Set status = statement.%Prepare(query)
        
        #; If $$$ISERR(status) {
        #;     Throw ##class(%Exception.SQL).CreateFromSQLCODE(SQLCODE, $get(%msg))
        #; }
        
        Set resultSet = statement.%Execute()
        
        While resultSet.%Next() {
            Set patientObj = ##class(%DynamicObject).%New()
            
            Do patientObj.%Set("patientID", resultSet.%Get("PatientID"))
            Do patientObj.%Set("staff", resultSet.%Get("Staff"))
            Do patientObj.%Set("admissionDate", resultSet.%Get("AdmissionDate"))
            Do patientObj.%Set("patientName", resultSet.%Get("PatientName"))
            Do patientObj.%Set("patientIC", resultSet.%Get("PatientIC"))
            Do patientObj.%Set("sex", resultSet.%Get("Sex"))
            Do patientObj.%Set("ambulation", resultSet.%Get("Ambulation"))
            Do patientObj.%Set("walkingAids", resultSet.%Get("WalkingAids"))
            Do patientObj.%Set("cognitiveConditions", resultSet.%Get("CognitiveConditions"))
            Do patientObj.%Set("mentalHealthConditions", resultSet.%Get("MentalHealthConditions"))
            Do patientObj.%Set("documentsNeeded", resultSet.%Get("DocumentsNeeded"))

            Do patientObj.%Set("readyToDischarge", resultSet.%Get("ReadyToDischarge"))
            Do patientObj.%Set("comments", resultSet.%Get("Comments"))
            
            Do resultArray.%Push(patientObj)
        }
    } Catch ex {
        Set errorObj = ##class(%DynamicObject).%New()
        Do errorObj.%Set("error", "Error retrieving patients: "_ex.DisplayString())
        Return errorObj.%ToJSON()
    }
    
    Return resultArray.%ToJSON()
}

// for hospital to store patient ready to discharge or not

/// Update patient discharge status
/// Update patient discharge status
ClassMethod UpdatePatientStatus(patientIC As %String, readyToDischarge As %Boolean, comments As %String) As %Status
{
    Try {
        // Query to find the patient by IC
        Set query = "SELECT %ID FROM Medilink.Patient WHERE PatientIC = ?"
        Set statement = ##class(%SQL.Statement).%New()
        Set status = statement.%Prepare(query)
        If $$$ISERR(status) {
            Return $$$ERROR($$$GeneralError, "Error preparing SQL statement: "_$System.Status.GetErrorText(status))
        }

        DO ##class(%SYS.System).WriteToConsoleLog("Searching for PatientIC: "_patientIC)

        Set resultSet = statement.%Execute(patientIC)
        
        If resultSet.%Next() {
            // Get the ID of the patient
            Set id = resultSet.%Get("ID")  // Explicitly get the ID column
            DO ##class(%SYS.System).WriteToConsoleLog("Patient ID Found: "_id)
            
            // Open the patient object
            Set obj = ##class(Medilink.Patient).%OpenId(id, 1)  // Open with concurrency control
            If obj '= $$$NULLOREF {
                
                // Begin transaction for safety
                TSTART
                
                // Update discharge status
                Set obj.ReadyToDischarge = readyToDischarge
                Set obj.Comments = comments
                
                // Save changes
                Set sc = obj.%Save()
                If $$$ISERR(sc) {
                    TROLLBACK
                    Return $$$ERROR($$$GeneralError, "Error saving patient data: "_$System.Status.GetErrorText(sc))
                }
                
                // Commit transaction
                TCOMMIT
                Return $$$OK
            } Else {
                Return $$$ERROR($$$GeneralError, "Patient object not found for ID "_id)
            }
        } Else {
            Return $$$ERROR($$$GeneralError, "Patient with IC "_patientIC_" not found")
        }
    } Catch ex {
        Return $$$ERROR($$$GeneralError, "Error updating patient status: "_ex.DisplayString())
    }
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
<Value name="3">
<Value>CognitiveConditions</Value>
</Value>
<Value name="4">
<Value>MentalHealthConditions</Value>
</Value>
<Value name="5">
<Value>DocumentsNeeded</Value>
</Value>
<Value name="6">
<Value>ReadyToDischarge</Value>
</Value>
<Value name="7">
<Value>Comments</Value>
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
