<?php 
include 'db_connection.php';

session_start();

header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST["idR"];
    $nombre = $_POST["nombre"];
    $descripcion = $_POST["descripcion"];
    $accesos = $_POST["strAccesos"];

    $updateQuery = "UPDATE rol SET nombreR = ?, descripcionR = ?, accesosR = ? WHERE idR = ?";
    
    if ($statement = $connection->prepare($updateQuery)) {
        $statement->bind_param("sssi", $nombre, $descripcion, $accesos, $id);

        if ($statement->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = 'Error al ejecutar la consulta: ' . $statement->error;
        }
        
        $statement->close();
    } else {
        $response['error'] = 'Error en la preparación de la consulta: ';
    }
}

echo json_encode($response);
exit;
?>
