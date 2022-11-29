<?php
if (isset($_GET["SurveyID"])){
    $SurveyID = $_GET["SurveyID"];

    include_once './Database.php';

    // Instantiate DB & connect
    $database = new Database();
    $db = $database->connect();

    // Headers
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
    header('Content-Type: application/json');

    $sql = "DELETE FROM results WHERE SurveyID= $SurveyID";
    $connection->query($sql);

}

header("location: /Database_System/results.html");
exit;
?>