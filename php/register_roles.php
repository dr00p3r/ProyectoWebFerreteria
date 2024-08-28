<?php 
include 'db_connection.php';

session_start();

header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $descripcion = $_POST["descripcion"];
    $accesos = $_POST["strAccesos"];
    
    $registerQuery = "INSERT INTO rol (nombreR, descripcionR, accesosR) VALUES (?, ?, ?)";
    if ($statement = $connection->prepare($registerQuery)) {
        $statement->bind_param("sss", $nombre, $descripcion, $accesos);

        if ($statement->execute()) {
			$response['success'] = true;
        } else {
            $response['error'] = 'Error al registrar el rol.';
        }
        
        $statement->close();
    } else {
        $response['error'] = 'Error en la preparación de la consulta de registro.';
    }
    
    echo json_encode($response);
    exit;
}
?>