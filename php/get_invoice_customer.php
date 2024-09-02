<?php 
include 'db_connection.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => '',
	'cliente' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$idF = $_POST["idF"];
	
    $fetchQuery = "SELECT c.cedula, CONCAT(c.nombreC, ' ', c.apellidoC) AS c.razonSocial
					FROM cliente AS c 
					INNER JOIN factura AS f
					ON f.idC = c.idC 
					WHERE f.idF = $idF";
    if ($result = $connection->query($fetchQuery)) {
        while ($row = $result->fetch_assoc()) {
            $response['cliente'] = $row;
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