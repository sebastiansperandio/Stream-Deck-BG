/**
 * Device metadata used both at runtime (model picker) and at build time for
 * generating per-device SEO landing pages under /[device].
 *
 * Each entry produces a unique landing page targeting long-tail searches such as
 * "stream deck mini gif background" or "corsair galleon 100 sd animated background".
 */

export interface DeviceFAQ {
  q: string;
  a: string;
}

export interface DeviceData {
  /** URL slug used for the SEO landing page route (e.g. "/stream-deck-mini"). */
  slug: string;
  /** Full display name. */
  name: string;
  /** Short name used in compact spaces. */
  shortName: string;
  /** Matches the ModelType used by the slicer (mini / regular / plus / xl / corsair). */
  modelId: string;
  /** Manufacturer for SEO context. */
  manufacturer: "Elgato" | "Corsair";
  /** Total button count. */
  buttons: number;
  rows: number;
  cols: number;
  /** Required GIF dimensions. */
  gifWidth: number;
  gifHeight: number;
  /** True if the device also has a non-grid screen region (Corsair Galleon). */
  hasScreen: boolean;
  /** Whether the slicer exports a .streamDeckProfile for this device. */
  exportsProfile: boolean;
  /** SEO title (50-65 chars ideal). */
  metaTitle: string;
  /** SEO description (140-160 chars ideal). */
  metaDescription: string;
  /** First sentence shown on the page — also used in the OG description fallback. */
  intro: string;
  /** Second paragraph with unique selling angle for this specific device. */
  uniqueAngle: string;
  /** 3-4 model-specific FAQ entries. */
  faq: DeviceFAQ[];
}

export const devices: DeviceData[] = [
  {
    slug: "stream-deck-mini",
    name: "Stream Deck Mini",
    shortName: "Mini",
    modelId: "mini",
    manufacturer: "Elgato",
    buttons: 6,
    rows: 2,
    cols: 3,
    gifWidth: 288,
    gifHeight: 192,
    hasScreen: false,
    exportsProfile: true,
    metaTitle: "Stream Deck Mini GIF Background — Free Animated Tile Generator",
    metaDescription:
      "Make an animated GIF background for the Elgato Stream Deck Mini. Free in-browser slicer that exports a ready-to-import .streamDeckProfile from a 288×192 GIF.",
    intro:
      "The Stream Deck Mini's compact 2×3 grid is the friendliest starting point for an animated GIF background. With only 6 buttons to fill, the animation stays readable and the entire setup takes seconds.",
    uniqueAngle:
      "Because the Mini's display is small (288×192 px total), GIFs stay light and processing is the fastest of any supported model. It's the model we recommend for first-time experimenters — fewer tiles to plan, smaller files to download, and the .streamDeckProfile is ready to import the moment slicing finishes.",
    faq: [
      {
        q: "What size GIF does the Stream Deck Mini need?",
        a: "Exactly 288×192 pixels. The Mini has a 2-row, 3-column grid of 96×96 px buttons, so a 288×192 GIF tiles cleanly into 6 perfectly-sized animated mini-GIFs.",
      },
      {
        q: "How do I install a sliced GIF on my Stream Deck Mini?",
        a: "Use the slicer to download a .streamDeckProfile file. Open the Stream Deck app, go to Profiles → Import, and select the downloaded file. All 6 tiles are auto-assigned to the correct buttons — no manual setup.",
      },
      {
        q: "Will my GIF look good on the Stream Deck Mini?",
        a: "For best results, keep your GIF under 2 MB and use a short loop (2-5 seconds). The Mini renders animations smoothly at the 96×96 px tile size; high-contrast subjects read better than fine detail.",
      },
      {
        q: "Can I share my Stream Deck Mini animated profile with friends?",
        a: "Yes. The exported .streamDeckProfile is a self-contained file. Send it to anyone with a Stream Deck Mini and they can import it without re-running the slicer.",
      },
    ],
  },
  {
    slug: "stream-deck-mk2",
    name: "Stream Deck MK.2",
    shortName: "MK.2",
    modelId: "regular",
    manufacturer: "Elgato",
    buttons: 15,
    rows: 3,
    cols: 5,
    gifWidth: 480,
    gifHeight: 288,
    hasScreen: false,
    exportsProfile: true,
    metaTitle: "Stream Deck MK.2 GIF Background — Free Animated 15-Tile Generator",
    metaDescription:
      "Animate the 15 buttons of your Elgato Stream Deck (MK.2) with a single GIF. Free in-browser slicer + .streamDeckProfile export. Required GIF size: 480×288 px.",
    intro:
      "The Stream Deck (MK.2) — the original 15-button device — has the sweet-spot grid for animated backgrounds. The 5×3 layout gives enough surface for a clear scene without becoming visually noisy.",
    uniqueAngle:
      "At 480×288 px the MK.2 hits the best balance of detail and file size for an animated background: enough resolution for a recognizable scene, low enough total size to keep encoding fast. Profile import means all 15 tiles snap into place in a single click — no dragging GIFs one by one.",
    faq: [
      {
        q: "What size GIF does the Stream Deck (MK.2) need?",
        a: "Exactly 480×288 pixels. The MK.2 has a 3-row, 5-column grid of 96×96 px buttons, so a 480×288 GIF cleanly fills all 15 keys.",
      },
      {
        q: "Does this work with the older Stream Deck (original) too?",
        a: "Yes. The original Stream Deck and the MK.2 share the same 5×3 button layout, so the 480×288 px dimensions and the exported .streamDeckProfile work on both.",
      },
      {
        q: "How long should my GIF be?",
        a: "2-6 seconds usually looks best. Shorter loops feel snappier, longer ones can produce large file sizes. The slicer accepts any GIF up to 2 MB.",
      },
      {
        q: "Can I use a video instead of a GIF?",
        a: "Not directly. Convert your video to a GIF first (most online converters work). Make sure the output is exactly 480×288 px before uploading — the slicer validates dimensions before processing.",
      },
    ],
  },
  {
    slug: "stream-deck-plus",
    name: "Stream Deck Plus",
    shortName: "Plus",
    modelId: "plus",
    manufacturer: "Elgato",
    buttons: 8,
    rows: 2,
    cols: 4,
    gifWidth: 384,
    gifHeight: 192,
    hasScreen: false,
    exportsProfile: true,
    metaTitle: "Stream Deck Plus GIF Background — Free Animated 8-Tile Generator",
    metaDescription:
      "Slice any GIF into an animated background for your Elgato Stream Deck Plus. Free in-browser tool + .streamDeckProfile export. Required GIF size: 384×192 px.",
    intro:
      "The Stream Deck Plus's wide 4×2 button grid produces a cinematic, landscape-style animated background. Wider than the Mini or MK.2, it lets you build setups where the animation flows horizontally across all 8 keys.",
    uniqueAngle:
      "The Plus is paired with a touch strip and rotary dials that the Stream Deck app handles separately — the slicer only generates the 8 button-grid tiles. The 384×192 px aspect ratio (2:1) is great for panoramic scenes, side-scrolling animations, and waveform-style visuals.",
    faq: [
      {
        q: "What size GIF does the Stream Deck Plus need?",
        a: "Exactly 384×192 pixels. The Plus has a 2-row, 4-column grid of 96×96 px buttons. The wide 2:1 ratio is ideal for landscape-oriented animations.",
      },
      {
        q: "Does the slicer cover the touch strip and dials?",
        a: "No. The slicer outputs the 8 main button tiles only. The Plus's touch strip and dials are configured separately inside the Stream Deck app.",
      },
      {
        q: "Will the same GIF work on the Stream Deck Neo?",
        a: "Yes — the Neo also uses an 8-button, 4×2 layout at 384×192 px. Both devices share the slicer's Plus / Neo card.",
      },
      {
        q: "Can I make a panoramic animation that pans across all 8 keys?",
        a: "Absolutely. The wide aspect ratio (384×192 px) is perfect for slow horizontal pans, wave animations, or any scene where motion flows from left to right.",
      },
    ],
  },
  {
    slug: "stream-deck-neo",
    name: "Stream Deck Neo",
    shortName: "Neo",
    modelId: "plus",
    manufacturer: "Elgato",
    buttons: 8,
    rows: 2,
    cols: 4,
    gifWidth: 384,
    gifHeight: 192,
    hasScreen: false,
    exportsProfile: true,
    metaTitle: "Stream Deck Neo GIF Background — Free Animated 8-Tile Generator",
    metaDescription:
      "Make an animated GIF background for your Elgato Stream Deck Neo. Free in-browser slicer + .streamDeckProfile export. Required GIF size: 384×192 px (4×2 grid).",
    intro:
      "The Stream Deck Neo is Elgato's entry-level 8-button model. With its 4×2 grid, it shares the same animated background pipeline as the Plus — meaning any 384×192 px GIF works seamlessly on both.",
    uniqueAngle:
      "The Neo is the most affordable Stream Deck with a full 8-button grid, making it a popular pick for streamers and creators starting out. Because it shares geometry with the Plus, the slicer treats them as one — your 384×192 GIF becomes a ready-to-import .streamDeckProfile in seconds.",
    faq: [
      {
        q: "What size GIF does the Stream Deck Neo need?",
        a: "Exactly 384×192 pixels (4 columns × 2 rows of 96×96 px tiles). Identical to the Stream Deck Plus.",
      },
      {
        q: "Why does the slicer group Neo with Plus?",
        a: "The Neo and Plus share the exact same 4×2 button grid and tile dimensions, so the slicing logic is identical. The slicer's Plus / Neo card produces a profile that works on either device.",
      },
      {
        q: "Does the Stream Deck Neo support animated GIF backgrounds out of the box?",
        a: "Yes. Any Stream Deck — including the Neo — supports animated GIFs on each button. The slicer prepares the per-button GIFs so the animation flows seamlessly across the full grid.",
      },
      {
        q: "Where does the .streamDeckProfile file go?",
        a: "Open the Stream Deck app, click Profiles → Import, then select the file. The Neo's 8 buttons get assigned automatically.",
      },
    ],
  },
  {
    slug: "stream-deck-xl",
    name: "Stream Deck XL",
    shortName: "XL",
    modelId: "xl",
    manufacturer: "Elgato",
    buttons: 32,
    rows: 4,
    cols: 8,
    gifWidth: 768,
    gifHeight: 384,
    hasScreen: false,
    exportsProfile: true,
    metaTitle: "Stream Deck XL GIF Background — Free Animated 32-Tile Generator",
    metaDescription:
      "Animate all 32 buttons of your Elgato Stream Deck XL with a single GIF. Free in-browser slicer + .streamDeckProfile export. Required GIF size: 768×384 px.",
    intro:
      "The Stream Deck XL is the biggest playground for animated backgrounds: 32 buttons in an 8×4 grid let you build dense, detailed scenes that span the entire surface of the device.",
    uniqueAngle:
      "At 768×384 px the XL gives you the highest fidelity any Stream Deck can render. Anime panels, gameplay clips, weather radar loops — anything visual works. The .streamDeckProfile export saves you from manually assigning 32 separate tiles by hand: import once and the entire animation flows across all keys.",
    faq: [
      {
        q: "What size GIF does the Stream Deck XL need?",
        a: "Exactly 768×384 pixels. The XL has an 8-column, 4-row grid of 96×96 px buttons, so a 768×384 GIF tiles perfectly into 32 mini-GIFs.",
      },
      {
        q: "Why is my 768×384 GIF over 2 MB?",
        a: "XL backgrounds tend to be larger because the surface area is bigger. Reduce frame count, shorten the loop, or lower the color palette in your GIF encoder (most tools support 64 or 128 colors). The slicer's 2 MB limit keeps processing fast.",
      },
      {
        q: "Will the animation stay in sync across all 32 buttons?",
        a: "Yes. The slicer preserves the original GIF's frame timing across every tile, so the animation appears as one continuous scene across the full XL surface.",
      },
      {
        q: "Can I use a 4K or HD video clip on the Stream Deck XL?",
        a: "Convert it to a GIF first and downsize to 768×384 px. The slicer validates dimensions before processing — anything else will be rejected with a clear message explaining what to fix.",
      },
    ],
  },
  {
    slug: "corsair-galleon-100-sd",
    name: "Corsair Galleon 100 SD",
    shortName: "Galleon 100 SD",
    modelId: "corsair",
    manufacturer: "Corsair",
    buttons: 12,
    rows: 4,
    cols: 3,
    gifWidth: 288,
    gifHeight: 576,
    hasScreen: true,
    exportsProfile: false,
    metaTitle: "Corsair Galleon 100 SD GIF Background — Free Screen + Button Tile Generator",
    metaDescription:
      "Make an animated background for the Corsair Galleon 100 SD (Stream Deck integrated keyboard). Slices a 288×576 GIF into one screen.gif + 12 button tiles, ready for iCUE.",
    intro:
      "The Corsair Galleon 100 SD is the unique device in the lineup: it pairs Elgato's screen technology with a Corsair keyboard, so the top half is a continuous display and the bottom half is a 4×3 button grid. Most slicers can't handle this composite layout — this one does, in a single upload.",
    uniqueAngle:
      "Unlike pure Stream Decks, the Galleon 100 SD is configured through Corsair iCUE, not the Stream Deck app. So the slicer skips the .streamDeckProfile export and instead returns a ZIP with one uncut screen.gif (for the 288×192 top display) and 12 individual button-tile GIFs (96×96 each). Drop them into iCUE on the matching surfaces and the animation flows seamlessly across the entire device.",
    faq: [
      {
        q: "What size GIF does the Corsair Galleon 100 SD need?",
        a: "Exactly 288×576 pixels. The top 288×192 region maps to the integrated screen; the bottom 288×384 region maps to the 4×3 button grid (12 buttons of 96×96 px).",
      },
      {
        q: "Why doesn't the slicer give me a .streamDeckProfile for this device?",
        a: "The Galleon 100 SD uses Corsair iCUE, not the Elgato Stream Deck app. iCUE doesn't support the .streamDeckProfile format, so the slicer instead delivers the ready-to-assign GIF files directly. Just drop them into iCUE manually.",
      },
      {
        q: "What's the difference between screen.gif and the tile_r#_c#.gif files?",
        a: "screen.gif is one continuous 288×192 px animation for the top display of the Galleon 100 SD (it's NOT sliced into buttons). The 12 tile_r#_c#.gif files are 96×96 px each and go on the buttons of the 4×3 grid below the screen.",
      },
      {
        q: "Will the animation flow seamlessly across screen and buttons?",
        a: "Yes, as long as your source GIF is one continuous 288×576 px image where the top and bottom halves visually connect. The slicer doesn't add any borders or gaps — what you see in the source is what plays on the device.",
      },
    ],
  },
];

export const getDevice = (slug: string): DeviceData | undefined =>
  devices.find((d) => d.slug === slug);
