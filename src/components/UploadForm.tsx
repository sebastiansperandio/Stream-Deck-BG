'use client';

import React, { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import Script from 'next/script';
import { processGif } from '@/utils/processGif';

// Types
type ModelType = 'mini' | 'regular' | 'plus' | 'xl' | 'neo';

export default function UploadForm() {
    const [model, setModel] = useState<ModelType | ''>('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [successDownloadUrl, setSuccessDownloadUrl] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-download and confetti when success page appears
    useEffect(() => {
        if (!showSuccess || !successDownloadUrl) return;

        // Trigger automatic download
        const a = document.createElement('a');
        a.href = successDownloadUrl;
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
    }, [showSuccess, successDownloadUrl]);

    const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setModel(e.target.value as ModelType);
        setError('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !model) {
            setError('Please select a model and a GIF file.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const zipBlob = await processGif(file, model);
            const url = URL.createObjectURL(zipBlob);
            setSuccessDownloadUrl(url);
            setShowSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during processing.');
        } finally {
            setIsProcessing(false);
        }
    };

    const getModelMessage = () => {
        switch (model) {
            case 'mini': return 'For this model, you need a GIF of 288x192 pixels.';
            case 'regular': return 'For this model, you need a GIF of 480x288 pixels.';
            case 'plus': return 'For this model, you need a GIF of 384x192 pixels.';
            case 'xl': return 'For this model, you need a GIF of 768x384 pixels.';
            default: return '';
        }
    };

    if (showSuccess) {
        return (
            <div className="form-container">
                <h1>Success!</h1>
                <div className="success-message">
                    <i className="fas fa-check-circle success-icon"></i>
                    <p>Your GIF has been processed successfully!</p>
                    {successDownloadUrl && (
                        <>
                            <p className="download-info">Your download is ready.</p>
                            <div className="button-container">
                                <a href="/" className="return-button" onClick={(e) => {
                                    e.preventDefault();
                                    setShowSuccess(false);
                                    setFile(null);
                                    setModel('');
                                    setSuccessDownloadUrl('');
                                }}>
                                    <i className="fas fa-home"></i> Home Page
                                </a>
                                <a href={successDownloadUrl} download="stream_deck_gifs.zip" className="manual-download">
                                    <i className="fas fa-download"></i> Download ZIP
                                </a>
                            </div>
                        </>
                    )}
                     <div className="donation-suggestion mt20">
                            <p>Did you find this tool helpful? Consider supporting future development!</p>
                            <div className="buy-me-a-coffee">
                                <div className="ko-fi">
                                   <a href='https://ko-fi.com/W7W01DBHJE' target='_blank'><img height='36' style={{border:'0px',height:'36px'}} src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' alt='Buy Me a Coffee at ko-fi.com' /></a>
                                </div>
                                <div className="paypal">
                                    <form action="https://www.paypal.com/ncp/payment/96GEXVM9RCTLS" method="post" target="_blank" >
                                        <button type="submit" className="pp-96GEXVM9RCTLS">
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
            <h1>Stream Deck GIF Background Slicer</h1>
            <div className="gh-star-btn">
                <h3>IT&apos;S TOTALLY FREE</h3>
                <iframe
                    src="https://ghbtns.com/github-btn.html?user=sebastiansperandio&repo=Stream-Deck-BG&type=star&count=true"
                    frameBorder="0"
                    scrolling="0"
                    width="170"
                    height="30"
                    title="GitHub">
                </iframe>
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
                <div className="mt10 model-selector">
                    <label htmlFor="model"></label>
                    <img src="/img/Stream_Deck_Mini.png" alt="Stream Deck Mini" className={`device-image ${model === 'mini' ? 'active' : ''}`} data-model="mini" />
                    <img src="/img/Stream_Deck_MK2.png" alt="Stream Deck MK.2" className={`device-image ${model === 'regular' ? 'active' : ''}`} data-model="original" />
                    <img src="/img/Stream_Deck_Plus.png" alt="Stream Deck +" className={`device-image ${model === 'plus' ? 'active' : ''}`} data-model="plus" />
                    <img src="/img/Stream_Deck_Neo.png" alt="Stream Deck Neo" className={`device-image ${model === 'neo' ? 'active' : ''}`} data-model="neo" />
                    <img src="/img/Stream_Deck_XL.png" alt="Stream Deck XL" className={`device-image ${model === 'xl' ? 'active' : ''}`} data-model="xl" />
                    
                    <select name="model" id="model" value={model} onChange={handleModelChange} required>
                        <option value="" disabled>-- Select Model --</option>
                        <option value="mini">Stream Deck Mini (6 buttons - 288x192)</option>
                        <option value="regular">Stream Deck (15 buttons - 480x288)</option>
                        <option value="plus">Stream Deck Plus | Neo (8 buttons - 384x192)</option>
                        <option value="xl">Stream Deck XL (32 buttons - 768x384)</option>
                    </select>
                </div>

                {model && (
                    <p id="model_message" className="mt10 model_message">
                        <i className="fas fa-info-circle"></i> {getModelMessage()}
                    </p>
                )}

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

                <button type="submit" className="upload-btn" disabled={isProcessing || !file || !model} style={(!file || !model) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
                    {isProcessing ? 'Processing...' : 'Slice & Download GIF'}
                </button>
            </form>

            <div className="mt5 help-grid">
                <div className="help-card">
                    <p className="help-title">Need a sample GIF?</p>
                    <p className="mt5">
                        <a id="download_sample_link" href={`/sample/sample_${model === 'mini' ? '288x192' : model === 'plus' ? '384x192' : model === 'regular' ? '480x288' : '768x384'}.gif`} download>
                            <i className="fas fa-download" style={{ marginRight: '6px' }}></i>Download
                        </a>
                    </p>
                </div>
                <div className="help-card">
                    <p className="help-title">Need help creating a GIF?</p>
                    <p className="mt5">
                        <a href="https://www.youtube.com/watch?v=rCs1jdN-w1Y" target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-video" style={{ marginRight: '6px' }}></i>Watch tutorial
                        </a>
                    </p>
                </div>
                <div className="help-card">
                    <p className="help-title">Need support for other models?</p>
                    <p className="mt5">
                        <a href="mailto:sebastiansperandio@gmail.com">
                            <i className="fas fa-envelope" style={{ marginRight: '6px' }}></i>Email me
                        </a>
                    </p>
                </div>
                <div className="help-card">
                    <p className="help-title">Check the code?</p>
                    <p className="mt5">
                        <a href="https://github.com/sebastiansperandio/Stream-Deck-BG" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github" style={{ marginRight: '5px' }}></i>GitHub
                        </a>
                    </p>
                </div>
            </div>

            <div className="mt20 upcoming-features">
                <div className="upcoming-features-header">
                    <div className="title-and-subtitle">
                        <h3>Coming Soon</h3>
                        <p>Your donations help fund the development of exciting new features:</p>
                    </div>
                </div>
                
                <div className="feature-card">
                    <h4>✨ AI-Powered Features</h4>
                    <ul>
                        <li><strong>Smart focus:</strong> Automatically detects faces or objects and centers them in the most relevant tiles.</li>
                        <li><strong>GIF quality enhancer:</strong> Improve resolution and clarity of low-quality GIFs with intelligent upscaling.</li>
                        <li><strong>Video to GIF AI:</strong> Upload a video and let AI choose and convert the best segment into a looping GIF background.</li>
                        <li><strong>Seamless loop detection:</strong> AI analyzes frames to identify and refine perfect loops.</li>
                        <li><strong>Optimized compression:</strong> Automatically reduce size by detecting redundant frames without losing quality.</li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h4>Stream Deck Profile Export</h4>
                    <p>Soon you&apos;ll be able to export a complete Stream Deck profile with all the sliced GIFs already assigned to the right buttons - no more manual assignment!</p>
                </div>
                
                <div className="feature-card">
                    <h4>Stream Deck SDK Plugin</h4>
                    <p>We&apos;re developing a Stream Deck plugin that will connect directly to this tool, automating the entire process of creating animated backgrounds.</p>
                </div>

                <p className="support-message">Every coffee you buy helps bring these features to life faster! ☕</p>
                <div className="buy-me-a-coffee">
                    <div className="ko-fi">
                        <a href='https://ko-fi.com/W7W01DBHJE' target='_blank'><img height='36' style={{border:'0px',height:'36px'}} src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' alt='Buy Me a Coffee at ko-fi.com' /></a>
                    </div>
                    <div className="paypal">
                        <form action="https://www.paypal.com/ncp/payment/96GEXVM9RCTLS" method="post" target="_blank" >
                            <button type="submit" className="pp-96GEXVM9RCTLS">
                                <i className="fab fa-paypal" style={{ marginRight: '10px' }}></i>Buy me a coffee
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
