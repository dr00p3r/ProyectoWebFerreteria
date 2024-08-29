<?php 
include 'db_connection.php';
header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => '',
    'roles' => []
];

// Verificar si la solicitud es GET
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Obtener todos los usuarios
    $fetchQuery = "SELECT idR, nombreR, descripcionR, accesosR, estadoR FROM rol";
    if ($result = $connection->query($fetchQuery)) {
        while ($row = $result->fetch_assoc()) {
            $response['roles'][] = $row;
        }
        $result->free();
        $response['success'] = true;
    } else {
        $response['error'] = 'Error al obtener la lista de roles.';
    }

    echo json_encode($response);
    exit;
} else {
    $response['error'] = 'Método de solicitud no permitido.';
    echo json_encode($response);
    exit;
}
?>