<?php 
declare(strict_types=1);

use SDBG\Controller\UploadController;

require_once __DIR__ . '/vendor/autoload.php';

// Increase memory/time if needed for large GIFs:
ini_set('memory_limit', '1024M');
ini_set('max_execution_time', '300');

// Decide which "action" to perform:
$action = $_GET['action'] ?? 'show_form';

$upload_controller = new UploadController();

if ( 'upload_gif' === $action && 'POST' === $_SERVER['REQUEST_METHOD'] ) {
    // Process the uploaded file and proceed to the next step
    $upload_controller->handle_upload();
} elseif ( 'download_sample' === $action ) {
    // Download a sample GIF.
    $upload_controller->download_sample();
} else {
    // Show the initial HTML form
    $upload_controller->show_form();
}
