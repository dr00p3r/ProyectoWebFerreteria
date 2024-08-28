<?php
include 'db_connection.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
	'roles' => [],
    'error' => ''
];

$fetchRolesQuery = "SELECT idR, nombreR FROM rol";
$result = $connection->query($fetchRolesQuery);

$roles = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $roles[] = $row;
    }
	$response['success'] = true;
}

$response['roles'] = $roles;
echo json_encode($response);
exit;
?>