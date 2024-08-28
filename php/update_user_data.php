<?php 
include 'db_connection.php';

session_start();

header('Content-Type: application/json');

$response = [
    'success' => false,
    'error' => ''
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST["editId"];
    $nombre = $_POST["editNombre"];
    $apellido = $_POST["editApellido"];
    $estadoCivil = $_POST["editEstadoCivil"];
    $fechaNacimiento = $_POST["editFechaNacimiento"];
    $telefono = $_POST["editTelefono"];
    $email = $_POST["editEmail"];
    $rol = $_POST["editRol"];
	$response['error'] = $id . $telefono . $estadoCivil;

    $updateQuery = "UPDATE usuario SET nombreU = ?, apellidoU = ?, estadoCivilU = ?, fechaNacimientoU = ?, telefonoU = ?, emailU = ?, rolU = ? WHERE idU = ?";
    
    if ($statement = $connection->prepare($updateQuery)) {
        $statement->bind_param("sssssssi", $nombre, $apellido, $estadoCivil, $fechaNacimiento, $telefono, $email, $rol, $id);

        if ($statement->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = 'Error al ejecutar la consulta: ' . $statement->error;
        }
        
        $statement->close();
    } else {
        $response['error'] = 'Error en la preparación de la consulta: ' . $connection_admin->error;
    }
}

echo json_encode($response);
exit;
?>
