import { parseGIF, decompressFrames } from 'gifuct-js';
// @ts-ignore
import GIFEncoder from 'gif-encoder-2';

export interface TileData {
    row: number; // 0-indexed
    col: number; // 0-indexed
    buffer: Uint8Array;
}

export interface LayoutConfig {
    rows: number;
    cols: number;
    tileWidth: number;
    tileHeight: number;
}

export const getLayout = (model: string): LayoutConfig => {
    switch (model) {
        case 'mini':
            return { rows: 2, cols: 3, tileWidth: 96, tileHeight: 96 };
        case 'regular':
            return { rows: 3, cols: 5, tileWidth: 96, tileHeight: 96 };
        case 'plus':
        case 'neo':
            return { rows: 2, cols: 4, tileWidth: 96, tileHeight: 96 };
        case 'xl':
        default:
            return { rows: 4, cols: 8, tileWidth: 96, tileHeight: 96 };
    }
};

/**
 * Decode a GIF file and slice it into individual animated tile GIFs.
 * Returns raw tile data (not packaged into a ZIP).
 */
export const processGif = async (file: File, model: string): Promise<TileData[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const gif = parseGIF(arrayBuffer);
    const frames = decompressFrames(gif, true);

    const layout = getLayout(model);
    const width = layout.cols * layout.tileWidth;
    const height = layout.rows * layout.tileHeight;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;

    // Initialize encoders for each tile
    const tileEncoders: GIFEncoder[][] = [];
    for (let r = 0; r < layout.rows; r++) {
        tileEncoders[r] = [];
        for (let c = 0; c < layout.cols; c++) {
            const encoder = new GIFEncoder(layout.tileWidth, layout.tileHeight);
            encoder.start();
            encoder.setRepeat(0);
            encoder.setQuality(10);
            tileEncoders[r][c] = encoder;
        }
    }

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const dims = frame.dims;

        if (dims.width !== tempCanvas.width || dims.height !== tempCanvas.height) {
            tempCanvas.width = dims.width;
            tempCanvas.height = dims.height;
        }

        const frameImage = new ImageData(
            new Uint8ClampedArray(frame.patch),
            dims.width,
            dims.height
        );
        tempCtx.putImageData(frameImage, 0, 0);

        const prevFrame = i > 0 ? frames[i - 1] : null;
        if (prevFrame && prevFrame.disposalType === 2) {
            ctx.clearRect(prevFrame.dims.left, prevFrame.dims.top, prevFrame.dims.width, prevFrame.dims.height);
        }

        ctx.drawImage(tempCanvas, dims.left, dims.top);

        for (let r = 0; r < layout.rows; r++) {
            for (let c = 0; c < layout.cols; c++) {
                const tileX = c * layout.tileWidth;
                const tileY = r * layout.tileHeight;
                const tileData = ctx.getImageData(tileX, tileY, layout.tileWidth, layout.tileHeight);
                const encoder = tileEncoders[r][c];
                encoder.setDelay(frame.delay);
                encoder.addFrame(tileData.data as any);
            }
        }
    }

    // Finish encoders and collect tile data
    const tiles: TileData[] = [];
    for (let r = 0; r < layout.rows; r++) {
        for (let c = 0; c < layout.cols; c++) {
            tileEncoders[r][c].finish();
            const buffer: Uint8Array = tileEncoders[r][c].out.getData();
            tiles.push({ row: r, col: c, buffer });
        }
    }

    return tiles;
};
