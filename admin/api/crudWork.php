<?php
require_once '../../api/db.php';
require_once '../../api/helpers.php';

setHeaders();

$pdo = getPDO();
$methode = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch($methode) {
    case 'GET':
        if($id){
            $stmt = $pdo->prepare("SELECT * FROM works WHERE id=?");
            $stmt->execute([$id]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM works");
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
                INSERT INTO works (title, bio, image, location, `total-area`, duration, `date-beg`, `date-fin`) 
                VALUES (:title, :bio, :image, :location, :total_area, :duration, :date_beg, :date_fin)
            ");

            $stmt->execute([
                ":title" => $input['title'] ?? null,
                ":bio" => $input['bio'] ?? null,
                ":image" => $input['image'] ?? null,
                ":location" => $input['location'] ?? null,
                ":total_area" => $input['total_area'] ?? null,
                ":duration" => $input['duration'] ?? null,
                ":date_beg" => $input['date_beg'] ?? null,
                ":date_fin" => $input['date_fin'] ?? null
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

    case 'DELETE':
        if(!$id){
            echo json_encode(["error"=>"ID required"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM works WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error"=>"Method Not Allowed"]);
        break;
}
