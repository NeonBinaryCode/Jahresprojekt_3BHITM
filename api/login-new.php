<?php

require 'regex.php';

$db_host = 'localhost';
$db_name = 'lensscape';
$db_username = 'lensscape';
$db_password = 'lensscape';

session_start();
$connection = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($connection->connect_error) {
    die('Database connection failed: ' . $connection->connect_error);
}

$username = isset($_POST['username']) ? $connection->real_escape_string($_POST['username']) : '';
$password = isset($_POST['password']) ? $connection->real_escape_string($_POST['password']) : false;
$email = isset($_POST['email']) ? $connection->real_escape_string($_POST['email']) : '';

if (strlen($username) == 0 && preg_match(emailRegex, $email)) {
    $sql = "SELECT `username` FROM lensscape.user WHERE email='$email' AND user_deleted = 0 LIMIT 1";
    if ($res = $connection->query($sql)) {
        if ($res->num_rows > 0) {
            $username = $res->fetch_assoc();
        } else {
            $answer = ['status' => 'fail', 'message' => 'Falsche E-Mail Adresse'];
        }
        $res->close();
    }
}

$password = 'safer' . $password;

$sql = "SELECT * FROM lensscape.user WHERE username='$username' AND password=md5('$password') AND user_deleted = 0 LIMIT 1";

if ($res = $connection->query($sql)) {
    if ($res->num_rows > 0) {
        $answer = ['message' => 'Login erfolgreich', 'status' => 'success'];
        $_SESSION['login'] = 1;
        $_SESSION['user'] = $res->fetch_assoc();
        $sql = "UPDATE login_username SET last_login=NOW() WHERE id=" . $_SESSION['user']['id'];
        $connection->query($sql);
    } else {
        $answer = ['status' => 'fail', 'message' => 'Falsche Login-Daten'];
    }
    $res->close();
}

$connection->close();

echo json_encode($answer);
