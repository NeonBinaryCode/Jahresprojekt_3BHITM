<?php
require 'parse-json.php';
require 'file-path.php';
require 'regex.php';

$fn = filePath . 'users.json';

$username = isset($_POST['username']) ? $_POST['username'] : $_POST['email'];
$md5 = $_POST['token'];

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
        $res = ['email' => $currentUser['email'], 'status' => 'success'];
        $res['reservations'] = isset($currentUser['reservations']) ? $currentUser['reservations'] : [];
    } else {
        $res = ['status' => 'fail', 'message' => 'Falsches Passwort'];
    }
}

echo json_encode($res);
