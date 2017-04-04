<?php
 session_start(); 
 
/*   LOCAL MCM CREDENTIALS */
    $servername     = 'localhost';
    $user           = 'root';
    $password       = 'root';
    $db             = 'mywebcreationsdb';
    $port           = 8889;

    // Create connection
    $conn = new mysqli($servername, $user, $password, $db);
    //mysqli_set_charset($conn,'utf8');

    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }else{
      $data               = file_get_contents("php://input");
      $dataJsonDecode     = json_decode($data);
      $method             = $_SERVER['REQUEST_METHOD'];

      $memberId           = $dataJsonDecode->memberId;
      $firstName          = $dataJsonDecode->firstName;
      $lastName           = $dataJsonDecode->lastName;
      $phone              = $dataJsonDecode->phone;
      $email              = $dataJsonDecode->email;
      $status              = $dataJsonDecode->status;
      $password           = $dataJsonDecode->password;

      if(!empty($_GET["functionName"])){
          $functionName           = $_GET["functionName"];
      }
      if(!empty($_GET["memberId"])){
          $memberId           = $_GET["memberId"];
      }else{
        $memberId           = $dataJsonDecode->memberId;
      }

      // create SQL based on HTTP method
      switch ($method) {
        case 'GET':
          $query              = "SELECT memberId, firstName, lastName, phone, email, status FROM member"; 
          break;
        case 'PUT':
          $query              = "UPDATE member SET firstName='$firstName', lastName='$lastName' , phone='$phone', email='$email', status='$status' WHERE memberId = '$memberId'";
          break;
        case 'POST':
          if($functionName  == 'VERIFY_MEMBER'){
            $query             = "SELECT memberId, firstName, lastName, phone, email, status FROM member WHERE email='$email' AND password = '$password'";
          }else{
            $query             = "INSERT into member(firstName, lastName, email, status, phone) VALUES ('$firstName' , '$lastName', '$email', '$status', $phone')";
          }
          break;
        case 'DELETE':
        echo "DeleteThisMember" . $memberId ;
            $query             =  "DELETE FROM member WHERE memberId = '$memberId'";
          break;
      }

      // excecute SQL statement
      $result = mysqli_query($conn, $query);
       //$result = false;
      // die if SQL statement failed
      if (!$result) {
        http_response_code(404);
        die(mysqli_error());
      }else{

        switch ($method) {
          case 'GET':
            $arr    = array();
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $arr[] = $row;
                }
                echo $json_info = json_encode($arr);
            } else {
                echo "No Result - " . $result->num_rows;
            }
            break;
          case 'POST':
                if($functionName  == 'VERIFY_MEMBER'){
                  //session_destroy();
                  
                  //$sessionID = $session_id();
                  $r=session_id();
                  $_SESSION['token']= $r;
                  $arr    = array();
                  if ($result->num_rows > 0) {
                      while($row = $result->fetch_assoc()) {
                          $arr[] = $row;
                      }
                      $s = array("token"=>$_SESSION['token']);
                      $arr[] = $s;
                      echo $json_info = json_encode($arr);
                  } else {
                      echo "No Result - " . $result->num_rows;
                  }
                }else{
                  echo "DB_SUCCESS";
                }
            break;
          case 'PUT':
                  echo "DB_SUCCESS";
            break;
          case 'DELETE':
                  echo $memberId;
            break;
        }
      }
    }
    // close mysql connection
    $conn->close();
?>