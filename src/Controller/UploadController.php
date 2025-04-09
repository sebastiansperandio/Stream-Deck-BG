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
        $css_url = '/public/css/styles.css';
        ?>
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Stream Deck GIF Background</title>
                <link rel="stylesheet" href="<?php echo htmlspecialchars($css_url, ENT_QUOTES); ?>">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
                <link rel="icon" type="image/x-icon" href="/public/img/favicon.ico">
            </head>
            <body>
                <div class="form-container">
                    <h1>Stream Deck GIF Background Slicer</h1>
                    <h3>IT'S TOTALLY FREE</h3>
                    
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
                            <label for="model"></label>
                            <select name="model" id="model" onchange="updateModelMessage()" required>
                                <option value="" disabled selected>-- Select Model --</option>
                                <option value="mini">Stream Deck Mini (6 buttons - 288x192)</option>
                                <option value="regular">Stream Deck (15 buttons - 480x288)</option>
                                <option value="plus">Stream Deck Plus | Neo (8 buttons - 384x192)</option>
                                <option value="xl">Stream Deck XL (32 buttons - 768x384)</option>
                            </select>
                        </div>

                        <p id="model_message" class="mt10"></p>
                        
                        <div id="drop_zone" class="drop-zone">
                            <i class="fas fa-cloud-upload" style="font-size: 2rem; color: #623198; margin-bottom: 5px;"></i>
                            <p id="drop_zone_text">Drag &amp; drop your GIF here, or click to select</p>
                            <input type="file" id="gif_file" class="file-input" name="gif_file" accept=".gif" required onchange="clearErrorMessage();">
                        </div>

                        <button type="submit" class="upload-btn">Slice &amp; Download GIF</button>
                    </form>
                    <div class="mt20 help-grid">
                        <div class="help-card">
                            <p class="help-title">Need a sample GIF?</p>
                            <p class="mt5">
                                <a id="download_sample_link" href="?action=download_sample&model=xl">
                                    <i class="fas fa-download" style="margin-right: 6px;"></i>Download
                                </a>
                            </p>
                        </div>
                        <div class="help-card">
                            <p class="help-title">Need help creating a GIF?</p>
                            <p class="mt5">
                                <a href="https://www.youtube.com/watch?v=rCs1jdN-w1Y" target="_blank">
                                    <i class="fas fa-video" style="margin-right: 6px;"></i>Watch tutorial
                                </a>
                            </p>
                        </div>
                        <div class="help-card">
                            <p class="help-title">Need support for other models?</p>
                            <p class="mt5">
                                <a href="mailto:sebastiansperandio@gmail.com">
                                    <i class="fas fa-envelope" style="margin-right: 6px;"></i>Email me
                                </a>
                            </p>
                        </div>
                        <div class="help-card">
                            <p class="help-title">Check the code?</p>
                            <p class="mt5">
                                <a href="https://github.com/sebastiansperandio/Stream-Deck-BG" target="_blank">
                                    <i class="fab fa-github" style="margin-right: 5px;"></i>GitHub
                                </a>
                            </p>
                        </div>
                    </div>
                    
                    <div class="mt20 upcoming-features">
                        <div class="upcoming-features-header">
                            <div class="title-and-subtitle">
                                <h3>Coming Soon</h3>
                                <p>Your donations help fund the development of exciting new features:</p>
                            </div>
                            <div class="buy-me-a-coffe">
                                <form action="https://www.paypal.com/ncp/payment/96GEXVM9RCTLS" method="post" target="_blank" style="display:inline-grid;justify-items:center;align-content:start;gap:0.5rem;">
                                    <input class="pp-96GEXVM9RCTLS" type="submit" value="Buy me a coffe" />
                                    <img src=https://www.paypalobjects.com/images/Debit_Credit_APM.svg alt="cards" />
                                </form>
                            </div>
                        </div>
                        
                        <div class="feature-card">
                            <h4>✨ AI-Powered Features</h4>
                            <ul>
                                <li><strong>Smart focus:</strong> Automatically detects faces or objects and centers them in the most relevant tiles.</li>
                                <li><strong>GIF quality enhancer:</strong> Improve resolution and clarity of low-quality GIFs with intelligent upscaling.</li>
                                <li><strong>Video to GIF AI:</strong> Upload a video and let AI choose and convert the best segment into a looping GIF background.</li>
                                <li><strong>Seamless loop detection:</strong> AI analyzes frames to identify and refine perfect loops.</li>
                                <li><strong>Optimized compression:</strong> Automatically reduce size by detecting redundant frames without losing quality.</li>
                            </ul>
                        </div>

                        <div class="feature-card">
                            <h4>Stream Deck Profile Export</h4>
                            <p>Soon you'll be able to export a complete Stream Deck profile with all the sliced GIFs already assigned to the right buttons - no more manual assignment!</p>
                        </div>
                        
                        <div class="feature-card">
                            <h4>Stream Deck SDK Plugin</h4>
                            <p>We're developing an official Elgato Stream Deck plugin that will connect directly to this tool, automating the entire process of creating animated backgrounds.</p>
                        </div>

                        <p class="support-message">Every coffee you buy helps bring these features to life faster! ☕</p>
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

                function showPleaseWait() {
                    document.getElementById('please_wait_message').style.display = 'block';
                }

                // Update the model message based on the selected option.
                function updateModelMessage() {
                    const modelSelect  = document.getElementById('model');
                    const modelMessage = document.getElementById('model_message');
                    const downloadLink = document.getElementById('download_sample_link');

                    if (modelSelect.value === 'mini') {
                        modelMessage.innerText = 'For this model, you need a GIF of 288x192 pixels.';
                    } else if (modelSelect.value === 'plus') {
                        modelMessage.innerText = 'For this model, you need a GIF of 384x192 pixels.';
                    } else if (modelSelect.value === 'regular') {
                        modelMessage.innerText = 'For this model, you need a GIF of 480x288 pixels.';
                    } else if (modelSelect.value === 'xl') {
                        modelMessage.innerText = 'For this model, you need a GIF of 768x384 pixels.';
                    }

                    downloadLink.href = `?action=download_sample&model=${modelSelect.value}`;

                    // Add the class 'model_message' to the <p> element
                    modelMessage.classList.add('model_message');
                    clearErrorMessage();
                }

                const dropZone      = document.getElementById('drop_zone');
                const dropZoneText  = document.getElementById('drop_zone_text');
                const fileInput     = document.getElementById('gif_file');
                const defaultMsg    = 'Drag & drop your GIF here, or click to select';

                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, e => {
                        e.preventDefault();
                        e.stopPropagation();
                    }, false);
                });

                ['dragenter', 'dragover'].forEach(eventName => {
                    dropZone.addEventListener(eventName, () => {
                        dropZone.classList.add('dragover');
                    }, false);
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, () => {
                        dropZone.classList.remove('dragover');
                    }, false);
                });

                dropZone.addEventListener('drop', e => {
                    const droppedFiles = e.dataTransfer.files;
                    if (droppedFiles && droppedFiles.length > 0) {
                        fileInput.files = droppedFiles;
                        showFileNames(droppedFiles);
                    }
                }, false);

                dropZone.addEventListener('click', () => {
                    fileInput.click();
                });

                fileInput.addEventListener('change', () => {
                    if (fileInput.files && fileInput.files.length > 0) {
                        showFileNames(fileInput.files);
                    } else {
                        dropZoneText.innerText = defaultMsg;
                    }
                });

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
            $this->show_form('Error: No valid GIF file was provided.');
            return;
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
            'mini' => [
                'path' => __DIR__ . '/../../public/sample/sample_288x192.gif',
                'filename' => 'sample_288x192.gif',
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

    /**
     * Muestra la página de éxito con confeti y descarga automática.
     */
    public function show_success(): void {
        $css_url = '/public/css/styles.css';
        session_start();
        $download_file = $_SESSION['download_file'] ?? '';
        ?>
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Success! - Stream Deck GIF Background</title>
                <link rel="stylesheet" href="<?php echo htmlspecialchars($css_url, ENT_QUOTES); ?>">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
                <link rel="icon" type="image/x-icon" href="/public/img/favicon.ico">
                <meta http-equiv="refresh" content="10;url=/" /> <!-- Aumentado de 5 a 10 segundos -->
            </head>
            <body>
                <div class="form-container">
                    <h1>Success!</h1>
                    <div class="success-message">
                        <i class="fas fa-check-circle success-icon"></i>
                        <p>Your GIF has been processed successfully!</p>
                        
                        <?php if (!empty($download_file)): ?>
                            <p class="download-info">Your download will start automatically in a moment...</p>
                            
                            <div class="button-container">
                                <a href="/" class="return-button">
                                    <i class="fas fa-home"></i> Home Page
                                </a>
                                <a href="<?= htmlspecialchars($download_file) ?>" class="manual-download">
                                    <i class="fas fa-download"></i> Download ZIP
                                </a>
                            </div>
                        <?php else: ?>
                            <a href="/" class="return-button mt20">
                                <i class="fas fa-home"></i> Return to Home Page
                            </a>
                        <?php endif; ?>
                        
                        <p class="redirect-info">You will be redirected to the home page in 10 seconds</p>
                    </div>
                </div>
                
                <!-- Script para confeti -->
                <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
                <script>
                    // Función para lanzar confeti
                    function launchConfetti() {
                        var count = 200;
                        var defaults = {
                            origin: { y: 0.7 }
                        };

                        function fire(particleRatio, opts) {
                            confetti({
                                ...defaults,
                                ...opts,
                                particleCount: Math.floor(count * particleRatio)
                            });
                        }

                        // Lanzar confeti desde diferentes posiciones
                        fire(0.25, {
                            spread: 26,
                            startVelocity: 55,
                        });
                        fire(0.2, {
                            spread: 60,
                        });
                        fire(0.35, {
                            spread: 100,
                            decay: 0.91,
                            scalar: 0.8
                        });
                        fire(0.1, {
                            spread: 120,
                            startVelocity: 25,
                            decay: 0.92,
                            scalar: 1.2
                        });
                        fire(0.1, {
                            spread: 120,
                            startVelocity: 45,
                        });
                        
                        // Efecto de confeti continuo
                        setTimeout(() => {
                            fire(0.15, {
                                spread: 150,
                                origin: { y: 0.2 }
                            });
                        }, 1200);
                    }
                    
                    // Cuando se carga la página
                    window.onload = function() {
                        // Primero lanzamos el confeti
                        launchConfetti();
                        
                        // Después de 2.5 segundos iniciamos la descarga automática
                        <?php if (!empty($download_file)): ?>
                        setTimeout(function() {
                            window.location.href = "<?= htmlspecialchars($download_file) ?>";
                        }, 2500);
                        <?php endif; ?>
                    };
                </script>
            </body>
        </html>
        <?php
    }
}
