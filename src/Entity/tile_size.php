<?php declare(strict_types=1);

namespace SDBG\Entity;

/**
 * Class Tile_size
 * Represents the width/height of a sub-GIF tile.
 */
class Tile_size
{
    /**
     * @var int
     */
    private $width;

    /**
     * @var int
     */
    private $height;

    /**
     * Tile_size constructor.
     *
     * @param int $width  Tile width in pixels.
     * @param int $height Tile height in pixels.
     */
    public function __construct(int $width, int $height)
    {
        $this->width = $width;
        $this->height = $height;
    }

    /**
     * Get tile width.
     *
     * @return int
     */
    public function get_width(): int
    {
        return $this->width;
    }

    /**
     * Get tile height.
     *
     * @return int
     */
    public function get_height(): int
    {
        return $this->height;
    }
}
