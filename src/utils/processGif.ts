import { parseGIF, decompressFrames } from 'gifuct-js';
import JSZip from 'jszip';
// @ts-ignore
import GIFEncoder from 'gif-encoder-2';

interface TileLayout {
    rows: number;
    cols: number;
    tileWidth: number;
    tileHeight: number;
}

const getLayout = (model: string): TileLayout => {
    switch (model) {
        case 'mini':
            // 6 buttons: 3x2 (288x192) -> 96x96 per tile
            return { rows: 2, cols: 3, tileWidth: 96, tileHeight: 96 };
        case 'regular':
             // 15 buttons: 5x3 (480x288)
            return { rows: 3, cols: 5, tileWidth: 96, tileHeight: 96 };
        case 'plus':
        case 'neo':
             // 8 buttons: 4x2 (384x192)
            return { rows: 2, cols: 4, tileWidth: 96, tileHeight: 96 };
        case 'xl':
        default:
             // 32 buttons: 8x4 (768x384)
            return { rows: 4, cols: 8, tileWidth: 96, tileHeight: 96 };
    }
};

export const processGif = async (file: File, model: string): Promise<Blob> => {
    const arrayBuffer = await file.arrayBuffer();
    const gif = parseGIF(arrayBuffer);
    const frames = decompressFrames(gif, true);

    const layout = getLayout(model);
    const width = layout.cols * layout.tileWidth;
    const height = layout.rows * layout.tileHeight;

    // Create a main canvas to reconstruct the GIF frames
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    // Create a temporary canvas for frame patch drawing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Could not create temp canvas context');

    // Initialize an encoder for each tile position
    const tileEncoders: GIFEncoder[][] = [];
    for (let r = 0; r < layout.rows; r++) {
        tileEncoders[r] = [];
        for (let c = 0; c < layout.cols; c++) {
            const encoder = new GIFEncoder(layout.tileWidth, layout.tileHeight);
            encoder.start();
            encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
            encoder.setQuality(10); // adjustable quality
            // Apply delay from first frame or keep variable delay?
            // Usually stream deck GIFs have constant framerate, but we can respect source delay.
            tileEncoders[r][c] = encoder;
        }
    }

    // Process each frame
    let frameImageData: ImageData | undefined;

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        
        // Handle disposal method
        // 1: Do not dispose, leave graphic in place
        // 2: Restore to background color
        // 3: Restore to previous
        // implementation simplification: 
        // We accumulate changes on the main canvas.
        // But we need to handle "restore to background" properly if present.
        // For simple GIFs, usually just drawing over works.
        // But for transparency, we need proper disposal. 
        // The `gifuct-js` `decompressFrames` returns raw pixels.
        
        // 1. Prepare frame patch on temp canvas
        const dims = frame.dims;
        if (
            dims.width !== tempCanvas.width || 
            dims.height !== tempCanvas.height
        ) {
            tempCanvas.width = dims.width;
            tempCanvas.height = dims.height;
        }

        // Put image data
        const frameImage = new ImageData(
            new Uint8ClampedArray(frame.patch),
            dims.width,
            dims.height
        );
        tempCtx!.putImageData(frameImage, 0, 0);

        // 2. Composing on main canvas
        // Disposal handling:
        // Before drawing new frame, handle PREVIOUS frame's disposal
        // Simpler approach: if disposal = 2 (restore bg), clearRect previous area.
        const prevFrame = i > 0 ? frames[i - 1] : null;
        if (prevFrame && prevFrame.disposalType === 2) {
             ctx.clearRect(prevFrame.dims.left, prevFrame.dims.top, prevFrame.dims.width, prevFrame.dims.height);
        } else if (prevFrame && prevFrame.disposalType === 3) {
             // restore to previous: complex, need to save state. 
             // many GIFs use 1 or 2. 
        }

        ctx.drawImage(tempCanvas, dims.left, dims.top);

        // 3. Slice into tiles
        for (let r = 0; r < layout.rows; r++) {
            for (let c = 0; c < layout.cols; c++) {
                const tileX = c * layout.tileWidth;
                const tileY = r * layout.tileHeight;
                
                // Extract tile data
                const tileData = ctx.getImageData(tileX, tileY, layout.tileWidth, layout.tileHeight);
                
                const encoder = tileEncoders[r][c];
                encoder.setDelay(frame.delay);
                encoder.addFrame(tileData.data as any /* ImageData.data is Uint8ClampedArray, encoder expects compatible array */);
            }
        }
    }
    
    // Finish all encoders
    const zip = new JSZip();
    const folder = zip.folder(`stream_deck_${model}_tiles`);

    for (let r = 0; r < layout.rows; r++) {
        for (let c = 0; c < layout.cols; c++) {
            const encoder = tileEncoders[r][c];
            encoder.finish();
            const buffer = encoder.out.getData();
            // Naming convention: usually (row, col) or just index.
            // Stream Deck usually expects `icon_R_C.gif` or similar if doing manual layout, 
            // but simple sequential naming is often enough.
            // Let's use `tile_r${r}_c${c}.gif`.
            folder?.file(`tile_r${r + 1}_c${c + 1}.gif`, buffer, { binary: true });
        }
    }

    // Generate zip blob
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return zipBlob;
};
