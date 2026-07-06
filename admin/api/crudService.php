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
            $stmt = $pdo->prepare("SELECT * FROM services WHERE id=?");
            $stmt->execute([$id]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM services");
            $stmt->execute();
        }
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
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
                INSERT INTO services (name, slug, description, icon)
                VALUES (:name, :slug, :description, :icon)
            ");

            $name = $input['title'] ?? 'Untitled';
            $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9-]+/', '-', $name), '-'));

            $stmt->execute([
                ":name" => $name,
                ":slug" => $slug,
                ":description" => $input['description'] ?? null,
                ":icon" => $input['image'] ?? null,
            ]);

            echo json_encode([
                "success" => true,
                "id" => $pdo->lastInsertId()
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
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
            $name = $input['title'] ?? 'Untitled';
            $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9-]+/', '-', $name), '-'));
            $stmt = $pdo->prepare("
                UPDATE services SET name=:name, slug=:slug, description=:description, icon=:icon
                WHERE id=:id
            ");
            $stmt->execute([
                ":name" => $name,
                ":slug" => $slug,
                ":description" => $input['description'] ?? null,
                ":icon" => $input['image'] ?? null,
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
        $stmt = $pdo->prepare("DELETE FROM services WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method Not Allowed"]);
        break;
}
