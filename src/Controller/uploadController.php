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
    public function show_form(): void
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
            <h1 class="mb10">Stream Deck GIF Background</h1>
            <h3>Only Stream Deck El Gato XL at the moment (768x384 - 32 buttons)</h3>

            <div id="please_wait_message">
                Please wait a moment, we are processing your GIF. This can take a few minutes...
            </div>

            <form action="?action=upload_gif" method="post" enctype="multipart/form-data" onsubmit="showPleaseWait()">
                <div id="drop_zone" class="drop-zone">
                    <!-- El párrafo inicial. Actualizaremos su contenido al arrastrar/soltar o seleccionar. -->
                    <p id="drop_zone_text">Drag &amp; drop your GIF here, or click to select</p>
                    <input type="file" id="gif_file" class="file-input" name="gif_file" accept=".gif" required>
                </div>

                <button type="submit" class="upload-btn">Upload GIF</button>
            </form>

            <div class="mt20">
                <p>Need support for other Stream Deck models?</p>
                <p class="mt5">
                    <a href="mailto:sebastiansperandio@gmail.com">Email me</a>. 
                    I'll be happy to add it!
                </p>
            </div>
            <div class="mt20">
                <p>Want to see the code?</p>
                <p class="mt5">
                    <a href="https://github.com/sebastiansperandio/Stream-Deck-BG" target="_blank">GitHub</a>
                </p>
            </div>
        </div>

        <script>
        // Muestra "please wait" cuando se envía el formulario
        function showPleaseWait() {
            document.getElementById('please_wait_message').style.display = 'block';
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

    public function handle_upload(): void
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
        $process_controller->process_gif($uploaded_path, $temp_dir);
    }
}
