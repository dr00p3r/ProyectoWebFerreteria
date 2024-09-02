<?php 
include 'db_connection.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => '',
	'productos' => []
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$idF = $_POST["idF"];
	
    $fetchQuery = "SELECT d.codigoP, p.nombreP, d.cantidadPf, d.precioPf 
					FROM factura AS f 
					INNER JOIN detalle AS d 
					ON f.idF = d.idF 
					INNER JOIN productos AS p
					ON p.idP = d.idP
					WHERE idF = $idF";
    if ($result = $connection->query($fetchQuery)) {
        while ($row = $result->fetch_assoc()) {
            $response['productos'][] = $row;
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