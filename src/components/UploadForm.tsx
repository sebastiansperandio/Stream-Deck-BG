'use client';

import React, { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import { processGif, getLayout, TileData } from '@/utils/processGif';
import { createTilesZip } from '@/utils/createZip';
import { exportStreamDeckProfile } from '@/utils/exportProfile';
import { trackEvent } from '@/utils/analytics';

// Types
type ModelType = 'mini' | 'regular' | 'plus' | 'xl' | 'neo';

export default function UploadForm() {
    const [model, setModel] = useState<ModelType | ''>('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [tilesData, setTilesData] = useState<TileData[]>([]);
    const [zipUrl, setZipUrl] = useState<string>('');
    const [profileUrl, setProfileUrl] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Track page view on mount
    useEffect(() => {
        trackEvent('page_view', {
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
        });
    }, []);

    // Auto-download ZIP and confetti when success page appears
    useEffect(() => {
        if (!showSuccess || !zipUrl) return;

        // Trigger automatic ZIP download
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = 'stream_deck_gifs.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Launch confetti
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
        script.onload = () => {
            const confetti = (window as any).confetti;
            if (!confetti) return;
            const count = 200;
            const defaults = { origin: { y: 0.7 } };
            const fire = (ratio: number, opts: object) =>
                confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) });
            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
            setTimeout(() => fire(0.15, { spread: 150, origin: { y: 0.2 } }), 1200);
        };
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, [showSuccess, zipUrl]);

    const handleModelSelect = (selectedModel: ModelType) => {
        setModel(selectedModel);
        setError('');
        trackEvent('model_selected', { model: selectedModel });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile: File) => {
        setError('');
        // 2MB limit
        if (selectedFile.size > 2 * 1024 * 1024) {
             setError('The GIF you selected is larger than 2MB. Please use a smaller file.');
             setFile(null);
             if (fileInputRef.current) fileInputRef.current.value = '';
             return;
        }
        if (selectedFile.type !== 'image/gif') {
            setError('Only GIF format is supported.');
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        setFile(selectedFile);
        trackEvent('file_uploaded', { file_size: selectedFile.size });
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const readImageDimensions = (selectedFile: File): Promise<{ width: number; height: number }> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(selectedFile);
            img.onload = () => {
                const dims = { width: img.naturalWidth, height: img.naturalHeight };
                URL.revokeObjectURL(url);
                resolve(dims);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Could not read GIF dimensions.'));
            };
            img.src = url;
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !model) {
            setError('Please select a model and a GIF file.');
            return;
        }

        // Validate GIF dimensions against the selected model
        const layout = getLayout(model);
        const expected = {
            width: layout.cols * layout.tileWidth,
            height: layout.rows * layout.tileHeight,
        };
        try {
            const actual = await readImageDimensions(file);
            if (actual.width !== expected.width || actual.height !== expected.height) {
                setError(
                    `Your GIF is ${actual.width}×${actual.height} px, but this model needs exactly ${expected.width}×${expected.height} px. Resize your GIF or pick the matching model.`
                );
                trackEvent('dimension_mismatch', {
                    model,
                    actual_width: actual.width,
                    actual_height: actual.height,
                    expected_width: expected.width,
                    expected_height: expected.height,
                });
                return;
            }
        } catch (err: any) {
            setError(err.message || 'Could not read the GIF. Please try a different file.');
            return;
        }

        setIsProcessing(true);
        setError('');
        const startTime = Date.now();
        trackEvent('processing_started', { model });

        try {
            // 1. Decode and slice the GIF into individual tile data
            const tiles = await processGif(file, model);
            setTilesData(tiles);

            // 2. Package as a standard ZIP
            const zipBlob = await createTilesZip(tiles, model);
            setZipUrl(URL.createObjectURL(zipBlob));

            // 3. Generate the Stream Deck profile
            const profileBlob = await exportStreamDeckProfile(tiles, model);
            setProfileUrl(URL.createObjectURL(profileBlob));

            setShowSuccess(true);
            trackEvent('processing_completed', { model, duration_ms: Date.now() - startTime });
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during processing.');
            trackEvent('processing_failed', { model, error: err.message || 'Unknown error' });
        } finally {
            setIsProcessing(false);
        }
    };

    if (showSuccess) {
        const handleReset = (e: React.MouseEvent) => {
            e.preventDefault();
            trackEvent('click_reset');
            setShowSuccess(false);
            setFile(null);
            setModel('');
            setZipUrl('');
            setProfileUrl('');
            setTilesData([]);
        };

        return (
            <div className="form-container">
                <h1>Success!</h1>
                <div className="success-message">
                    <i className="fas fa-check-circle success-icon"></i>
                    <p>Your GIF has been processed successfully!</p>
                    {zipUrl && (
                        <>
                            <p className="download-info">Your files are ready to download:</p>
                            <div className="button-container" style={{ flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                                {/* Standard ZIP */}
                                <a href={zipUrl} download="stream_deck_gifs.zip" className="manual-download" onClick={() => trackEvent('download_zip')}>
                                    <i className="fas fa-file-archive" style={{ marginRight: '8px' }}></i>
                                    Download GIF Tiles (ZIP)
                                </a>

                                {/* Stream Deck Profile */}
                                {profileUrl && (
                                    <a href={profileUrl} download="GIF_Background.streamDeckProfile" onClick={() => trackEvent('download_profile')} style={{
                                        display: 'inline-block',
                                        backgroundColor: '#1a1a2e',
                                        color: 'white',
                                        padding: '12px 20px',
                                        borderRadius: '4px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        transition: 'background-color 0.3s, transform 0.1s',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                                    }}>
                                        <i className="fas fa-stream" style={{ marginRight: '8px' }}></i>
                                        Export as Stream Deck Profile
                                    </a>
                                )}

                                {/* Reset */}
                                <a href="/" className="return-button" onClick={handleReset}>
                                    <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
                                    Slice another GIF
                                </a>
                            </div>

                            <div style={{ marginTop: '12px', padding: '10px', background: '#f5f0ff', borderRadius: '6px', fontSize: '0.85rem', color: '#555', textAlign: 'left', maxWidth: '440px' }}>
                                <strong>💡 How to use the Stream Deck Profile:</strong>
                                <ol style={{ marginTop: '6px', paddingLeft: '18px' }}>
                                    <li>Open the <strong>Stream Deck</strong> app on your computer.</li>
                                    <li>Click on <strong>Profiles</strong> → <strong>Import...</strong></li>
                                    <li>Select the downloaded <code>.streamDeckProfile</code> file.</li>
                                    <li>The profile will appear with your GIF tiles pre-assigned! 🎉</li>
                                </ol>
                            </div>
                        </>
                    )}
                     <div className="donation-suggestion mt20">
                            <p>Did you find this tool helpful? Consider supporting future development!</p>
                            <div className="buy-me-a-coffee">
                                <div className="ko-fi">
                                   <a href='https://ko-fi.com/W7W01DBHJE' target='_blank' onClick={() => trackEvent('click_kofi')}><img height='36' style={{border:'0px',height:'36px'}} src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' alt='Buy Me a Coffee at ko-fi.com' /></a>
                                </div>
                                <div className="paypal">
                                    <form action="https://www.paypal.com/ncp/payment/96GEXVM9RCTLS" method="post" target="_blank" >
                                        <button type="submit" className="pp-96GEXVM9RCTLS" onClick={() => trackEvent('click_paypal')}>
                                            <i className="fab fa-paypal" style={{marginRight: '10px'}}></i>Buy me a coffee
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="github-star mt20">
                            <p>Like this tool? Give it a ⭐ on GitHub!</p>
                            <iframe
                                src="https://ghbtns.com/github-btn.html?user=sebastiansperandio&repo=Stream-Deck-BG&type=star&count=true"
                                frameBorder="0"
                                scrolling="0"
                                width="120"
                                height="20"
                                title="GitHub">
                            </iframe>
                        </div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <div className="tagline">
                <h1 className="tagline-title">Animate your Stream Deck<br /><span className="tagline-accent">in one click.</span></h1>
                <p className="tagline-description">
                    Turn any GIF into a perfectly-sliced animated background for your Stream Deck &mdash; now exports a <strong>ready-to-import Stream Deck Profile</strong>, no manual tile setup.
                </p>
            </div>
            <div className="gh-star-btn">
                <span className="free-tag">Free &amp; open-source</span>
                <a
                    href="https://github.com/sebastiansperandio/Stream-Deck-BG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="free-cta"
                    onClick={() => trackEvent('click_github_star_cta')}
                >
                    <svg className="gh-icon-light" viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    <span>If it helped you, <strong>give it a star</strong></span>
                    <span className="free-cta-arrow" aria-hidden="true">&rarr;</span>
                </a>
            </div>

            <div className="whats-new" role="status" aria-label="What's new">
                <span className="whats-new-tag">NEW</span>
                <span className="whats-new-text">
                    One-click <strong>Stream Deck Profile</strong> export &mdash; skip the manual tile setup.
                </span>
            </div>

            {error && (
                <div id="error_message" className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {error}
                </div>
            )}

            {isProcessing && (
                <div id="please_wait_message" style={{ display: 'block' }}>
                    Please wait a moment, we are processing your GIF. This can take a few minutes...
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset className="mt10 model-picker">
                    <legend className="model-picker-legend">Choose your Stream Deck model</legend>
                    <div className="model-picker-grid">
                        <button
                            type="button"
                            className={`model-card ${model === 'mini' ? 'active' : ''}`}
                            aria-pressed={model === 'mini'}
                            onClick={() => handleModelSelect('mini')}
                        >
                            <div className="model-card-schematic model-card-schematic-mini">
                                {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
                            </div>
                            <div className="model-card-meta">
                                <strong>Mini</strong>
                                <span>6 keys</span>
                                <span className="model-card-size">GIF 288&times;192 px</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`model-card ${model === 'regular' ? 'active' : ''}`}
                            aria-pressed={model === 'regular'}
                            onClick={() => handleModelSelect('regular')}
                        >
                            <div className="model-card-schematic model-card-schematic-regular">
                                {Array.from({ length: 15 }).map((_, i) => <span key={i} />)}
                            </div>
                            <div className="model-card-meta">
                                <strong>Stream Deck</strong>
                                <span>15 keys</span>
                                <span className="model-card-size">GIF 480&times;288 px</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`model-card ${model === 'plus' ? 'active' : ''}`}
                            aria-pressed={model === 'plus'}
                            onClick={() => handleModelSelect('plus')}
                        >
                            <div className="model-card-schematic model-card-schematic-plus">
                                {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
                            </div>
                            <div className="model-card-meta">
                                <strong>Plus / Neo</strong>
                                <span>8 keys</span>
                                <span className="model-card-size">GIF 384&times;192 px</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`model-card ${model === 'xl' ? 'active' : ''}`}
                            aria-pressed={model === 'xl'}
                            onClick={() => handleModelSelect('xl')}
                        >
                            <div className="model-card-schematic model-card-schematic-xl">
                                {Array.from({ length: 32 }).map((_, i) => <span key={i} />)}
                            </div>
                            <div className="model-card-meta">
                                <strong>XL</strong>
                                <span>32 keys</span>
                                <span className="model-card-size">GIF 768&times;384 px</span>
                            </div>
                        </button>
                    </div>
                </fieldset>

                <div
                    id="drop_zone" 
                    className={`drop-zone ${isDragOver ? 'dragover' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: '#623198', marginBottom: '5px' }}></i>
                    <p id="drop_zone_text">{file ? file.name : 'Drag & drop your GIF here, or click to select'}</p>
                    <input 
                        type="file" 
                        id="gif_file" 
                        className="file-input" 
                        name="gif_file" 
                        accept=".gif" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>
                
                <div className="size-limit-warning">
                     <p>Maximum file size: <span className="feature-word">2MB</span>. Only <span className="feature-word">GIF</span> format is supported.</p>
                </div>

                <button type="submit" className="upload-btn" disabled={isProcessing || !file || !model}>
                    {isProcessing ? 'Processing...' : 'Slice & Get Stream Deck Profile'}
                </button>

                {!isProcessing && (
                    <p className={`upload-helper ${model && file ? 'is-complete' : ''}`}>
                        <span className={model ? 'is-done' : ''}>
                            <i className={`fas ${model ? 'fa-check-circle' : 'fa-circle'}`} aria-hidden="true"></i>
                            Pick a model
                        </span>
                        <span className={file ? 'is-done' : ''}>
                            <i className={`fas ${file ? 'fa-check-circle' : 'fa-circle'}`} aria-hidden="true"></i>
                            Upload a GIF
                        </span>
                    </p>
                )}
            </form>

            <div className="support-block">
                <p className="support-message">Every coffee you buy helps bring these features to life faster! ☕</p>
                <div className="buy-me-a-coffee">
                    <div className="ko-fi">
                        <a href='https://ko-fi.com/W7W01DBHJE' target='_blank' onClick={() => trackEvent('click_kofi')}><img height='36' style={{border:'0px',height:'36px'}} src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' alt='Buy Me a Coffee at ko-fi.com' /></a>
                    </div>
                    <div className="paypal">
                        <form action="https://www.paypal.com/ncp/payment/96GEXVM9RCTLS" method="post" target="_blank">
                            <button type="submit" className="pp-96GEXVM9RCTLS" onClick={() => trackEvent('click_paypal')}>
                                <i className="fab fa-paypal" style={{ marginRight: '10px' }}></i>Buy me a coffee
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mt5 help-grid">
                <a
                    className="help-card"
                    href={`/sample/sample_${model === 'mini' ? '288x192' : model === 'plus' ? '384x192' : model === 'regular' ? '480x288' : '768x384'}.gif`}
                    download
                    onClick={() => trackEvent('click_sample_download', { model })}
                >
                    <span className="help-card-icon"><i className="fas fa-download" aria-hidden="true"></i></span>
                    <span className="help-card-title">Need a sample GIF?</span>
                    <span className="help-card-action">Download <span className="help-card-arrow" aria-hidden="true">&rarr;</span></span>
                </a>

                <a
                    className="help-card"
                    href="https://www.youtube.com/watch?v=rCs1jdN-w1Y"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('click_tutorial')}
                >
                    <span className="help-card-icon"><i className="fas fa-video" aria-hidden="true"></i></span>
                    <span className="help-card-title">Need help creating a GIF?</span>
                    <span className="help-card-action">Watch tutorial <span className="help-card-arrow" aria-hidden="true">&rarr;</span></span>
                </a>

                <a
                    className="help-card"
                    href="mailto:sebastiansperandio@gmail.com"
                    onClick={() => trackEvent('click_email')}
                >
                    <span className="help-card-icon"><i className="fas fa-envelope" aria-hidden="true"></i></span>
                    <span className="help-card-title">Need support for other models?</span>
                    <span className="help-card-action">Email me <span className="help-card-arrow" aria-hidden="true">&rarr;</span></span>
                </a>

                <a
                    className="help-card"
                    href="https://github.com/sebastiansperandio/Stream-Deck-BG"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('click_github')}
                >
                    <span className="help-card-icon">
                        <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                    </span>
                    <span className="help-card-title">Check the code?</span>
                    <span className="help-card-action">View on GitHub <span className="help-card-arrow" aria-hidden="true">&rarr;</span></span>
                </a>
            </div>

            <div className="mt20 upcoming-features">
                <div className="upcoming-features-header">
                    <div className="title-and-subtitle">
                        <h3>Coming Soon</h3>
                        <p>Your donations help fund the development of exciting new features:</p>
                    </div>
                </div>

                <div className="feature-card compact">
                    <h4>✨ AI-Powered Features</h4>
                    <ul>
                        <li><strong>Smart focus:</strong> Automatically detects faces or objects and centers them in the most relevant tiles.</li>
                        <li><strong>GIF quality enhancer:</strong> Improve resolution and clarity of low-quality GIFs with intelligent upscaling.</li>
                        <li><strong>Video to GIF AI:</strong> Upload a video and let AI choose and convert the best segment into a looping GIF background.</li>
                        <li><strong>Seamless loop detection:</strong> AI analyzes frames to identify and refine perfect loops.</li>
                        <li><strong>Optimized compression:</strong> Automatically reduce size by detecting redundant frames without losing quality.</li>
                    </ul>
                </div>

            </div>

            {/* Footer / Branding */}
            <div style={{
                textAlign: 'center',
                marginTop: '30px',
                paddingTop: '15px',
                borderTop: '1px solid #eee',
                width: '100%',
            }}>
                <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>
                    🏆 <strong>The original</strong> Stream Deck GIF Background Slicer — pioneered in 2024.
                </p>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    Developed with ❤️ by{' '}
                    <a href="mailto:sebastiansperandio@gmail.com" style={{ color: '#623198', fontWeight: 'bold', textDecoration: 'none' }}>
                        Sebastian Sperandio
                    </a>
                </p>
            </div>
        </div>
    );
}
