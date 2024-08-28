<?php 
include 'db_connection.php';

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
    $fechaNacimiento = $_POST["fecha-nacimiento"];
    $estadoCivil = $_POST["estadoCivil"];
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Verificar si la cédula ya existe
    $checkQuery = "SELECT COUNT(*) FROM usuario WHERE cedulaU = ?";
    if ($statement = $connection->prepare($checkQuery)) {
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
        $response['error'] = 'Error en la verificación de la cédula.';
        echo json_encode($response);
        exit;
    }
    
    $registerQuery = "INSERT INTO usuario (nombreU, apellidoU, cedulaU, telefonoU, emailU, nombreUsuario, passwordU, fechaNacimientoU, estadoCivilU, idR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    if ($statement = $connection->prepare($registerQuery)) {
        $statement->bind_param("sssssssssi", $nombre, $apellido, $cedula, $telefono, $email, $usuario, $hashedPassword, $fechaNacimiento, $estadoCivil, $rol);

        if ($statement->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = 'Error al registrar el usuario.' . $statement->error . $usuario;
        }
        
        $statement->close();
    } else {
        $response['error'] = 'Error en la preparación de la consulta de registro.';
    }
    
    echo json_encode($response);
    exit;
}
?>
