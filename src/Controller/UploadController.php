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
        $css_url = '/css/styles.css';
        ?>
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Stream Deck GIF Background</title>
                <link rel="stylesheet" href="<?php echo htmlspecialchars($css_url, ENT_QUOTES); ?>">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
                <link rel="manifest" href="/favicon/site.webmanifest">
            </head>
            <body>
                <div class="form-container">
                    <h1>Stream Deck GIF Background Slicer</h1>
                    <div class="gh-star-btn">
                        <h3>IT'S TOTALLY FREE</h3>
                        <iframe
                            src="https://ghbtns.com/github-btn.html?user=sebastiansperandio&repo=Stream-Deck-BG&type=star&count=true"
                            frameborder="0"
                            scrolling="0"
                            width="170"
                            height="30"
                            title="GitHub">
                        </iframe>
                    </div>
                    
                    <?php if ( ! empty( $error_message ) ): ?>
                        <div id="error_message" class="error-message">
                            <?php echo $error_message; ?>
                        </div>
                    <?php endif; ?>

                    <div id="please_wait_message">
                        Please wait a moment, we are processing your GIF. This can take a few minutes...
                    </div>
                    
                    <div id="size_error_message" class="error-message" style="display: none;">
                        <i class="fas fa-exclamation-circle"></i> The GIF you selected is larger than 2MB. Please use a smaller file.
                    </div>

                    <form action="?action=upload_gif" method="post" enctype="multipart/form-data" onsubmit="showPleaseWait()">
                        <div class="mt10 model-selector">
                            <label for="model"></label>
                            <img src="/img/Stream_Deck_Mini.png" alt="Stream Deck Mini" class="device-image active" data-model="mini">
        <img src="/img/Stream_Deck_MK2.png" alt="Stream Deck MK.2" class="device-image" data-model="original">
        <img src="/img/Stream_Deck_Plus.png" alt="Stream Deck +" class="device-image" data-model="plus">
        <img src="/img/Stream_Deck_Neo.png" alt="Stream Deck Neo" class="device-image" data-model="neo">
        <img src="/img/Stream_Deck_XL.png" alt="Stream Deck XL" class="device-image" data-model="xl">
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
                        <div class="size-limit-warning">
                            <p>Maximum file size: <span class="feature-word">2MB</span>. Only <span class="feature-word">GIF</span> format is supported.</p>
                        </div>
                        <button type="submit" class="upload-btn">Slice &amp; Download GIF</button>
                    </form>
                    <div class="mt5 help-grid">
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
                            <p>We're developing a Stream Deck plugin that will connect directly to this tool, automating the entire process of creating animated backgrounds.</p>
                        </div>

                        <p class="support-message">Every coffee you buy helps bring these features to life faster! ☕</p>
                        <div class="buy-me-a-coffee">
                            <div class="ko-fi">
                                <script type='text/javascript' src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'></script><script type='text/javascript'>kofiwidget2.init('Support me on Ko-fi', '#b494fa', 'W7W01DBHJE');kofiwidget2.draw();</script> 
                            </div>
                            <div class="paypal">
                                <form action="https://www.paypal.com/ncp/payment/96GEXVM9RCTLS" method="post" target="_blank" >
                                    <button type="submit" class="pp-96GEXVM9RCTLS">
                                        <i class="fab fa-paypal" style="margin-right: 10px;"></i>Buy me a coffee
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="/js/script.js"></script>
                <script>
                // Clear the error message
                function clearErrorMessage() {
                    const errorMessage = document.getElementById('error_message');
                    if (errorMessage) {
                        errorMessage.remove(); // Remove the error message element
                    }
                    showSizeError(false);
                }

                function showPleaseWait() {
                    document.getElementById('please_wait_message').style.display = 'block';
                }

                // Update the model message based on the selected option.
                function updateModelMessage() {
                    const modelSelect  = document.getElementById('model');
                    const modelMessage = document.getElementById('model_message');
                    const downloadLink = document.getElementById('download_sample_link');
                    const infoIcon     = '<i class="fas fa-info-circle"></i>';

                    if (modelSelect.value === 'mini') {
                        modelMessage.innerHTML = `${infoIcon} For this model, you need a GIF of 288x192 pixels.`;
                    } else if (modelSelect.value === 'plus') {
                        modelMessage.innerHTML = `${infoIcon} For this model, you need a GIF of 384x192 pixels.`;
                    } else if (modelSelect.value === 'regular') {
                        modelMessage.innerHTML = `${infoIcon} For this model, you need a GIF of 480x288 pixels.`;
                    } else if (modelSelect.value === 'xl') {
                        modelMessage.innerHTML = `${infoIcon} For this model, you need a GIF of 768x384 pixels.`;
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
                const uploadButton  = document.querySelector('.upload-btn');

                // Deactivate the upload button if the file is too large
                function showSizeError(show) {
                    const sizeErrorMessage = document.getElementById('size_error_message');
                    if (show) {
                        sizeErrorMessage.style.display = 'block';
                        uploadButton.disabled = true;
                        uploadButton.style.opacity = '0.5';
                        uploadButton.style.cursor = 'not-allowed';
                    } else {
                        sizeErrorMessage.style.display = 'none';
                        uploadButton.disabled = false;
                        uploadButton.style.opacity = '1';
                        uploadButton.style.cursor = 'pointer';
                    }
                }

                fileInput.addEventListener('change', () => {
                    // Clear any previous errors
                    clearErrorMessage();
                    showSizeError(false);
                    
                    if (fileInput.files && fileInput.files.length > 0) {
                        // Check file size (2MB = 2 * 1024 * 1024 bytes)
                        const maxSize = 2 * 1024 * 1024; // 2MB
                        
                        if (fileInput.files[0].size > maxSize) {
                            showSizeError(true);
                            fileInput.value = ''; // Clear the input
                            dropZoneText.innerText = defaultMsg;
                            return;
                        }
                        
                        showFileNames(fileInput.files);
                    } else {
                        dropZoneText.innerText = defaultMsg;
                    }
                });

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
        if ( ! isset( $_FILES['gif_file'] ) ) {
            $this->show_form( 'Error: No file was uploaded.' );
            return;
        }
        
        // Check for specific upload errors
        switch ( $_FILES['gif_file']['error'] ) {
            case UPLOAD_ERR_OK:
                // No error, continue processing
                break;
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $this->show_form( 'Error: Your GIF exceeds the maximum size limit of 2MB. Please compress your file or use a smaller GIF.' );
                return;
            case UPLOAD_ERR_PARTIAL:
                $this->show_form( 'Error: The GIF was only partially uploaded. Please try again.' );
                return;
            default:
                $this->show_form( 'Error: No valid GIF file was provided.' );
                return;
        }

        $tmp_name      = $_FILES['gif_file']['tmp_name'];
        $original_name = $_FILES['gif_file']['name'];

        // Create a unique directory for processing
        $unique_id = uniqid('gif_', true);
        $temp_dir  = sys_get_temp_dir() . '/' . $unique_id;
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
     * Show the success page after processing the GIF.
     * 
     * @return void
     */
    public function show_success(): void {
        $css_url = '/css/styles.css';
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
                <link rel="icon" type="image/x-icon" href="/img/favicon.ico">
                <!-- <meta http-equiv="refresh" content="10;url=/" /> --> <!-- Aumentado de 5 a 10 segundos -->
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
                                <a href="/?action=download" class="manual-download">
                                    <i class="fas fa-download"></i> Download ZIP
                                </a>
                            </div>
                        <?php else: ?>
                            <a href="/" class="return-button mt10">
                                <i class="fas fa-redo" style="margin-right:10px"></i> Create Another GIF
                            </a>
                        <?php endif; ?>
                        
                        <div class="donation-suggestion mt20">
                            <p>Did you find this tool helpful? Consider supporting future development!</p>
                            <div class="buy-me-a-coffee">
                                <div class="ko-fi">
                                    <script type='text/javascript' src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'></script><script type='text/javascript'>kofiwidget2.init('Support me on Ko-fi', '#b494fa', 'W7W01DBHJE');kofiwidget2.draw();</script> 
                                </div>
                                <div class="paypal">
                                    <form action="https://www.paypal.com/ncp/payment/96GEXVM9RCTLS" method="post" target="_blank" >
                                        <button type="submit" class="pp-96GEXVM9RCTLS">
                                            <i class="fab fa-paypal" style="margin-right: 10px;"></i>Buy me a coffee
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <!-- GitHub Star Button -->
                        <div class="github-star mt20">
                            <p>Like this tool? Give it a ⭐ on GitHub!</p>
                            <iframe
                                src="https://ghbtns.com/github-btn.html?user=sebastiansperandio&repo=Stream-Deck-BG&type=star&count=true"
                                frameborder="0"
                                scrolling="0"
                                width="120"
                                height="20"
                                title="GitHub">
                            </iframe>
                        </div>
                    </div>
                </div>
                
                <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
                <script>
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
                        
                        setTimeout(() => {
                            fire(0.15, {
                                spread: 150,
                                origin: { y: 0.2 }
                            });
                        }, 1200);
                    }
                    
                    window.onload = function() {
                        launchConfetti();
                        
                        <?php if (!empty($download_file)): ?>
                        // Automatically redirect to download after 3.5 seconds.
                        setTimeout(function() {
                            window.location.href = "/?action=download";
                        }, 3500);
                        <?php endif; ?>
                    };
                </script>
            </body>
        </html>
        <?php
    }
}
