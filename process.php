﻿<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli('localhost', 'rum44', 'cg.g[uk/T3e_', 'rum44_test');
if ($conn-> connect_error){
    mysqli_set_charset($conn, "utf8") or die("Не установлена кодировка соединения");
    die("connect error".$conn-> connect_error);
   
}

$result = array('error'=> false );
$action ='';

if(isset($_GET['action'])){
    $action = $_GET['action'];
}
if (true){
    $sql = $conn -> query ("select id, fio, DATE_FORMAT(userdate, '%Y-%m-%d')  from users");
    $users = array();
    while ($row = $sql->fetch_assoc()){
        array_push($users, $row);
    }
       

    $result['users'] =$users;


}
echo json_encode ($result);

?>