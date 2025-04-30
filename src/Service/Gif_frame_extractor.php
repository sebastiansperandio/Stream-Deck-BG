<?php 
declare(strict_types=1);

namespace SDBG\Service;

use Imagick;
use ImagickException;

/**
 * Class Gif_frame_extractor
 * Extracts each frame of a GIF (coalesced) and saves as PNG.
 */
class Gif_frame_extractor
{
    /**
     * Extracts frames from a GIF file, coalescing them into full-size frames.
     *
     * @param string $gif_path   The path to the GIF file.
     * @param string $frames_dir The directory where frames will be saved.
     *
     * @return array Returns a tuple: [array of frame paths, gif width, gif height].
     * @throws ImagickException
     */
    public function extract_frames(string $gif_path, string $frames_dir): array
    {
        $imagick = new Imagick($gif_path);
        $imagick = $imagick->coalesceImages();

        $frame_paths = [];
        $index = 0;

        foreach ($imagick as $frame) {
            $frame_path = sprintf("%s/frame_%03d.png", $frames_dir, $index);
            $frame->writeImage($frame_path);
            $frame_paths[] = $frame_path;
            $index++;
        }

        // Dimensions from the first frame
        $imagick->setIteratorIndex(0);
        $gif_width = $imagick->getImageWidth();
        $gif_height = $imagick->getImageHeight();

        $imagick->clear();
        $imagick->destroy();

        return [$frame_paths, $gif_width, $gif_height];
    }
}
