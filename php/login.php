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
					$_SESSION['loggedin'] = true;
					
					$idR = $row['idR'];
					
					$rolQuery = "SELECT accesosR FROM rol WHERE idR = $idR";
					if($resultado = $connection->query($rolQuery)){
						$fila_accesos = $resultado->fetch_assoc();
						$accesosArray = explode(',', $fila_accesos['accesosR']);
						$_SESSION['accesos'] = $accesosArray;
						$response['success'] = true;
					}
					else{
						$response['error'] = 'Error al asignar un rol al usuario.';
					}
        				
					
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
