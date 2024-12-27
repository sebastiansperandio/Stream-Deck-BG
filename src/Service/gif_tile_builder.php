<?php 
declare(strict_types=1);

namespace SDBG\Service;

use Imagick;
use SDBG\Entity\Tile_size;

/**
 * Class Gif_tile_builder
 * Builds sub-GIF animations (tiles) from an array of full-frame PNGs.
 */
class Gif_tile_builder
{
    /**
     * Build sub-GIFs of the given tile size from the extracted PNG frames.
     *
     * @param string[]  $frame_paths An array of PNG file paths representing each GIF frame.
     * @param int       $gif_width   The original GIF width.
     * @param int       $gif_height  The original GIF height.
     * @param Tile_size $tile_size   The sub-GIF tile size (width, height).
     * @param string    $segments_dir The directory to save the resulting sub-GIF tiles.
     *
     * @return void
     */
    public function build_subgifs(
        array $frame_paths,
        int $gif_width,
        int $gif_height,
        Tile_size $tile_size,
        string $segments_dir
    ): void {
        $tile_w = $tile_size->get_width();
        $tile_h = $tile_size->get_height();

        $columns = (int) floor($gif_width / $tile_w);
        $rows = (int) floor($gif_height / $tile_h);

        $total_frames = count($frame_paths);

        for ($row = 0; $row < $rows; $row++) {
            for ($col = 0; $col < $columns; $col++) {

                $sub_gif = new Imagick();
                $sub_gif->setFormat('gif');

                for ($f = 0; $f < $total_frames; $f++) {
                    $img = new Imagick($frame_paths[$f]);

                    $x = $col * $tile_w;
                    $y = $row * $tile_h;

                    $img->cropImage($tile_w, $tile_h, $x, $y);
                    $img->setImagePage($tile_w, $tile_h, 0, 0);

                    $sub_gif->addImage($img);

                    // If needed, setImageDelay or Dispose here
                    // e.g. $sub_gif->setImageDelay(5);

                    $img->clear();
                    $img->destroy();
                }

                $tile_name = sprintf("tile_r%d_c%d.gif", $row, $col);
                $output_path = $segments_dir . '/' . $tile_name;
                $sub_gif->writeImages($output_path, true);

                $sub_gif->clear();
                $sub_gif->destroy();
            }
        }
    }
}
