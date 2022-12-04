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

  // Create SQL statment
  $sql = "INSERT INTO surveys (CreatorID,Title,Description,StartDate,EndDate,NumType1,NumType2";

  for ($x = 1; $x <= $inData['NumType1']; $x++) {
    $sql .= ",Type1Q{$x}";
  }

  for ($x = 1; $x <= $inData['NumType2']; $x++) {
    $sql .= ",Type2Q{$x}";
  }

  $sql .= ") VALUES (?,?,?,?,?,?,?";

  for ($x = 1; $x <= $inData['NumType1']; $x++) {
    $sql .= ",?";
  }

  for ($x = 1; $x <= $inData['NumType2']; $x++) {
    $sql .= ",?";
  }

  $sql .= ")";

  // Create array of inputs for SQL statment
  $exeSql = [];
  array_push($exeSql, $inData["CreatorID"], $inData["Title"], $inData["Description"], $inData["StartDate"], $inData["EndDate"], $inData["NumType1"], $inData["NumType2"]);

  for ($x = 1; $x <= $inData['NumType1']; $x++) {
    array_push($exeSql, $inData["Type1Q{$x}"]);
  }

  for ($x = 1; $x <= $inData['NumType2']; $x++) {
    array_push($exeSql, $inData["Type2Q{$x}"]);
  }

  $stmt = $db->prepare($sql);

  // Execute statement and check if true or false
  if ($stmt->execute($exeSql)) {

    // Return the if insert succeded
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
