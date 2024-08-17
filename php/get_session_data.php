<?php
session_start();
header('Content-Type: application/json');

$response = [
    'loggedin' => false,
    'username' => '',
	'nombre' => '',
	'apellido' => '',
	'rol' => ''
];

if (isset($_SESSION['username']) && $_SESSION['loggedin']) {
    $response['loggedin'] = true;
    $response['username'] = $_SESSION['username'];
	$response['nombre'] = $_SESSION['nombre'];
	$response['apellido'] = $_SESSION['apellido'];
	$response['rol'] = $_SESSION['rol'];
	
}

echo json_encode($response);
?>