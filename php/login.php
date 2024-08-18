<?php 
include 'db_connection.php';

session_start();

header('Content-Type: application/json');

$response = [
    'success' => false,
    'invalidUser' => false,
    'invalidPassword' => false,
    'error' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["usuario"];
    $password = $_POST["password"];
    
    $loginQuery = "SELECT * FROM usuario WHERE nombreUsuario = ?";
    if ($statement = $connection->prepare($loginQuery)) {
        $statement->bind_param("s", $username);

        if ($statement->execute()) {
            $result = $statement->get_result();

			if ($result->num_rows === 0) {
				$response['invalidUser'] = true;
				echo json_encode($response);
				exit;
			} else {
				$row = $result->fetch_assoc();
				$storedPassword = $row['passwordU'];

				if (password_verify($password, $storedPassword)) {
					$_SESSION['usuario'] = $username;
					$_SESSION['id'] = $row['idU'];
					$_SESSION['nombre'] = $row['nombreU'];
					$_SESSION['apellido'] = $row['apellidoU'];
					$_SESSION['rol'] = $row['rolU'];
					$_SESSION['loggedin'] = true;
					console.log($_SESSION);
					$response['success'] = true;
				} else {
					$response['invalidPassword'] = true;
				}
			}
        } 
		else {
            $response['error'] = 'Error al buscar el usuario.';
        }
        
        $statement->close();
    } else {
        $response['error'] = 'Error en la preparación de la consulta de registro.';
    }
    
    echo json_encode($response);
    exit;
}
?>
