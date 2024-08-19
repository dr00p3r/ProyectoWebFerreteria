<?php 
include 'db_connection.php';

session_start();

header('Content-Type: application/json');

$response = [
    'success' => false,
	'invalidUsuario' => false,
    'error' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombreUsuario = $_POST["nombreUsuario"];
	
	// Verificar si la cedula ya existe
    $checkQuery = "SELECT COUNT(*) FROM usuario WHERE nombreUsuario = ?";
    if ($statement = $connection->prepare($checkQuery)) {
        $statement->bind_param("s", $nombreUsuario);
        $statement->execute();
        $statement->bind_result($userCount);
        $statement->fetch();
        $statement->close();

        if ($userCount > 0) {
            $response['invalidUsuario'] = true;
			echo json_encode($response);
			exit;
        }
    } else {
        $response['error'] = 'Error en la verificación del nombre de usuario.';
		echo json_encode($response);
		exit;
    }
    
	$response['success'] = true;
    echo json_encode($response);
    exit;
}
?>
