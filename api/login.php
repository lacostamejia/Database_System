<?php

  // Include database class
  include_once './Database.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();
