Class Medilink.HospitalAccount Extends %Persistent
{

Property Username As %String;

Property PasswordHash As %String;

Property HospitalName As %String;

Property HospitalAddress As %String;

Property HospitalPhone As %String;

ClassMethod GetHospitalAccounts() As %SQLQuery(CONTAINID=0,ROWSPEC="ID:%Integer, HospitalAddress:%String, HospitalName:%String, HospitalPhone:%String, PasswordHash:%String, Username:%String")
{
        // Execute SQL Query
        RETURN ##class(%SQL.Statement).%ExecDirect(,"SELECT ID, HospitalAddress, HospitalName, HospitalPhone, PasswordHash, Username FROM Medilink.HospitalAccount")
}

ClassMethod GetAllHospitals() As %String
{
        Set tStatement = ##class(%SQL.Statement).%New()
        Do tStatement.%Prepare("SELECT ID, HospitalAddress, HospitalName, HospitalPhone, PasswordHash, Username FROM Medilink.HospitalAccount")
        Set tResult = tStatement.%Execute()
        
        // Initialize JSON array
        Set tJSONArray = "["

        While tResult.%Next() {
            Set tRecord = "{""ID"":"""_tResult.%Get("ID")_""","
            Set tRecord = tRecord_"""HospitalAddress"":"""_$$EscapeJSON(tResult.%Get("HospitalAddress"))_""","
            Set tRecord = tRecord_"""HospitalName"":"""_$$EscapeJSON(tResult.%Get("HospitalName"))_""","
            Set tRecord = tRecord_"""HospitalPhone"":"""_$$EscapeJSON(tResult.%Get("HospitalPhone"))_""","
            Set tRecord = tRecord_"""PasswordHash"":"""_$$EscapeJSON(tResult.%Get("PasswordHash"))_""","
            Set tRecord = tRecord_"""Username"":"""_$$EscapeJSON(tResult.%Get("Username"))_"""}"
            
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

ClassMethod InsertHospitalData(pUsername As %String, pPassword As %String, pHospitalName As %String, pHospitalAddress As %String, pHospitalPhone As %String) As %Status
{
  Set tSC = $$$OK
  &sql(
    INSERT INTO Medilink.HospitalAccount (Username, PasswordHash, HospitalName, HospitalAddress, HospitalPhone)
    VALUES (:pUsername, :pPassword, :pHospitalName, :pHospitalAddress, :pHospitalPhone)
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
        Set tSQL = "SELECT PasswordHash FROM Medilink.HospitalAccount WHERE Username = ?"
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
<Data name="HospitalAccountDefaultData">
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
<Value>HospitalName</Value>
</Value>
<Value name="5">
<Value>HospitalAddress</Value>
</Value>
<Value name="6">
<Value>HospitalPhone</Value>
</Value>
</Data>
<DataLocation>^Medilink.HospitalAccountD</DataLocation>
<DefaultData>HospitalAccountDefaultData</DefaultData>
<ExtentSize>1</ExtentSize>
<IdLocation>^Medilink.HospitalAccountD</IdLocation>
<IndexLocation>^Medilink.HospitalAccountI</IndexLocation>
<Property name="%%CLASSNAME">
<AverageFieldSize>2</AverageFieldSize>
<OutlierSelectivity>.999999:</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="%%ID">
<AverageFieldSize>3</AverageFieldSize>
<Selectivity>1</Selectivity>
</Property>
<Property name="HospitalAddress">
<AverageFieldSize>23</AverageFieldSize>
<OutlierSelectivity>.999999:"""somewhere out there"""</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="HospitalName">
<AverageFieldSize>16</AverageFieldSize>
<OutlierSelectivity>.999999:"""Hospital ABC"""</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="HospitalPhone">
<AverageFieldSize>9</AverageFieldSize>
<OutlierSelectivity>.999999:"""01234"""</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="PasswordHash">
<AverageFieldSize>11</AverageFieldSize>
<OutlierSelectivity>.999999:"""test123"""</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<Property name="Username">
<AverageFieldSize>8</AverageFieldSize>
<OutlierSelectivity>.999999:"""qtay"""</OutlierSelectivity>
<Selectivity>0.0001%</Selectivity>
</Property>
<SQLMap name="IDKEY">
<BlockCount>-4</BlockCount>
</SQLMap>
<StreamLocation>^Medilink.HospitalAccountS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
