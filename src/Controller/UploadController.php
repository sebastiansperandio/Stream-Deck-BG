<?php
declare(strict_types=1);

namespace SDBG\Controller;

use SDBG\Controller\GifProcessController;

/**
 * Class UploadController
 * Handles showing the form and receiving the uploaded GIF file.
 */
class UploadController
{
    /**
     * Show the HTML form for uploading a GIF.
     * 
     * @param string $error_message Optional error message to display.
     */
    public function show_form( string $error_message='' ): void
    {
        // Ajusta la ruta a tu stylesheet
        $css_url = '/public/css/styles.css';
        ?>
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Stream Deck GIF Background</title>
                <link rel="stylesheet" href="<?php echo htmlspecialchars($css_url, ENT_QUOTES); ?>">
            </head>
            <body>
               
                <div class="form-container">
                    <h1>Stream Deck GIF Background</h1>
                    <h3>Select your Stream Deck model and upload a GIF</h3>
                    
                    <?php if ( ! empty( $error_message ) ): ?>
                        <div id="error_message" class="error-message">
                            <?php echo $error_message; ?>
                        </div>
                    <?php endif; ?>

                    <div id="please_wait_message">
                        Please wait a moment, we are processing your GIF. This can take a few minutes...
                    </div>

                    <form action="?action=upload_gif" method="post" enctype="multipart/form-data" onsubmit="showPleaseWait()">
                        <div class="mt10 model-selector">
                            <label for="model">Select Stream Deck Model:</label>
                            <select name="model" id="model" onchange="updateModelMessage()" required>
                                <option value="" disabled selected>-- Select --</option>
                                <option value="regular">Stream Deck (480x288, 96x96 tiles, 15 buttons )</option>
                                <option value="plus">Stream Deck Plus (384x192, 96x96 tiles, 8 buttons)</option>
                                <option value="xl">Stream Deck XL (768x384, 96x96 tiles, 32 buttons)</option>
                            </select>
                        </div>

                        <p id="model_message" class="mt10"></p>
                        
                        <div id="drop_zone" class="drop-zone">
                            <!-- El párrafo inicial. Actualizaremos su contenido al arrastrar/soltar o seleccionar. -->
                            <p id="drop_zone_text">Drag &amp; drop your GIF here, or click to select</p>
                            <input type="file" id="gif_file" class="file-input" name="gif_file" accept=".gif" required onchange="clearErrorMessage();">
                        </div>

                        <button type="submit" class="upload-btn">Upload GIF</button>
                    </form>
                    <div class="mt20">
                        <p>Need a sample GIF?</p>
                        <p class="mt5">
                            <a id="download_sample_link" href="?action=download_sample&model=xl">Download</a>
                        </p>
                    </div>

                    <div class="mt10">
                        <p>Need support for other Stream Deck models?</p>
                        <p class="mt5">
                            <a href="mailto:sebastiansperandio@gmail.com">Email me</a>. 
                            I'll be happy to add it!
                        </p>
                    </div>
                    <div class="mt10">
                        <p>Want to see the code?</p>
                        <p class="mt5">
                            <a href="https://github.com/sebastiansperandio/Stream-Deck-BG" target="_blank">GitHub</a>
                        </p>
                    </div>
                </div>

                <script>
                // Clear the error message
                function clearErrorMessage() {
                    const errorMessage = document.getElementById('error_message');
                    if (errorMessage) {
                        errorMessage.remove(); // Remove the error message element
                    }
                }

                // Muestra "please wait" cuando se envía el formulario
                function showPleaseWait() {
                    document.getElementById('please_wait_message').style.display = 'block';
                }

                // Update the model message based on the selected option.
                function updateModelMessage() {
                    const modelSelect  = document.getElementById('model');
                    const modelMessage = document.getElementById('model_message');
                    const downloadLink = document.getElementById('download_sample_link');

                    if (modelSelect.value === 'xl') {
                        modelMessage.innerText = 'For this model, you need a GIF of 768x384 pixels.';
                    } else if (modelSelect.value === 'plus') {
                        modelMessage.innerText = 'For this model, you need a GIF of 384x192 pixels.';
                    } else if (modelSelect.value === 'regular') {
                        modelMessage.innerText = 'For this model, you need a GIF of 480x288 pixels.';
                    }

                    downloadLink.href = `?action=download_sample&model=${modelSelect.value}`;

                    // Add the class 'model_message' to the <p> element
                    modelMessage.classList.add('model_message');
                    clearErrorMessage();
                }

                // ---------- DRAG & DROP + Feedback del nombre de archivo ----------
                const dropZone      = document.getElementById('drop_zone');
                const dropZoneText  = document.getElementById('drop_zone_text');
                const fileInput     = document.getElementById('gif_file');
                const defaultMsg    = 'Drag & drop your GIF here, or click to select';

                // Evitar la acción por defecto del navegador
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, e => {
                        e.preventDefault();
                        e.stopPropagation();
                    }, false);
                });

                // Destacar el drop zone al arrastrar
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropZone.addEventListener(eventName, () => {
                        dropZone.classList.add('dragover');
                    }, false);
                });

                // Quitar destaque al salir o soltar
                ['dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, () => {
                        dropZone.classList.remove('dragover');
                    }, false);
                });

                // Manejar el drop: asignamos archivos al input, y mostramos nombre
                dropZone.addEventListener('drop', e => {
                    const droppedFiles = e.dataTransfer.files;
                    if (droppedFiles && droppedFiles.length > 0) {
                        fileInput.files = droppedFiles; // Se asigna al input
                        showFileNames(droppedFiles);
                    }
                }, false);

                // Permitir clic en la zona para abrir el diálogo de archivos
                dropZone.addEventListener('click', () => {
                    fileInput.click();
                });

                // Si el usuario hace clic y selecciona archivo(s) manualmente
                fileInput.addEventListener('change', () => {
                    if (fileInput.files && fileInput.files.length > 0) {
                        showFileNames(fileInput.files);
                    } else {
                        // Si se cancela la selección
                        dropZoneText.innerText = defaultMsg;
                    }
                });

                // Función para mostrar los nombres de los archivos seleccionados
                function showFileNames(fileList) {
                    if (fileList.length === 1) {
                        dropZoneText.innerText = fileList[0].name;
                    } else {
                        dropZoneText.innerText = fileList.length + ' files selected';
                    }
                }
                </script>
            </body>
        </html>
        <?php
    }

    /**
     * Handle the upload of a GIF file.
     * 
     * @param string $model The model of the Stream Deck (default: 'xl').
     */
    public function handle_upload( string $model = 'xl' ): void
    {
        if (!isset($_FILES['gif_file']) || $_FILES['gif_file']['error'] !== UPLOAD_ERR_OK) {
            exit('Error: No valid GIF file was provided.');
        }

        $tmp_name      = $_FILES['gif_file']['tmp_name'];
        $original_name = $_FILES['gif_file']['name'];

        // Create a unique directory for processing
        $unique_id = uniqid('gif_', true);
        $temp_dir  = __DIR__ . '/../../temp/' . $unique_id;
        if (!is_dir($temp_dir)) {
            mkdir($temp_dir, 0777, true);
        }

        // Move uploaded file into temp_dir
        $uploaded_path = $temp_dir . '/' . $original_name;
        move_uploaded_file($tmp_name, $uploaded_path);

        // Delegate to GifProcessController
        $process_controller = new GifProcessController();
        try {
            $process_controller->process_gif($uploaded_path, $temp_dir, $model);
        } catch (\Exception $e) {
            $this->show_form('Error: ' . $e->getMessage());
        }
    }

    /**
     * Force download of the sample GIF, if it exists.
     * 
     * @param string $model The model of the Stream Deck (default: 'xl').
     */
    public function download_sample( string $model = 'xl' ): void
    {
        $sample = match ( $model ) {
            'xl' => [
                'path' => __DIR__ . '/../../public/sample/sample_768x384.gif',
                'filename' => 'sample_768x384.gif',
            ],
            'plus' => [
                'path' => __DIR__ . '/../../public/sample/sample_384x192.gif',
                'filename' => 'sample_384x192.gif',
            ],
            'regular' => [
                'path' => __DIR__ . '/../../public/sample/sample_480x288.gif',
                'filename' => 'sample_480x288.gif',
            ],
            default => exit('Invalid model specified.'),
        };

        [
            'path' => $path,
            'filename' => $filename,
        ] = $sample;

        if ( ! file_exists( $path ) ) {
            exit( 'Sample GIF not found on the server.' );
        }

        header( 'Content-Type: image/gif' );
        header( 'Content-Disposition: attachment; filename="'. $filename .'"' );
        header( 'Content-Length: ' . filesize( $path ) );

        readfile( $path );
        exit;
    }
}
