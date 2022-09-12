<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli('localhost', 'rum44', 'cg.g[uk/T3e_', 'rum44_test');
$conn->set_charset("utf8");
if ($conn-> connect_error){

    die("connect error".$conn-> connect_error);
   
}

$result = array('error'=> false );
$action ='';

if(isset($_GET['action'])){
    $action = $_GET['action'];
}

if ($action == 'read'){
    $sql = $conn -> query ("select * from users");
    $users = array();
    while ($row = $sql->fetch_assoc()){
        array_push($users, $row);
    }
       

    $result['users'] =$users;


}

if ($action == 'create'){
    $name = $_POST('name');
    $email = $_POST('email');
    $otzyv = $_POST('otzyv');
    $ip =  $_SERVER['REMOTE_ADDR'];
   // $now = time();
   $now = date("Y-m-d H:i:s");  
  //  $dircreate = date('d-m-Y в H:i',strtotime($all_messages['MessageDate']));
    $sql = $conn -> query ("INSERT INTO users(name, email, otzyv, userDate, ip) VALUES ('$name', '$email', '$otzyv', '$now', '$ip')");
   if ($sql){
    $result['message'] = 'User added';
   }
   else{
    $result['error'] = true;
    $result['message'] = 'Ошибка пользователь не добавлен';
   }

    $result['users'] =$users;
}


if ($action == 'update'){
    $id = $_POST('id');
    $name = $_POST('name');
    $email = $_POST('email');
    $otzyv = $_POST('otzyv');
    $ip =  $_SERVER['REMOTE_ADDR'];
    $now = time();

    $sql = $conn -> query ("UPDATE users SET name ='$name', email = '$email', otzyv ='$otzyv' WHERE id ='$id' ");
   if ($sql){
    $result['message'] = 'User Update';
   }
   else{
    $result['error'] = true;
    $result['message'] = 'Ошибка пользователь не обновлен';
   }

    $result['users'] =$users;
}


if ($action == 'delete'){
    $id = $_POST('id');
    $name = $_POST('name');
    $email = $_POST('email');
    $otzyv = $_POST('otzyv');
    $ip =  $_SERVER['REMOTE_ADDR'];
    $now = time();

    $sql = $conn -> query ("DELETE from users  WHERE id ='$id' ");
   if ($sql){
    $result['message'] = 'User DELETE';
   }
   else{
    $result['error'] = true;
    $result['message'] = 'Ошибка пользователь не удален';
   }

    $result['users'] =$users;
}
$conn -> close();
echo json_encode($result, JSON_UNESCAPED_UNICODE);;

?>