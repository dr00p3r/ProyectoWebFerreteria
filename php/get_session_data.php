<?php
include 'db_connection.php';
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
	$idU = $_SESSION['id'];
    $response['usuario'] = $_SESSION['usuario'];
	$response['nombre'] = $_SESSION['nombre'];
	$response['apellido'] = $_SESSION['apellido'];
	
	$rolQuery = "SELECT accesosR FROM rol WHERE idR = (SELECT idR FROM usuario WHERE idU = $idU)";
	if($resultado = $connection->query($rolQuery)){
		$fila_accesos = $resultado->fetch_assoc();
		$accesosArray = explode(',', $fila_accesos['accesosR']);
		$_SESSION['accesos'] = $accesosArray;
	}
	
	$response['accesos'] = $_SESSION['accesos'];
}

echo json_encode($response);
?>