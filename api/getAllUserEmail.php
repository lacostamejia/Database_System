<?php

// Include database class
include_once './Database.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Headers
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
header('Content-Type: application/json');

// Convert incoming json to variable
$inData = json_decode(file_get_contents('php://input'), true);

// Try to perfrom the query
try {
    // Get all user emails
    $stmt = $db->query("SELECT email FROM users");

    // Execute query
    $stmt->execute();

    // Get the results
    $result = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

    // As long as result isnt empty
    if (!empty($result)) {

        // Return the list of all emails
        $retValue = '{"Emails": [';

        foreach ($result as $value[0]) {
            $retValue .= "{$value[0]},";
        }

        // Remove the last comma from printing the array
        $retValue = substr($retValue, 0, -1);

        $retValue .= '],"error":""}';

        echo $retValue;
    } else {
        $retValue = '{"Emails": "","error":"No Emails"}';
        echo $retValue;
    }
} catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
}
