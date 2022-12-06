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
    // Get all of the survey information from the results table that has a survey with specific creatorid
    $stmt = $db->query("SELECT Title,Description,StartDate,EndDate,SurveyID 
                        FROM surveys WHERE CreatorID=? AND SurveyID IN (SELECT SurveyID FROM results)");

    // Execute statement and check if true or false
    if ($stmt->execute([$inData["UserID"]])) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        // Return the array of surveys inside key "Surveys"
        $retValue = '{"Surveys":' . json_encode($data, JSON_PRETTY_PRINT) . ',"error":""}';
        echo json_encode($retValue);
    } else {
        $retValue = '{"error":"Could Not Get Survey Results"}';
        echo $retValue;
    }
} catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
}
