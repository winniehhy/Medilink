Class Medilink.NursingHomeAccount Extends %Persistent
{

Property Username As %String;

Property PasswordHash As %String(MAXLEN = 100);

Property NursingHomeName As %String;

Property NursingHomeAddress As %String;

Property NursingHomePhone As %String;

Property PartyResponsibility As %String;

Property AvailableDays As %String;

Property TimeSlotFrom As %String;

Property TimeSlotTo As %String;

Property Treatments As %String;

Property SelectedTreatments As %String;

ClassMethod GetNursingHomeAccounts() As %SQLQuery(CONTAINID=0,ROWSPEC="ID:%Integer, Username:%String, PasswordHash:%String, NursingHomeName:%String, NursingHomeAddress:%String, NursingHomePhone:%String, PartyResponsibility:%String, AvailableDays:%String, TimeSlotFrom:%String, TimeSlotTo:%String, Treatments:%String, SelectedTreatments:%String")
{
        RETURN ##class(%SQL.Statement).%ExecDirect(,"SELECT ID, Username, PasswordHash, NursingHomeName, NursingHomeAddress, NursingHomePhone, PartyResponsibility, AvailableDays, TimeSlotFrom, TimeSlotTo, Treatments, SelectedTreatments FROM Medilink.NursingHomeAccount")
}

ClassMethod GetAllNursing() As %String
{
        Set tStatement = ##class(%SQL.Statement).%New()
        Do tStatement.%Prepare("SELECT ID, Username, PasswordHash, NursingHomeName, NursingHomeAddress, NursingHomePhone, PartyResponsibility, AvailableDays, TimeSlotFrom, TimeSlotTo, Treatments, SelectedTreatments FROM Medilink.NursingHomeAccount")
        Set tResult = tStatement.%Execute()
        
        Set tJSONArray = "["

        While tResult.%Next() {
            Set tRecord = "{""ID"":"""_tResult.%Get("ID")_""","
            Set tRecord = tRecord_"""Username"":"""_$$EscapeJSON(tResult.%Get("Username"))_"""}"
            Set tRecord = tRecord_"""PasswordHash"":"""_$$EscapeJSON(tResult.%Get("PasswordHash"))_""","
            Set tRecord = tRecord_"""NursingHomeName"":"""_$$EscapeJSON(tResult.%Get("NursingHomeName"))_""","
            Set tRecord = tRecord_"""NursingHomeAddress"":"""_$$EscapeJSON(tResult.%Get("NursingHomeAddress"))_""","
            Set tRecord = tRecord_"""NursingHomePhone"":"""_$$EscapeJSON(tResult.%Get("NursingHomePhone"))_""","
            Set tRecord = tRecord_"""PartyResponsibility"":"""_$$EscapeJSON(tResult.%Get("PartyResponsibility"))_""","
            Set tRecord = tRecord_"""AvailableDays"":"""_$$EscapeJSON(tResult.%Get("AvailableDays"))_""","
            Set tRecord = tRecord_"""TimeSlotFrom"":"""_$$EscapeJSON(tResult.%Get("TimeSlotFrom"))_""","
            Set tRecord = tRecord_"""TimeSlotTo"":"""_$$EscapeJSON(tResult.%Get("TimeSlotTo"))_""","
            Set tRecord = tRecord_"""Treatments"":"""_$$EscapeJSON(tResult.%Get("Treatments"))_""","
            Set tRecord = tRecord_"""SelectedTreatments"":"""_$$EscapeJSON(tResult.%Get("SelectedTreatments"))_""","
            
            
            If tJSONArray'="[" Set tJSONArray = tJSONArray_","  // Add comma only after the first record
            Set tJSONArray = tJSONArray_tRecord
        }
        
        Set tJSONArray = tJSONArray_"]" // Close JSON array
        Quit tJSONArray
}

ClassMethod EscapeJSON(value As %String) As %String
{
        // Escape double quotes and backslashes for valid JSON
        Quit $Replace($Replace(value, "\", "\\"), """", "\""")
}

ClassMethod InsertNursingHomeData(pUsername As %String, pPassword As %String, pNursingHomeName As %String, pNursingHomeAddress As %String, pNursingHomePhone As %String, pPartyResponsibility As %String, pAvailableDays As %String, pTimeSlotFrom As %String, pTimeSlotTo As %String, pTreatments As %String, pSelectedTreatments As %String) As %Status
{
  Set tSC = $$$OK
  &sql(
    INSERT INTO Medilink.NursingHomeAccount (Username, PasswordHash, NursingHomeName, NursingHomeAddress, NursingHomePhone, PartyResponsibility, AvailableDays, TimeSlotFrom, TimeSlotTo, Treatments, SelectedTreatments)
    VALUES (:pUsername, :pPassword, :pNursingHomeName, :pNursingHomeAddress, :pNursingHomePhone, :pPartyResponsibility, :pAvailableDays, :pTimeSlotFrom, :pTimeSlotTo, :pTreatments, :pSelectedTreatments)
  )
  If SQLCODE '= 0 {
    Set tSC = $$$ERROR($$$GeneralError, "SQL Insert Failed: "_SQLCODE)
  }
  Quit tSC
}

ClassMethod GetHashedPasswordByUsername(pUsername As %String) As %String
{
        Set tStatement = ##class(%SQL.Statement).%New()
        Do tStatement.%Prepare("SELECT PasswordHash FROM Medilink.NursingHomeAccount WHERE Username = ?")
        Set tResult = tStatement.%Execute(pUsername)
        
        If tResult.%Next() {
            Quit tResult.%Get("PasswordHash")
        }
        
        Quit ""
}

ClassMethod GetUsername(pUsername As %String) As %String
{
        Set tStatement = ##class(%SQL.Statement).%New()
        Do tStatement.%Prepare("SELECT Username FROM Medilink.NursingHomeAccount WHERE Username = ?")
        Set tResult = tStatement.%Execute(pUsername)
        
        If tResult.%Next() {
            Quit tResult.%Get("Username")
        }
        
        Quit ""
}

Storage Default
{
<Data name="NursingHomeAccountDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Username</Value>
</Value>
<Value name="3">
<Value>PasswordHash</Value>
</Value>
<Value name="4">
<Value>NursingHomeName</Value>
</Value>
<Value name="5">
<Value>NursingHomeAddress</Value>
</Value>
<Value name="6">
<Value>NursingHomePhone</Value>
</Value>
<Value name="7">
<Value>PartyResponsibility</Value>
</Value>
<Value name="8">
<Value>AvailableDays</Value>
</Value>
<Value name="9">
<Value>TimeSlotFrom</Value>
</Value>
<Value name="10">
<Value>TimeSlotTo</Value>
</Value>
<Value name="11">
<Value>Treatments</Value>
</Value>
<Value name="12">
<Value>SelectedTreatments</Value>
</Value>
</Data>
<DataLocation>^Medilink.NursingHomeAccountD</DataLocation>
<DefaultData>NursingHomeAccountDefaultData</DefaultData>
<ExtentSize>1</ExtentSize>
<IdLocation>^Medilink.NursingHomeAccountD</IdLocation>
<IndexLocation>^Medilink.NursingHomeAccountI</IndexLocation>
<StreamLocation>^Medilink.NursingHomeAccountS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
