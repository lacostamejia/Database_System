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

  // Check if the email is in use 
  $checkUser = $db->prepare("SELECT UserID FROM users WHERE Email=?");
  $checkUser->execute([$inData["Email"]]);
  $result = $checkUser->fetchAll();

  // Check if returned query is empty
  if (empty($result)) {

    // Create a user with the given info
    $stmt = $db->prepare("INSERT INTO users (FirstName,LastName,Password,Email) VALUES (?,?,?,?)");
    $stmt->execute([$inData["FirstName"], $inData["LastName"], $inData["Password"], $inData["Email"]]);

    // Get the ID of the newly created user
    $stmt = $db->prepare("SELECT UserID,FirstName,LastName FROM users WHERE Email=? AND Password=?");
    $stmt->execute([$inData["Email"], $inData["Password"]]);
    $result = $stmt->fetch();

    // Return the users first name, last name, and ID.
    $retValue = '{"UserID":' . $result["UserID"] . ',"FirstName":"' . $result["FirstName"] . '","LastName":"' . $result["LastName"] . '","error":""}';
    echo $retValue;
  } else {
    $retValue = '{"error":"Login already in use"}';
    echo $retValue;
  }
} catch (PDOException $e) {
  $retValue = '{"error":"' . $e->getMessage() . '"}';
  echo $retValue;
}
