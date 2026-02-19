<?php 
declare(strict_types=1);

use SDBG\Controller\UploadController;
use SDBG\Controller\DownloadController;

require_once __DIR__ . '/../vendor/autoload.php';

// Increase memory/time if needed for large GIFs:
ini_set('memory_limit', '1024M');
ini_set('max_execution_time', '300');

// Decide which "action" to perform:
$action = $_GET['action'] ?? 'show_form';
$upload_controller = new UploadController();

if ( 'upload_gif' === $action && 'POST' === $_SERVER['REQUEST_METHOD'] ) {
    $model = $_POST['model'] ?? 'xl';
    // Process the uploaded file and proceed to the next step
    $upload_controller->handle_upload( $model );
} elseif ( 'download_sample' === $action ) {
    $model  = $_GET['model'] ?? 'xl';
    // Download a sample GIF.
    $upload_controller->download_sample( $model );
} elseif ( 'success' === $action ) {
    $upload_controller->show_success();
} elseif ( 'download' === $action ) {
    $download_controller = new DownloadController();
    $download_controller->download();
} else {
    // Show the initial HTML form
    $upload_controller->show_form();
}
