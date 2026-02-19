<?php
declare(strict_types=1);

namespace SDBG\Service;

/**
 * Class GifsicleService
 * Handles GIF processing using the gifsicle command-line tool.
 */
class GifsicleService
{
    private string $gifsicle_path;

    public function __construct()
    {
        // In Vercel, we copy the binary to the same directory as index.php (api/)
        $vercel_path = __DIR__ . '/../../api/gifsicle';

        // Local node_modules path
        $local_npm_path = __DIR__ . '/../../node_modules/.bin/gifsicle';
        
        if (file_exists($vercel_path)) {
            $this->gifsicle_path = $vercel_path;
            // Ensure it's executable
            chmod($this->gifsicle_path, 0755);
        } elseif (file_exists($local_npm_path)) {
            $this->gifsicle_path = $local_npm_path;
        } else {
            // Fallback to system path
            $this->gifsicle_path = 'gifsicle';
        }
    }

    /**
     * Slices the GIF into tiles.
     * 
     * @param string $input_gif Path to the input GIF.
     * @param string $output_dir Directory to save the slices.
     * @param int $rows Number of rows (e.g., 2).
     * @param int $cols Number of columns (e.g., 3, 4, 8).
     * @param int $tile_width Width of each tile (e.g., 96).
     * @param int $tile_height Height of each tile (e.g., 96).
     * 
     * @return void
     * @throws \Exception
     */
    public function slice_gif(string $input_gif, string $output_dir, int $rows, int $cols, int $tile_width, int $tile_height): void
    {
        // Resize/Crop the input GIF first? 
        // The original logic checked dimensions but didn't resize. We assume input is correct size.
        
        for ($r = 0; $r < $rows; $r++) {
            for ($c = 0; $c < $cols; $c++) {
                $x = $c * $tile_width;
                $y = $r * $tile_height;
                
                $output_file = sprintf('%s/tile_%d_%d.gif', $output_dir, $r, $c);
                
                // Crop command: gifsicle -U --crop X,Y+WIDTHxHEIGHT input.gif -o output.gif
                // -U (unoptimize) is crucial to unroll loops for correct cropping
                $command = sprintf(
                    '%s -U --crop %d,%d+%dx%d "%s" -o "%s"',
                    $this->gifsicle_path,
                    $x,
                    $y,
                    $tile_width,
                    $tile_height,
                    $input_gif,
                    $output_file
                );

                $output = [];
                $return_var = 0;
                exec($command . ' 2>&1', $output, $return_var);

                if ($return_var !== 0) {
                    throw new \Exception("Gifsicle failed: " . implode("\n", $output));
                }
            }
        }
    }

    /**
     * Get GIF dimensions using gifsicle --info
     * 
     * @param string $gif_path
     * @return array [width, height]
     * @throws \Exception
     */
    public function get_dimensions(string $gif_path): array
    {
        $command = sprintf('%s --info "%s"', $this->gifsicle_path, $gif_path);
        $output = [];
        $return_var = 0;
        exec($command, $output, $return_var);

        if ($return_var !== 0) {
            $output_str = implode("\n", $output);
            throw new \Exception(sprintf(
                "Could not read GIF info. Command: %s. Output: %s. Return Var: %d. Binary Exists: %s. Permissions: %s", 
                $command, 
                $output_str, 
                $return_var,
                file_exists($this->gifsicle_path) ? 'Yes' : 'No',
                substr(sprintf('%o', fileperms($this->gifsicle_path)), -4)
            ));
        }

        // Parse output looking for "logical screen WxH"
        // Output example: "  logical screen 288x192"
        foreach ($output as $line) {
            if (preg_match('/logical screen\s+(\d+)x(\d+)/', $line, $matches)) {
                return [
                    'width' => (int)$matches[1],
                    'height' => (int)$matches[2]
                ];
            }
        }

        throw new \Exception("Could not determine GIF dimensions.");
    }
}
