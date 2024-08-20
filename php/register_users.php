<?php 
include 'db_connection_admin.php';

session_start();

header('Content-Type: application/json');

$response = [
    'success' => false,
	'invalidCedula' => false,
    'error' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    $cedula = $_POST["cedula"];
    $telefono = $_POST["telefono"];
	$email = $_POST["email"];
	$usuario = $_POST["usuario"];
    $password = $_POST["password"];
	$rol = $_POST["rol"];
	$fechaNacimiento = $_POST["fechaNacimiento"];
	$estadoCivil = $_POST["estadoCivil"];
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
	// Verificar si la cedula ya existe
    $checkQuery = "SELECT COUNT(*) FROM usuario WHERE cedulaU = ?";
    if ($statement = $connection_admin->prepare(checkQuery)) {
        $statement->bind_param("s", $cedula);
        $statement->execute();
        $statement->bind_result($userCount);
        $statement->fetch();
        $statement->close();

        if ($userCount > 0) {
            $response['invalidCedula'] = true;
			echo json_encode($response);
			exit;
        }
    } else {
        $response['error'] = 'Error en la verificación de la cedula.';
    }
	
    // Insertar el nuevo usuario
    $registerQuery = "INSERT INTO usuario (nombreU, apellidoU, cedulaU, telefonoU, emailU, nombreUsuario, passwordU, rolU, fechaNacimientoU, estadoCivilU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    if ($statement = $connection_admin->prepare($registerQuery)) {
        $statement->bind_param("sssssssss", $nombre, $apellido, $cedula, $telefono, $email, $usuario, $estadoCivil, $estadoCivil, $hashedPassword, $rol);

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
