<?php declare(strict_types=1);

namespace SDBG\Controller;

use SDBG\Service\Gif_frame_extractor;
use SDBG\Service\Gif_tile_builder;
use SDBG\Service\Zip_creator;
use SDBG\Entity\Tile_size;

/**
 * Class GifProcessController
 * Orchestrates the extraction, slicing, zipping, and forced download
 * of the resulting sub-GIFs, then cleans up the temp directory.
 */
class GifProcessController
{
    /**
     * Process the uploaded GIF.
     * Steps:
     * 1. Extract frames (coalesce).
     * 2. Build sub-GIF tiles (e.g., 96x96).
     * 3. Zip the sub-GIFs.
     * 4. Force the ZIP download.
     * 5. Remove the temporary directory to save space.
     *
     * @param string $gif_path  Path to the uploaded GIF inside a temp folder.
     * @param string $temp_dir  The folder containing the GIF and where
     *                          we'll store intermediate files.
     *
     * @return void
     */
    public function process_gif(string $gif_path, string $temp_dir): void
    {
        // 1) Extract frames
        $extractor = new Gif_frame_extractor();
        $frames_dir = $temp_dir . '/frames';
        mkdir($frames_dir, 0777, true);

        [$frame_paths, $gif_width, $gif_height] = $extractor->extract_frames($gif_path, $frames_dir);

        // 2) Build sub-GIF tiles
        $segments_dir = $temp_dir . '/segments';
        mkdir($segments_dir, 0777, true);

        // Example tile size (96x96). In the future, you can pick others.
        $tile_size = new Tile_size(96, 96);

        $tile_builder = new Gif_tile_builder();
        $tile_builder->build_subgifs($frame_paths, $gif_width, $gif_height, $tile_size, $segments_dir);

        // 3) Zip the segments
        $zipper = new Zip_creator();
        $zip_path = $zipper->create_zip($segments_dir);

        // 4) Force the ZIP download
        //    We pass $temp_dir so we can remove it after sending the file.
        $this->force_zip_download($zip_path, $temp_dir);
    }

    /**
     * Sends the ZIP file to the browser to trigger a "Save As..." dialog,
     * then removes the temporary directory.
     *
     * @param string $zip_path The path to the zip file.
     * @param string $temp_dir The temporary directory to remove after streaming the file.
     *
     * @return void
     */
    private function force_zip_download(string $zip_path, string $temp_dir): void
    {
        if (!file_exists($zip_path)) {
            exit("Error: ZIP file not found for download.");
        }

        // Ensures the script doesn't end prematurely if the user cancels download
        ignore_user_abort(true);

        // Send headers
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . basename($zip_path) . '"');
        header('Content-Length: ' . filesize($zip_path));

        // Stream the file
        readfile($zip_path);
        flush();

        // Remove the entire temp directory after sending the file
        $this->remove_directory_recursive($temp_dir);

        // End the script
        exit;
    }

    /**
     * Recursively remove all files and sub-directories in $dir, then remove $dir itself.
     *
     * @param string $dir The directory to remove.
     *
     * @return void
     */
    private function remove_directory_recursive(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }

        $items = scandir($dir);
        if ($items === false) {
            return;
        }

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            $path = $dir . DIRECTORY_SEPARATOR . $item;
            if (is_dir($path)) {
                $this->remove_directory_recursive($path);
            } else {
                @unlink($path);
            }
        }

        @rmdir($dir);
    }
}
