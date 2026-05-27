import { parseGIF, decompressFrames } from 'gifuct-js';
// @ts-ignore
import GIFEncoder from 'gif-encoder-2';

export interface TileData {
    row: number;       // 0-indexed (-1 for the screen region on composite devices)
    col: number;       // 0-indexed (-1 for the screen region on composite devices)
    width: number;     // pixel width of this region
    height: number;    // pixel height of this region
    buffer: Uint8Array;
    name?: string;     // optional filename override (e.g., 'screen')
}

export interface LayoutConfig {
    rows: number;
    cols: number;
    tileWidth: number;
    tileHeight: number;
    /** Optional screen region on top of the button grid (e.g., Corsair Galleon 100 SD). */
    screenHeight?: number;
}

/**
 * Total expected GIF size for a model: button grid + optional top screen.
 */
export const getExpectedGifSize = (model: string): { width: number; height: number } => {
    const layout = getLayout(model);
    return {
        width: layout.cols * layout.tileWidth,
        height: layout.rows * layout.tileHeight + (layout.screenHeight ?? 0),
    };
};

export const getLayout = (model: string): LayoutConfig => {
    switch (model) {
        case 'mini':
            return { rows: 2, cols: 3, tileWidth: 96, tileHeight: 96 };
        case 'regular':
            return { rows: 3, cols: 5, tileWidth: 96, tileHeight: 96 };
        case 'plus':
        case 'neo':
            return { rows: 2, cols: 4, tileWidth: 96, tileHeight: 96 };
        case 'corsair':
            // Corsair Galleon 100 SD: 192-px tall screen on top, then a 4×3 button grid.
            return { rows: 4, cols: 3, tileWidth: 96, tileHeight: 96, screenHeight: 192 };
        case 'xl':
        default:
            return { rows: 4, cols: 8, tileWidth: 96, tileHeight: 96 };
    }
};

/**
 * Decode a GIF file and slice it into individual animated GIFs.
 *
 * For standard Stream Decks: produces one GIF per button tile (rows × cols).
 * For composite devices (e.g., Corsair Galleon 100 SD): also produces one extra GIF
 * for the top screen region above the button grid.
 */
export const processGif = async (file: File, model: string): Promise<TileData[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const gif = parseGIF(arrayBuffer);
    const frames = decompressFrames(gif, true);

    const layout = getLayout(model);
    const gridWidth = layout.cols * layout.tileWidth;
    const gridHeight = layout.rows * layout.tileHeight;
    const screenHeight = layout.screenHeight ?? 0;
    const screenWidth = screenHeight > 0 ? gridWidth : 0;
    const totalHeight = gridHeight + screenHeight;

    const canvas = document.createElement('canvas');
    canvas.width = gridWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d')!;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;

    // Initialize encoders for each button tile
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

    // Optional encoder for the top screen region (single, non-sliced)
    let screenEncoder: GIFEncoder | null = null;
    if (screenHeight > 0) {
        screenEncoder = new GIFEncoder(screenWidth, screenHeight);
        screenEncoder.start();
        screenEncoder.setRepeat(0);
        screenEncoder.setQuality(10);
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

        // Capture screen region (top of source GIF)
        if (screenEncoder) {
            const screenData = ctx.getImageData(0, 0, screenWidth, screenHeight);
            screenEncoder.setDelay(frame.delay);
            screenEncoder.addFrame(screenData.data as any);
        }

        // Capture button tiles (offset by screenHeight if present)
        for (let r = 0; r < layout.rows; r++) {
            for (let c = 0; c < layout.cols; c++) {
                const tileX = c * layout.tileWidth;
                const tileY = screenHeight + r * layout.tileHeight;
                const tileData = ctx.getImageData(tileX, tileY, layout.tileWidth, layout.tileHeight);
                const encoder = tileEncoders[r][c];
                encoder.setDelay(frame.delay);
                encoder.addFrame(tileData.data as any);
            }
        }
    }

    // Collect all results
    const tiles: TileData[] = [];

    if (screenEncoder) {
        screenEncoder.finish();
        const buffer: Uint8Array = screenEncoder.out.getData();
        tiles.push({
            row: -1,
            col: -1,
            width: screenWidth,
            height: screenHeight,
            buffer,
            name: 'screen',
        });
    }

    for (let r = 0; r < layout.rows; r++) {
        for (let c = 0; c < layout.cols; c++) {
            tileEncoders[r][c].finish();
            const buffer: Uint8Array = tileEncoders[r][c].out.getData();
            tiles.push({
                row: r,
                col: c,
                width: layout.tileWidth,
                height: layout.tileHeight,
                buffer,
            });
        }
    }

    return tiles;
};
