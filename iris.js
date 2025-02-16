// const irisnative = require("intersystems-iris-native");

// function main() {
//     // Database credentials
//     const dbConfig = {
//         host: "localhost",
//         port: 1972,
//         ns: "USER",
//         user: "_SYSTEM",
//         pwd: "121314",
//     };

//     try {
//         // Connect to IRIS
//         const connection = irisnative.createConnection(dbConfig);
//         console.log("Hello World! You have successfully connected to InterSystems IRIS.");
        
//         // Close connection
//         connection.close();
//     } catch (error) {
//         console.error("Failed to connect to IRIS:", error.message);
//     }
// }

// main();





/*------------to test connection database with intersystems ( dun delete here first)----------------*/

const irisnative = require('intersystems-iris-native')

function main()
{
    // Credentials to connect to InterSystems IRIS database
    var ip = "localhost"
    var port = 1972
    var namespace = "USER"
    var username = "_SYSTEM"
    var password = "121314"

    // Create connection to InterSystems IRIS
    const connection = irisnative.createConnection({host: ip, port: port, ns: namespace, user: username, pwd: password})
    console.log("Hello World! You have successfully connected to InterSystems IRIS.")

    // // Create an InterSystems IRIS native object
    const irisNative = connection.createIris()

    // // Store data natively into a global using the InterSystems IRIS native object
    irisNative.set(8888, "^testglobal", "1");
    globalValue = irisNative.get("^testglobal", "1");
    console.log("The value of ^testglobal(1) is " + globalValue);
}

main()