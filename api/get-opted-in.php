<?php
session_start();

$optedIn = isset($_SESSION['user']) ? $_SESSION['user']['opted_in'] : '';

echo $optedIn;
