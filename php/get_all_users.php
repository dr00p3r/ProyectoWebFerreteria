<?php 
include 'db_connection.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => '',
    'usuarios' => []
];

// Verificar si la solicitud es GET
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Obtener todos los usuarios
    $fetchQuery = "SELECT idU, nombreU, apellidoU, cedulaU, telefonoU, emailU, nombreUsuario, fechaCreacionU, estadoU FROM usuario";
    if ($result = $connection->query($fetchQuery)) {
        while ($row = $result->fetch_assoc()) {
            $response['usuarios'][] = $row;
        }
        $result->free();
        $response['success'] = true;
    } else {
        $response['error'] = 'Error al obtener la lista de usuarios.';
    }

    echo json_encode($response);
    exit;
} else {
    $response['error'] = 'Método de solicitud no permitido.';
    echo json_encode($response);
    exit;
}
?>