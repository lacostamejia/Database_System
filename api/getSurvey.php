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

    $numType1 = 0;
    $numType2 = 0;
    // Get the number of type1 and type 2 questions from survey
    $stmt = $db->prepare("SELECT NumType1,NumType2 FROM surveys WHERE SurveyID=?");

    // Execute query and pass if true
    if ($stmt->execute([$inData["SurveyID"]])) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $numType1 = $row["NumType1"];
        $numType2 = $row["NumType2"];
    } else {
        $retValue = '{"error":"Could Not Get Survey"}';
        echo $retValue;
    }

    // Get the questions from the survey also the saved questions
    $sql = "SELECT s.Title,s.Description,s.StartDate,s.EndDate,s.NumType1,s.NumType2";

    for ($x = 1; $x <= $numType1; $x++) {
        $sql .= ",s.Type1Q{$x}";
        $sql .= ",a.Type1A{$x}";
    }

    for ($x = 1; $x <= $numType2; $x++) {
        $sql .= ",s.Type2Q{$x}";
        $sql .= ",a.Type2A{$x}";
    }

    $sql .= " FROM surveys s, assigned_to a WHERE s.SurveyID=? AND a.UserID=?";

    $stmt = $db->prepare($sql);

    // Execute statement and check if true or false
    if ($stmt->execute([$inData["SurveyID"], $inData["UserID"]])) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        // Return the surveys
        $retValue = '';
        $retValue .= json_encode($row, JSON_PRETTY_PRINT);
        $retValue = substr($retValue, 0, -1);
        $retValue .= ',"error":""}';
        echo $retValue;
    } else {
        $retValue = '{"error":"Could Not Get Survey"}';
        echo $retValue;
    }
} catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
}
