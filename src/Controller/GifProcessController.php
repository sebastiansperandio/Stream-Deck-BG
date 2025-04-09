<?php 
declare(strict_types=1);

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
     * Dimensions for different Stream Deck models.
     * 'mini' model: 288x192
     * 'regular' model: 480x288
     * 'xl' model: 768x384
     * 'plus' model: 384x192
     * These dimensions are used to determine how to slice the GIF.
     * @var array
     */
    private const MODEL_DIMENSIONS = [
        'mini'    => ['width' => 288, 'height' => 192],
        'regular' => ['width' => 480, 'height' => 288],
        'xl'      => ['width' => 768, 'height' => 384],
        'plus'    => ['width' => 384, 'height' => 192],
    ];

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
     * @param string $model     The model of the Stream Deck (default: 'xl').
     *
     * @return void
     */
    public function process_gif( string $gif_path, string $temp_dir, string $model='xl' ): void
    {
        // 1) Extract frames
        $extractor = new Gif_frame_extractor();
        $frames_dir = $temp_dir . '/frames';
        mkdir($frames_dir, 0777, true);

        [$frame_paths, $gif_width, $gif_height] = $extractor->extract_frames($gif_path, $frames_dir);

        // Validate GIF dimensions based on the selected model
        $expected_dimensions = self::MODEL_DIMENSIONS[$model] ?? null;

        if (!$expected_dimensions) {
            throw new \Exception("Invalid model specified. Please select a valid Stream Deck model.");
        }
    
        if ($gif_width !== $expected_dimensions['width'] || $gif_height !== $expected_dimensions['height']) {
            throw new \Exception(sprintf(
                "Invalid GIF dimensions for model '%s'. Expected %dx%d, but got %dx%d.",
                $model,
                $expected_dimensions['width'],
                $expected_dimensions['height'],
                $gif_width,
                $gif_height
            ));
        }

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
    
        // Start a session to store the download file path and create a unique directory
        session_start();
        $session_id = session_id();
        $user_dir = __DIR__ . '/../../public/downloads/' . $session_id;
        if (!is_dir($user_dir)) {
            mkdir($user_dir, 0777, true);
        }
    
        // Generate a unique filename for the ZIP file
        $unique_id = uniqid('zip_', true);
        $public_zip_path = $user_dir . '/' . $unique_id . '.zip';
    
        // Copy the ZIP file to the public directory
        copy($zip_path, $public_zip_path);
    
        // Set the download file path in the session
        $_SESSION['download_file'] = '/public/downloads/' . $session_id . '/' . $unique_id . '.zip';
        
        // Remove tmp directory
        $this->remove_directory_recursive($temp_dir);
    
        // Redirect to the success page
        header('Location: /?action=success');
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
