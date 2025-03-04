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

ClassMethod GetPatientData(PatientName As %String, PatientIC As %String) As %String
{
    Set result = ##class(%DynamicObject).%New()
    Try {
        &sql(SELECT PatientID, Staff, AdmissionDate, PatientName, PatientIC, Sex, Ambulation, 
                     WalkingAids, CognitiveConditions, MentalHealthConditions, DocumentsNeeded
              INTO :patientID, :staff, :admissionDate, :name, :ic, :sex, :ambulation, 
                   :walkingAids, :cognitiveConditions, :mentalHealthConditions, :documentsNeeded
              FROM Medilink.Patient
              WHERE PatientName = :PatientName AND PatientIC = :PatientIC)

        If SQLCODE = 0 {
            Do result.%Set("patientID", patientID)
            Do result.%Set("staff", staff)
            Do result.%Set("admissionDate", admissionDate)
            Do result.%Set("patientName", name)
            Do result.%Set("patientIc", ic)
            Do result.%Set("sex", sex)
            Do result.%Set("ambulation", ambulation)
            Do result.%Set("walkingAids", walkingAids)
            Do result.%Set("cognitiveConditions", cognitiveConditions)
            Do result.%Set("mentalHealthConditions", mentalHealthConditions)
            Do result.%Set("documentsNeeded", documentsNeeded)
        } Else {
            Do result.%Set("error", "Patient not found")
        }
    } Catch ex {
        Do result.%Set("error", "Error retrieving patient data: "_ex.DisplayString())
    }
    
    Quit result.%ToJSON()
}

/// Update patient information in the database
// ClassMethod UpdatePatientData(PatientName As %String, PatientIC As %String, Staff As %String, AdmissionDate As %String, Sex As %String, Ambulation As %String, WalkingAids As %String, CognitiveConditions As %String, MentalHealthConditions As %String, DocumentsNeeded As %String) As %Status
// {
//     Try {
//         Set obj = ##class(Medilink.Patient).%OpenId(PatientName _ "_" _ PatientIC)
        
//         If obj '= "" {
//             Set obj.Staff = Staff
//             Set obj.AdmissionDate = AdmissionDate
//             Set obj.Sex = Sex
//             Set obj.Ambulation = Ambulation
//             Set obj.WalkingAids = WalkingAids
//             Set obj.CognitiveConditions = CognitiveConditions
//             Set obj.MentalHealthConditions = MentalHealthConditions
//             Set obj.DocumentsNeeded = DocumentsNeeded

//             Set sc = obj.%Save()
//             If $$$ISERR(sc) {
//                 Return $$$ERROR($$$GeneralError, "Error saving patient data: "_$System.Status.GetErrorText(sc))
//             }
//             Return $$$OK  // Correct way to return success
//         } Else {
//             Return $$$ERROR($$$GeneralError, "Patient not found")  // Correct way to return an error
//         }
//     } Catch ex {
//         Return $$$ERROR($$$GeneralError, "Error updating patient data: "_ex.DisplayString())  // Correct error handling
//     }
// }
ClassMethod UpdatePatientData(PatientName As %String, PatientIC As %String, Staff As %String, AdmissionDate As %String, Sex As %String, Ambulation As %String, WalkingAids As %String, CognitiveConditions As %String, MentalHealthConditions As %String, DocumentsNeeded As %String) As %Status
{
    Try {
        // Log the incoming data
        Write "📥 Updating patient with data:", !
        Write "PatientName: ", PatientName, !
        Write "PatientIC: ", PatientIC, !
        Write "Staff: ", Staff, !
        Write "AdmissionDate: ", AdmissionDate, !
        Write "Sex: ", Sex, !
        Write "Ambulation: ", Ambulation, !
        Write "WalkingAids: ", WalkingAids, !
        Write "CognitiveConditions: ", CognitiveConditions, !
        Write "MentalHealthConditions: ", MentalHealthConditions, !
        Write "DocumentsNeeded: ", DocumentsNeeded, !

        Set obj = ##class(Medilink.Patient).%OpenId(PatientName _ "_" _ PatientIC)
        
        If obj '= "" {
            Set obj.Staff = Staff
            Set obj.AdmissionDate = AdmissionDate
            Set obj.Sex = Sex
            Set obj.Ambulation = Ambulation
            Set obj.WalkingAids = WalkingAids
            Set obj.CognitiveConditions = CognitiveConditions
            Set obj.MentalHealthConditions = MentalHealthConditions
            Set obj.DocumentsNeeded = DocumentsNeeded

            Set sc = obj.%Save()
            If $$$ISERR(sc) {
                Write "❌ Error saving patient data: ", $System.Status.GetErrorText(sc), !
                Return $$$ERROR($$$GeneralError, "Error saving patient data: "_$System.Status.GetErrorText(sc))
            }
            Write "✅ Patient data saved successfully!", !
            Return $$$OK  // Correct way to return success
        } Else {
            Write "❌ Patient not found", !
            Return $$$ERROR($$$GeneralError, "Patient not found")  // Correct way to return an error
        }
    } Catch ex {
        Write "❌ Error updating patient data: ", ex.DisplayString(), !
        Return $$$ERROR($$$GeneralError, "Error updating patient data: "_ex.DisplayString())  // Correct error handling
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
