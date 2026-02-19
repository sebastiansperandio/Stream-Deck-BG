import JSZip from 'jszip';
import { TileData } from './processGif';

/** Generate a UUID v4 */
const uuidv4 = (): string =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

/** Generate a random Elgato-style image filename (26 uppercase alphanumeric chars + Z) */
const genImageName = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 26; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + 'Z';
};

/**
 * Stream Deck hardware model codes (Regulatory Model Numbers).
 * Sources:
 *   - mini:    "20GAI9901" (Stream Deck Mini, confirmed from retail listings)
 *   - regular: "20GAA9901" (Stream Deck MK.2, inferred from naming pattern)
 *   - plus:    "20GBD9901" (Stream Deck +, confirmed from retail listings)
 *   - neo:     "20GBJ9901" (Stream Deck Neo, confirmed from retail listings)
 *   - xl:      "20GAT9901" (Stream Deck XL, confirmed from real .streamDeckProfile)
 *
 * The "20GA/20GB" prefix = newer hardware revision (v7+ software era).
 * "10GA/10GB" = older hardware revision.
 */
const DEVICE_MODELS: Record<string, string> = {
    mini:    '20GAI9901',   // Stream Deck Mini (2×3, 6 buttons)
    regular: '20GAA9901',   // Stream Deck MK.2 (3×5, 15 buttons)
    plus:    '20GBD9901',   // Stream Deck + (2×4, 8 buttons + dials)
    neo:     '20GBJ9901',   // Stream Deck Neo (2×4, 8 buttons)
    xl:      '20GAT9901',   // Stream Deck XL (4×8, 32 buttons) ✓ confirmed
};


/**
 * Generates a `.streamDeckProfile` file using the real Stream Deck v7 format.
 *
 * Reverse-engineered from an actual exported .streamDeckProfile file.
 * Structure:
 *   package.json
 *   Profiles/{PROFILE_UUID}.sdProfile/
 *     manifest.json           (profile metadata: device, name, pages list)
 *     Profiles/
 *       {PAGE_UUID}/
 *         manifest.json       (button layout: Controllers[].Actions)
 *         Images/             (tile GIF files for each button)
 */
export const exportStreamDeckProfile = async (
    tiles: TileData[],
    model: string,
    profileName: string = 'GIF Background'
): Promise<Blob> => {
    const zip = new JSZip();

    // --- Generate UUIDs ---
    const profileUUID    = uuidv4().toUpperCase();
    const pageUUID       = uuidv4();               // lowercase in Pages array
    const emptyPageUUID  = uuidv4();               // used as Default page
    const deviceUUID     = uuidv4();               // placeholder device UUID

    const profileDir = `Profiles/${profileUUID}.sdProfile`;
    const pageDir    = `${profileDir}/Profiles/${pageUUID.toUpperCase()}`;

    // --- Build button actions for the page ---
    const actions: Record<string, object> = {};

    for (const tile of tiles) {
        const key = `${tile.col},${tile.row}`;           // Elgato format: "col,row"
        const imageName = genImageName();
        const imageFile = `${imageName}.gif`;

        actions[key] = {
            ActionID: uuidv4(),
            LinkedTitle: false,
            Name: '',
            Plugin: {
                Name: 'Image',
                UUID: 'com.elgato.streamdeck.profile.rotate',
                Version: '1.0',
            },
            Resources: null,
            Settings: {},
            State: 0,
            States: [
                {
                    Image: `Images/${imageFile}`,
                },
            ],
            UUID: 'com.elgato.streamdeck.profile.rotate',
        };

        // Store GIF tile in Images/ folder
        zip.file(`${pageDir}/Images/${imageFile}`, tile.buffer, { binary: true });
    }

    // --- Page manifest (contains the button actions) ---
    zip.file(
        `${pageDir}/manifest.json`,
        JSON.stringify({
            Controllers: [
                {
                    Actions: actions,
                    Type: 'Keypad',
                },
            ],
            Icon: '',
            Name: profileName,
        })
    );

    // --- Empty default page (required by the format) ---
    const emptyPageDir = `${profileDir}/Profiles/${emptyPageUUID.toUpperCase()}`;
    zip.file(
        `${emptyPageDir}/manifest.json`,
        JSON.stringify({
            Controllers: [{ Actions: null, Type: 'Keypad' }],
            Icon: '',
            Name: '',
        })
    );

    // --- Profile-level manifest ---
    zip.file(
        `${profileDir}/manifest.json`,
        JSON.stringify({
            AppIdentifier: '*',
            Device: {
                Model: DEVICE_MODELS[model] ?? DEVICE_MODELS.regular,
                UUID: deviceUUID,
            },
            Name: profileName,
            Pages: {
                Current: '00000000-0000-0000-0000-000000000000',
                Default: emptyPageUUID,
                Pages: [pageUUID],
            },
            Version: '3.0',
        })
    );

    // --- Root package.json (format metadata) ---
    zip.file(
        'package.json',
        JSON.stringify({
            AppVersion: '7.2.1.22472',
            DeviceModel: DEVICE_MODELS[model] ?? DEVICE_MODELS.regular,
            DeviceSettings: null,
            FormatVersion: 1,
            OSType: 'macOS',
            OSVersion: '26.3.0',
            RequiredPlugins: ['com.elgato.streamdeck.profile.rotate'],
        })
    );

    return zip.generateAsync({ type: 'blob' });
};
