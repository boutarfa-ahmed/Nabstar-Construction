<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db.php';
require_once 'helpers.php';

setHeaders();

try {
    [$offset, $limit] = getPaginationParams(6, 100);
    $pdo = getPDO();

    $stmt = $pdo->prepare("
        SELECT title, bio, location, `total-area` as total_area,
               duration, YEAR(`date-beg`) as date_beg, YEAR(`date-fin`) as date_fin, image
        FROM works
        ORDER BY `date-beg` DESC
        LIMIT :limit OFFSET :offset
    ");
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $works = $stmt->fetchAll();

    $total = $pdo->query("SELECT COUNT(*) FROM works")->fetchColumn();

    echo json_encode([
        'success' => true,
        'data' => $works,
        'pagination' => [
            'offset' => $offset,
            'limit' => $limit,
            'total' => (int)$total
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
