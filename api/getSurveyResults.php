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
    // Get all of the results from the surveyid and relevant survey information
    $stmt = $db->prepare("SELECT s.Title,s.Description,s.NumType1,s.NumType2,s.Type1Q1,r.Type1A1,s.Type1Q2,r.Type1A2,s.Type1Q3,r.Type1A3,s.Type1Q4,r.Type1A4,s.Type1Q5,r.Type1A5,
                                    s.Type2Q1,r.Type2A1,s.Type2Q2,r.Type2A2,s.Type2Q3,r.Type2A3,s.Type2Q4,r.Type2A4,s.Type2Q5,r.Type2A5 
                        FROM results r, surveys s 
                        WHERE r.surveyid=? and s.surveyid=?;");

    // Execute statement and check if true or false
    if ($stmt->execute([$inData["SurveyID"],$inData["SurveyID"]])) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        // Return the array of surveys inside key "Surveys"
        $retValue = '{"Surveys":' . json_encode($data, JSON_PRETTY_PRINT) . ',"error":""}';
        echo $retValue;
    } else {
        $retValue = '{"error":"Could Not Get Survey Results"}';
        echo $retValue;
    }
} catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
}
