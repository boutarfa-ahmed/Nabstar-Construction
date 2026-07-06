<?php
require_once '../../api/db.php';
require_once '../../api/helpers.php';

setHeaders();

$pdo = getPDO();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM faqs WHERE id=?");
            $stmt->execute([$id]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($data ?: null);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM faqs ORDER BY `order` ASC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input"]);
            exit;
        }
        try {
            $stmt = $pdo->prepare("
                INSERT INTO faqs (question, answer, service_id, `order`)
                VALUES (:question, :answer, :service_id, :order)
            ");
            $stmt->execute([
                ":question" => $input['question'] ?? '',
                ":answer" => $input['answer'] ?? '',
                ":service_id" => $input['service_id'] ?? null,
                ":order" => $input['order'] ?? 0,
            ]);
            echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input || !$id) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input or missing id"]);
            exit;
        }
        try {
            $stmt = $pdo->prepare("
                UPDATE faqs SET question=:question, answer=:answer,
                    service_id=:service_id, `order`=:order
                WHERE id=:id
            ");
            $stmt->execute([
                ":question" => $input['question'] ?? '',
                ":answer" => $input['answer'] ?? '',
                ":service_id" => $input['service_id'] ?? null,
                ":order" => $input['order'] ?? 0,
                ":id" => $id,
            ]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        if (!$id) {
            echo json_encode(["error" => "ID required"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM faqs WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method Not Allowed"]);
}
