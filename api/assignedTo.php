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

      $stmt = $db->prepare("INSERT INTO assigned_to (SurveyID,UserID) VALUES (?,?)");
      $stmt->execute([$inData["SurveyID"], $inData["UserID"], $inData["Type1"], $inData["Type2"]]);

      $stmt = $db->prepare("SELECT UserID FROM assigned_to WHERE SurveyID=?");
      $stmt->execute([$inData["SurveyID"]]);
      $result = $stmt->fetch();
  
      // Return the users first name, last name, and ID.
      $retValue = '{"surveyID":' . $result["surveyID"] . ',"UserID":"' . $result["userID"] . '","DateCreated":"' . $result["DateCreated"] . '","error":""}';
      echo $retValue;
  } catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
  }
