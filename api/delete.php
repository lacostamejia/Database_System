<?php
if (isset($_GET["SurveyID"])){
    $SurveyID = $_GET["SurveyID"];

    include_once './Database.php';

    // Instantiate DB & connect
    $database = new Database();
    $db = $database->connect();



    $sql = "DELETE FROM results WHERE SurveyID= $SurveyID";
    $connection->query($sql);

}

header("location: /Database_System/results.html");
exit;
?>