<?php
declare(strict_types=1);

namespace SDBG\Controller;

/**
 * Class DownloadController
 * Handles the download of files.
 */
class DownloadController
{
    /**
     * Download a file.
     * This method checks if the user has permission to download the file,
     * verifies if the file exists, and then sends it to the browser for download.
     *
     * @return void
     */
    public function download(): void
    {
        session_start();

        // Verify if the user has permission to download the file
        if (!isset($_SESSION['download_file'])) {
            exit("Acceso no autorizado.");
        }

        // InGifProcessController, we store the full absolute path in $_SESSION['download_file']
        $file_path = $_SESSION['download_file'];

        // Check if the file exists
        if (!file_exists($file_path)) {
            exit("Archivo no encontrado.");
        }

        // Set headers to force download
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . basename($file_path) . '"');
        header('Content-Length: ' . filesize($file_path));
        header('Content-Transfer-Encoding: binary');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');

        readfile($file_path);

        exit;
    }
}