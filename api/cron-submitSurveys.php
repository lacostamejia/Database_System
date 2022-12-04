<?php

// Setup include for cron since it needs the absolute path
include_once '/var/www/html/api/Database.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Headers
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
header('Content-Type: application/json');

// set timezone to eastern
date_default_timezone_set('America/New_York');

// Convert incoming json to variable
$inData = json_decode(file_get_contents('php://input'), true);

// Try to perfrom the query
try {

    // Get all surveyid's that are past expiration date
    $stmt = $db->query("SELECT SurveyID FROM surveys WHERE EndDate < CURDATE()");

    // Execute query
    $stmt->execute();

    // Get the results
    $result = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

    // Loop through each survey id and submit all results from the assigned_to table
    foreach ($result as $value) {

        // Move the data from assigned_to to results
        $stmt = $db->prepare("INSERT INTO results (SurveyID,Type1A1,Type1A2,Type1A3,Type1A4,Type1A5,Type2A1,Type2A2,Type2A3,Type2A4,Type2A5) 
                                SELECT SurveyID,Type1A1,Type1A2,Type1A3,Type1A4,Type1A5,Type2A1,Type2A2,Type2A3,Type2A4,Type2A5 
                                FROM assigned_to WHERE SurveyID=?");

        $message = '';
        $message .= date("Y-m-d H:i:s");

        // Execute the move
        if ($stmt->execute([$value])) {
            $message .= " move from SurveyID={$value} - succeded";
            $message .= PHP_EOL;
            // error_log($message, 3, "/var/log/database-systems.log");
        } else {
            $message .= " move from SurveyID={$value} - failed";
            // error_log($message, 3, "/var/log/database-systems.log");
        }

        echo $message;
    }

    // Loop through each survey id and delete assigned to
    foreach ($result as $value) {

        // Create statment to delete the surveys that are past expiration date
        $stmt = $db->prepare("DELETE FROM assigned_to WHERE SurveyID=?");

        $message = '';
        $message .= date("Y-m-d H:i:s");

        // Execute the delete
        if ($stmt->execute([$value])) {
            $message .= " delete from SurveyID={$value} - succeded";
            $message .= PHP_EOL;
            // error_log($message, 3, "/var/log/database-systems.log");
        } else {
            $message .= " delete from SurveyID={$value} - failed";
            // error_log($message, 3, "/var/log/database-systems.log");
        }
        echo $message;
    }
} catch (PDOException $e) {
    $retValue = '{"error":"' . $e->getMessage() . '"}';
    echo $retValue;
}
