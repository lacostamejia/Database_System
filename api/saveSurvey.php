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
        $retValue = '{"error":"Could Not Save Survey"}';
        echo $retValue;
    }

    // Save the survey answers to the assigned_to table
    $sql = "UPDATE assigned_to SET ";

    for ($x = 1; $x <= $numType1; $x++) {
        $sql .= "Type1A{$x}=?,";
    }

    for ($x = 1; $x <= $numType2; $x++) {
        $sql .= "Type2A{$x}=?,";
    }

    $sql = substr($sql, 0, -1);
    $sql .= " WHERE SurveyID=? AND UserID=?";

    // Create array of inputs for SQL statment
    $exeSql = [];

    for ($x = 1; $x <= $numType1; $x++) {
        array_push($exeSql, $inData["Type1A{$x}"]);
    }

    for ($x = 1; $x <= $numType2; $x++) {
        array_push($exeSql, $inData["Type2A{$x}"]);
    }

    array_push($exeSql, $inData["SurveyID"], $inData["UserID"]);

    $stmt = $db->prepare($sql);

    // Execute statement and check if true or false
    if ($stmt->execute($exeSql)) {
        // Return the if save succeded
        $retValue = '{"Return":' . 1 . ',"error":""}';
        echo $retValue;
    } else {
        $retValue = '{"Return":' . 0 . ',"error":"Could Not Save Survey"}';
        echo $retValue;
    }
} catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
}
