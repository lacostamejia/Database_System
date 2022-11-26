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

      $stmt = $db->prepare("INSERT INTO survey (Title,creatorID) VALUES (?,?)");
      $stmt->execute([$inData["Title"], $inData["creatorID"]]);

      $stmt = $db->prepare("SELECT SurveyID,Title,DateCreated,StartDate,EndDate FROM surveys WHERE creatorID=?");
      $stmt->execute([$inData["creatorID"]]);
      $result = $stmt->fetch();
  
      // Return the users first name, last name, and ID.
      $retValue = '{"surveyID":' . $result["surveyID"] . ',"Title":"' . $result["Title"] . '","DateCreated":"' . $result["DateCreated"] . '","error":""}';
      echo $retValue;
  } catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
  }