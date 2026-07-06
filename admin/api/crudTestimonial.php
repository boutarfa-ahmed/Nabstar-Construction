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
            $stmt = $pdo->prepare("SELECT * FROM testimonials WHERE id=?");
            $stmt->execute([$id]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($data ?: null);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM testimonials ORDER BY created_at DESC");
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
                INSERT INTO testimonials (client_name, company, content, photo, rating, approved)
                VALUES (:client_name, :company, :content, :photo, :rating, :approved)
            ");
            $stmt->execute([
                ":client_name" => $input['client_name'] ?? 'Anonymous',
                ":company" => $input['company'] ?? null,
                ":content" => $input['content'] ?? '',
                ":photo" => $input['photo'] ?? null,
                ":rating" => $input['rating'] ?? 5,
                ":approved" => $input['approved'] ?? 1,
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
                UPDATE testimonials SET client_name=:client_name, company=:company,
                    content=:content, photo=:photo, rating=:rating, approved=:approved
                WHERE id=:id
            ");
            $stmt->execute([
                ":client_name" => $input['client_name'] ?? 'Anonymous',
                ":company" => $input['company'] ?? null,
                ":content" => $input['content'] ?? '',
                ":photo" => $input['photo'] ?? null,
                ":rating" => $input['rating'] ?? 5,
                ":approved" => $input['approved'] ?? 1,
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
        $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method Not Allowed"]);
}
