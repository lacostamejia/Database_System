<?php
  class Database {
    // DB Params
    private $host = 'localhost';
    private $db_name = 'COP4710';
    private $username = 'TheBeast';
    private $password = 'WeLoveCOP4710';
    private $conn;

    // DB Connect
    public function connect() {
      $this->conn = null;

      try { 
        $this->conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db_name, $this->username, $this->password);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      } catch(PDOException $e) {
        $retValue = '{"error":"' . $e->getMessage() . '"}';
        header('Content-type: application/json');
        echo $retValue;
      }

      return $this->conn;
    }
  }
