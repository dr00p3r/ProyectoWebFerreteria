<?php
session_start();
header('Content-Type: application/json');

$response = [
    'loggedin' => false,
	'id' => '',
    'usuario' => '',
	'nombre' => '',
	'apellido' => '',
	'rol' => ''
];

if (isset($_SESSION['usuario']) && $_SESSION['loggedin']) {
    $response['loggedin'] = true;
	$response['id'] = $_SESSION['id'];
    $response['usuario'] = $_SESSION['usuario'];
	$response['nombre'] = $_SESSION['nombre'];
	$response['apellido'] = $_SESSION['apellido'];
	$response['rol'] = $_SESSION['rol'];
}

echo json_encode($response);
?>