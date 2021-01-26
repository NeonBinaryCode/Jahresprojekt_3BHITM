<?php
require 'parse-json.php';
require 'file-path.php';

$fn = filePath . 'users.json';

$username = isset($_POST['username']) ? $_POST['username'] : $_POST['email'];
$pwd = isset($_POST['password']) ? $_POST['password'] : false;
$md5 = $pwd != false ? md5($username . $pwd) : $_POST['token'];

$jsonContent = parseJson($fn);


foreach ($jsonContent['users'] as $user) {
    if ($user['name'] == $username || $user['email'] == $username) {
        $currentUser = $user;
    }
}

if (!isset($currentUser)) {
    $res = ['status' => 'fail', 'message' => 'Nutzer existiert nicht'];
} else {
    if ($md5 === md5($currentUser['name'] . $currentUser['password'])) {
        $res = ['token' => $md5, 'status' => 'success'];
    } else {
        $res = ['status' => 'fail', 'message' => 'Falsches Passwort'];
    }
}

echo json_encode($res);
