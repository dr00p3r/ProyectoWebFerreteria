<?php 
include 'db_connection.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => '',
	'datosEmpresa' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	
    $fetchQuery = "SELECT * FROM empresa";
    if ($result = $connection->query($fetchQuery)) {
        while ($row = $result->fetch_assoc()) {
            $response['datosEmpresa'] = $row;
        }
        $result->free();
        $response['success'] = true;
    } else {
        $response['error'] = 'Error al obtener la lista de productos.';
    }

    echo json_encode($response);
    exit;
} else {
    $response['error'] = 'Método de solicitud no permitido.';
    echo json_encode($response);
    exit;
}
?>