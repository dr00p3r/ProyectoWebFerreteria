<?php 
include 'db_connection_admin.php';

session_start();

header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$id = $_POST["id"];
    $nuevoEstado = $_POST["nuevoEstado"];
    
    $updateQuery = "UPDATE usuario SET estadoU = ? WHERE idU = $id";
    if ($statement = $connection_admin->prepare($updateQuery)) {
        $statement->bind_param("s", $nuevoEstado);

        if ($statement->execute()) {
			$response['success'] = true;
        } else {
            $response['error'] = 'Error al actualizar el usuario.';
        }
        
        $statement->close();
    } else {
        $response['error'] = 'Error en la preparación de la consulta de actualizacion.';
    }
    
    echo json_encode($response);
    exit;
}
?>
