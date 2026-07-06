<?php

require_once '../../api/db.php';
require_once '../../api/helpers.php';

setHeaders();
$pdo=getPDO();

try{
    $stmt=$pdo->prepare("SELECT * FROM services");
    $stmt->execute();
    $services=$stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($services);
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}