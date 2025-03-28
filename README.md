# Stream Deck GIF Background Slicer

This project is designed to **recut** larger GIFs into multiple smaller **animated** GIFs sized for Elgato’s Stream Deck models, including **Stream Deck XL** and **Stream Deck Plus**. It also supports a real **drag & drop** area for convenient file selection and automatically zips the sliced GIF tiles for easy download.

You can also **use this tool online** at [https://sdbg.crabstudio.com.ar/](https://sdbg.crabstudio.com.ar/)

---

![Sample Stream Deck GIF Slicer](public/img/demo.jpeg)

---

## Features

- **Drag & drop** or manual selection of your GIF file.  
- **Automatic slicing** of the GIF frames into 96×96 tiles.  
- **Separate** each tile into a fully animated mini-GIF.  
- **Package** all mini-GIFs into a single ZIP for easy download.  
- **Sample GIF** available for both models (768×384 for XL, 384×192 for Plus) to test or verify correct dimensions.

---

## Supported Models

| Model                | GIF Dimensions | Tile Size | Grid Layout |
|----------------------|----------------|-----------|-------------|
| **Stream Deck XL**   | 768×384        | 96×96     | 8×4         |
| **Stream Deck Plus** | 384×192        | 96×96     | 4×2         |

---

## Installation

1. **Clone or download** this repository to your server or local environment.  
2. Run `composer install` (make sure PHP and Composer are installed).  
3. Ensure the **Imagick** extension is enabled in your PHP environment.  
4. Place your project folder where it can be accessed via a browser (e.g., under your server’s document root).
5. Make sure the `temp/` directory is **writable** by the web server.

---

## Requirements

- **PHP 7.4+ or 8+** (with the Imagick extension).  
- **Composer** for autoloading dependencies.  
- **Write permissions** on the `temp/` folder.

---

## Usage

1. **Access the Tool**  
   - Open the `index.php` from your project folder in a browser, or visit [https://sdbg.crabstudio.com.ar/](https://sdbg.crabstudio.com.ar/).
2. **(Optional) Download a Sample GIF**  
   - Click **Download** to get a pre-sized GIF for your selected model:
     - **Stream Deck XL**: 768×384
     - **Stream Deck Plus**: 384×192
3. **Select Your Model**  
   - Use the dropdown to select **Stream Deck XL** or **Stream Deck Plus**.
4. **Drag & Drop or Click**  
   - Drag your GIF onto the box or click to open the file dialog.  
   - You should see the file name appear once it’s selected.
5. **Upload**  
   - Click **Upload GIF**. A “Please wait” message shows while slicing is in progress.
6. **Download**  
   - You’ll be prompted to download a ZIP once the process is complete.  
   - This ZIP contains multiple sub-GIFs named `tile_r#_c#.gif`.
7. **Apply to Stream Deck**  
   - In your Stream Deck software, assign each button its corresponding mini-GIF.  
   - When placed correctly, the Stream Deck recreates the original GIF across all buttons.

---

## Future Support for Other Models

- The code is structured so you can add new **tile sizes** in `src/Entity/tile_size.php` or adapt `GifProcessController`.  

---

## Troubleshooting

- **Missing Imagick**:  
  - Install or enable the PHP Imagick extension through your OS or hosting environment.  
- **Permissions**:  
  - The script must write to `temp/`. Ensure it’s writable.
- **Large GIFs**:  
  - For huge animations, you may need to increase `memory_limit` and `max_execution_time`.

---

## Contributing

- Pull requests are welcome on [GitHub](https://github.com/sebastiansperandio/Stream-Deck-BG).  
- Email [sebastiansperandio@gmail.com](mailto:sebastiansperandio@gmail.com) for advanced questions or new model requests.

Enjoy your custom Stream Deck XL animations! 
