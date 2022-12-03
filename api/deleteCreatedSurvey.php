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
  // Get information about the surveys the user has created
  $stmt = $db->prepare("DELETE FROM surveys WHERE SurveyID=?");
  
  // Execute statement and check if true or false
  if ($stmt->execute([$inData["SurveyID"]])) {

    // Return the if delete succeded
    $retValue = '{"Return":' . 1 . ',"error":""}';
    echo $retValue;
  } else {
    $retValue = '{"Return":' . 0 . ',"error":"Delete Failed"}';
    echo $retValue;
  }
} catch (PDOException $e) {
  $retValue = '{"error":"' . $e->getMessage() . '"}';
  echo $retValue;
}
