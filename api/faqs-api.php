<?php
require_once 'db.php';
require_once 'helpers.php';

setHeaders();

try{
    $pdo=getPDO();

    $stmt = $pdo->prepare( "
        SELECT id,question,answer,service_id,`order` 
        FROM faqs
    ");
    $stmt->execute();

    $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' =>true,
        'data'=> $faqs
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>