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
  $stmt = $db->prepare("SELECT Title,Description,StartDate,EndDate,NumType1,NumType2,SurveyID FROM surveys WHERE CreatorID=?");

  // Execute statement and check if true or false
  if ($stmt->execute([$inData["UserID"]])) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {          
        $data[] = $row;  
   } 
    // Return the array of surveys inside key "Surveys"
    $retValue = '{"Surveys":' . json_encode($data, JSON_PRETTY_PRINT) . ',"error":""}';
    echo json_encode($retValue);
  } else {
    $retValue = '{"error":"No Records Found"}';
    echo $retValue;
  }
} catch (PDOException $e) {
  $retValue = '{"error":"' . $e->getMessage() . '"}';
  echo $retValue;
}