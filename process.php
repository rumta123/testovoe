<?php 
// необходимые HTTP-заголовки
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


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

   // $now = time();
   $now = date("Y-m-d H:i:s");  
  //  $dircreate = date('d-m-Y в H:i',strtotime($all_messages['MessageDate']));
    $sql = $conn -> query ("INSERT INTO users(name, email, otzyv) VALUES ('$name', '$email', '$otzyv')");
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
header('Content-type: application/json');
$json = json_encode($result, JSON_UNESCAPED_UNICODE);
if ($json === false) {
    // Avoid echo of empty string (which is invalid JSON), and
    // JSONify the error message instead:
    $json = json_encode(["jsonError" => json_last_error_msg()]);
    if ($json === false) {
        // This should not happen, but we go all the way now:
        $json = '{"jsonError":"unknown"}';
    }
    // Set HTTP response status code to: 500 - Internal Server Error
    http_response_code(500);
}
echo $json;
?>