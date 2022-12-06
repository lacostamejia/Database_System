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

      $stmt = $db->prepare("SELECT SurveyID, DateCreated, Type1, Type2 
      FROM results");
      $stmt->execute([$inData["SurveyID"]]);
      $result = $stmt->fetch();
  
      // Return the users first name, last name, and ID.
      if($result->num_rows>0){
        //output data
        while ($row = $result->fetch_assoc()) {
            echo "SurveyID: " . $row["SurveyID"]. " - DateCreated: " . $row["DateCreated"]. "- Type1 Answers: "
        . $row["Type1"]. "-Type2 Answers: " . $row["Type2"]. "<br>";
        }
       }
       else {
        echo "0 results";
        }
  } catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
  }