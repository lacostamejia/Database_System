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
  // Attempt to find the user matching the given credentials.
  $stmt = $db->prepare("SELECT UserID,FirstName,LastName FROM users WHERE Email=? AND Password=?");
  $stmt->execute([$inData["Email"], $inData["Password"]]);
  $result = $stmt->fetch();

  // Check if returned query is empty
  if (!empty($result)) {
    // Update the DateLastLoggedIn field.
    $updateDate = $db->prepare("UPDATE users SET DateLastLoggedIn=NOW() WHERE UserID=?");
    $updateDate->execute([$result["UserID"]]);

    // Return the users first name, last name, and ID.
    $retValue = '{"UserID":' . $result["UserID"] . ',"FirstName":"' . $result["FirstName"] . '","LastName":"' . $result["LastName"] . '","error":""}';
    echo $retValue;
  } else {
    $retValue = '{"error":"No Records Found"}';
    echo $retValue;
  }
} catch (PDOException $e) {
  $retValue = '{"error":"' . $e->getMessage() . '"}';
  echo $retValue;
}
