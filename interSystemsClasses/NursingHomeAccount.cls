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

ClassMethod ValidateLogin(pUsername As %String, pPassword As %String) As %Status
{
    Set tSC = $$$OK
    Try {
        Set tSQL = "SELECT PasswordHash FROM Medilink.NursingHomeAccount WHERE Username = ?"
        Set tStatement = ##class(%SQL.Statement).%New()
        Set tSC = tStatement.%Prepare(tSQL)
        If $$$ISERR(tSC) Quit
        
        Set tResult = tStatement.%Execute(pUsername)
        
        If 'tResult.%Next() {
            Set tSC = $$$ERROR($$$GeneralError, "User not found")
            Quit
        }
        
        Set tStoredHash = tResult.PasswordHash
        
        If (tStoredHash '= pPassword) {
            Set tSC = $$$ERROR($$$GeneralError, "Invalid password")
            Quit
        }
        
    } Catch ex {
        Set tSC = ex.AsStatus()
    }
    
    Quit tSC
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
