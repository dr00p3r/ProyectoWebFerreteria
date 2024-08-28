<?php
session_start();
header('Content-Type: application/json');

$response = [
    'loggedin' => false,
	'id' => '',
    'usuario' => '',
	'nombre' => '',
	'apellido' => '',
	'accesos' => []
];

if (isset($_SESSION['usuario']) && $_SESSION['loggedin']) {
    $response['loggedin'] = true;
	$response['id'] = $_SESSION['id'];
    $response['usuario'] = $_SESSION['usuario'];
	$response['nombre'] = $_SESSION['nombre'];
	$response['apellido'] = $_SESSION['apellido'];
	$response['accesos'] = $_SESSION['accesos'];
}

echo json_encode($response);
?>