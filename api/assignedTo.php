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

  // Get the userid based on the email that is sent
  $stmt = $db->prepare("SELECT UserID FROM users WHERE Email=?");

  // Execute statement and check if true or false
  if ($stmt->execute([$inData["Email"]])) {
    // Get the userid
    $userID = $stmt->fetch(PDO::FETCH_ASSOC);
  } else {
    $retValue = '{"error":"Could Not Assign Survey"}';
    echo $retValue;
  }

  // Insert into assigned to with the userid and surveyid
  $stmt = $db->prepare("INSERT INTO assigned_to (SurveyID,UserID) VALUES (?,?)");

  // Execute statement and check if succeded
  if ($stmt->execute([$inData["SurveyID"], $userID])) {
    $retValue = '{"Return":' . 1 . ', "error":""}';
    echo $retValue;
  } else {
    $retValue = '{"error":"Could Not Assign Survey"}';
    echo $retValue;
  }
} catch (PDOException $e) {
  $retValue = '{"error":"' . $e->getMessage() . '"}';
  echo $retValue;
}
