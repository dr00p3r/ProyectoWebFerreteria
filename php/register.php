<?php 
include 'db_connection.php';

session_start();

header('Content-Type: application/json');

$response = [
    'success' => false,
    'invalidUser' => false,
    'invalidEmail' => false,
    'error' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
	$rol = $_POST["rol"];
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Verificar si el nombre de usuario ya existe
    $checkUserQuery = "SELECT COUNT(*) FROM usuarios WHERE username = ?";
    if ($statement = $connection->prepare($checkUserQuery)) {
        $statement->bind_param("s", $username);
        $statement->execute();
        $statement->bind_result($userCount);
        $statement->fetch();
        $statement->close();

        if ($userCount > 0) {
            $response['invalidUser'] = true;
        }
    } else {
        $response['error'] = 'Error en la verificación del nombre de usuario.';
    }
    
    // Insertar el nuevo usuario
    $registerQuery = "INSERT INTO usuarios (nombreUsuario, nombreU, apellidoU, passwordU, rolU) VALUES (?, ?, ?, ?, ?)";
    if ($statement = $connection->prepare($registerQuery)) {
        $statement->bind_param("sssss", $username, $nombre, $apellido, $hashedPassword, $rol);

        if ($statement->execute()) {
			$response['success'] = true;
        } else {
            $response['error'] = 'Error al registrar el usuario.';
        }
        
        $statement->close();
    } else {
        $response['error'] = 'Error en la preparación de la consulta de registro.';
    }
    
    echo json_encode($response);
    exit;
}
?>
