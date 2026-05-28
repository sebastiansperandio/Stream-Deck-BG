import UploadForm from "@/components/UploadForm";

export default function Home() {
  return (
    <main>
      <UploadForm />

      <section className="seo-content" aria-label="About the Stream Deck GIF Background Slicer">
        <div className="seo-inner">
          <h2>What is the Stream Deck GIF Background Slicer?</h2>
          <p>
            The <strong>Stream Deck GIF Background Slicer</strong> is a free, open-source browser
            tool that turns any animated GIF into a set of perfectly-sized animated tiles for your
            Elgato Stream Deck. Drop in your GIF, pick your model, and download either a ZIP with
            all the tile GIFs or a ready-to-import <code>.streamDeckProfile</code> file that loads
            the entire animation into your device in a single click.
          </p>
          <p>
            It is the original Stream Deck GIF background tool, online since 2024, and it now also
            supports the Corsair Galleon 100 SD — the only browser tool that handles its composite
            screen + button-grid layout in one upload.
          </p>

          <h2>How does it work?</h2>
          <ol>
            <li>
              <strong>Pick your Stream Deck model.</strong> The tool shows the exact GIF size each
              model requires (Mini, MK.2, Plus, Neo, XL, or Corsair Galleon 100 SD).
            </li>
            <li>
              <strong>Upload a GIF</strong> that matches the required dimensions. The tool
              validates the size before processing and tells you exactly what to fix if the
              dimensions don&apos;t match.
            </li>
            <li>
              <strong>Click &quot;Slice &amp; Get Stream Deck Profile&quot;.</strong> The GIF is
              decoded and sliced into the right number of animated tiles entirely in your browser
              — your file never leaves your machine.
            </li>
            <li>
              <strong>Download the ZIP or the .streamDeckProfile</strong> file. The profile imports
              into the Stream Deck app with every tile pre-assigned to its button — no manual setup.
            </li>
          </ol>

          <h2>Supported devices &amp; required GIF sizes</h2>
          <ul className="seo-device-list">
            <li>
              <strong>Stream Deck Mini</strong> &mdash; 6 buttons (2&times;3 grid), GIF{" "}
              <strong>288&times;192&nbsp;px</strong>
            </li>
            <li>
              <strong>Stream Deck MK.2</strong> &mdash; 15 buttons (5&times;3 grid), GIF{" "}
              <strong>480&times;288&nbsp;px</strong>
            </li>
            <li>
              <strong>Stream Deck Plus / Neo</strong> &mdash; 8 buttons (4&times;2 grid), GIF{" "}
              <strong>384&times;192&nbsp;px</strong>
            </li>
            <li>
              <strong>Stream Deck XL</strong> &mdash; 32 buttons (8&times;4 grid), GIF{" "}
              <strong>768&times;384&nbsp;px</strong>
            </li>
            <li>
              <strong>Corsair Galleon 100 SD</strong> &mdash; 12 buttons (4&times;3 grid) +
              288&times;192&nbsp;px integrated screen, GIF <strong>288&times;576&nbsp;px</strong>
            </li>
          </ul>

          <h2>Frequently asked questions</h2>

          <h3>Is the Stream Deck GIF Background Slicer free?</h3>
          <p>
            Yes. The tool is 100% free and open source on GitHub. No signup, no ads, no
            installation. You can also self-host it if you want.
          </p>

          <h3>Does my GIF get uploaded anywhere?</h3>
          <p>
            No. The entire processing happens client-side in your browser using JavaScript and
            in-memory canvas operations. Your GIF never leaves your machine, no server sees it.
          </p>

          <h3>What is a .streamDeckProfile file?</h3>
          <p>
            <code>.streamDeckProfile</code> is the official profile file format used by the Elgato
            Stream Deck app. It bundles button assignments, layouts and backgrounds into a single
            file. The Slicer generates this file with every tile of your sliced GIF pre-assigned to
            its matching button — so you import once and your animated background is set up across
            all buttons.
          </p>

          <h3>Can I use this with the Corsair Galleon 100 SD?</h3>
          <p>
            Yes. The Corsair Galleon 100 SD uses Elgato&apos;s screen technology, but it&apos;s
            controlled by Corsair iCUE (not the Stream Deck app). For this device, the Slicer
            outputs a ZIP containing one <code>screen.gif</code> for the top 288&times;192 display
            and 12 individual <code>tile_r#_c#.gif</code> files for the button grid below, ready to
            assign in iCUE. The <code>.streamDeckProfile</code> export is skipped for this device
            because iCUE doesn&apos;t use that format.
          </p>

          <h3>Why does my GIF need a specific size?</h3>
          <p>
            Each Stream Deck device has a fixed grid of square buttons (96&times;96&nbsp;px each).
            The tool divides your GIF into that exact grid. If your GIF size doesn&apos;t match the
            device&apos;s expected dimensions, the tiles won&apos;t line up. The tool validates
            this before processing and refuses to slice incorrect sizes, so you never get a broken
            result.
          </p>

          <h3>Who built this tool?</h3>
          <p>
            <a
              href="https://github.com/sebastiansperandio"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sebastian Sperandio
            </a>{" "}
            built and open-sourced this tool in 2024. It is the original Stream Deck GIF Background
            Slicer. Source code is available on{" "}
            <a
              href="https://github.com/sebastiansperandio/Stream-Deck-BG"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
