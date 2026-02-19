import JSZip from 'jszip';
import { TileData } from './processGif';

/**
 * Package tile data into a simple ZIP file of GIFs.
 */
export const createTilesZip = async (tiles: TileData[], model: string): Promise<Blob> => {
    const zip = new JSZip();
    const folder = zip.folder(`stream_deck_${model}_tiles`);

    for (const tile of tiles) {
        const filename = `tile_r${tile.row + 1}_c${tile.col + 1}.gif`;
        folder?.file(filename, tile.buffer, { binary: true });
    }

    return zip.generateAsync({ type: 'blob' });
};
