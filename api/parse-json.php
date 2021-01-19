<?php
function parseJson ($path) {
    $stringContent = file_get_contents($path);
    $jsonContent = json_decode($stringContent, true);
    return $jsonContent;
}