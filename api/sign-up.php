<?php
require 'parse-json.php';
require 'file-path.php';

$fn = filePath . 'users.json';

$username = $_POST['username'];
$pwd = $_POST['password'];
$email = $_POST['email'];
$md5 = md5($username . $pwd);

$jsonContent = parseJson($fn);

$exists = false;

foreach ($jsonContent['users'] as $user) {
    if ($user['name'] == $username || $user['email'] == $email) {
        $exists = true;
    }
}

if (!$exists) {
    $jsonContent['users'][] = ['password' => $pwd, 'name' => $username, 'email' => $email];

    file_put_contents($fn, json_encode($jsonContent));
    $res = ['token' => $md5, 'status' => 'success'];
} else {
    $res = ['status' => 'fail', 'message' => 'Name oder E-Mail existiert bereits'];
}

echo json_encode($res);
