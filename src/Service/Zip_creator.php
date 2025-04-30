<?php 
declare(strict_types=1);

namespace SDBG\Service;

use ZipArchive;
use RuntimeException;

/**
 * Class Zip_creator
 * Creates a ZIP file from GIF sub-tiles.
 */
class Zip_creator
{
    /**
     * Create a zip file from all .gif files in $segments_dir.
     *
     * @param string $segments_dir The directory containing sub-GIF tiles.
     *
     * @return string Path to the created ZIP file.
     */
    public function create_zip(string $segments_dir): string
    {
        $zip_path = $segments_dir . '/subgifs.zip';

        $zip = new ZipArchive();
        if ($zip->open($zip_path, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException("Cannot create ZIP file at $zip_path");
        }

        $files = glob($segments_dir . '/*.gif');
        foreach ($files as $file) {
            $local_name = basename($file);
            $zip->addFile($file, $local_name);
        }

        $zip->close();

        return $zip_path;
    }
}
