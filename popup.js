document.addEventListener('DOMContentLoaded', () => {
    const filenameInput = document.getElementById('filename');
    const includeTimestamp = document.getElementById('includeTimestamp');
    const finalFilename = document.getElementById('finalFilename');
    const captureBtn = document.getElementById('captureBtn');
    const captureVisibleBtn = document.getElementById('captureVisibleBtn');
    const status = document.getElementById('status');

    function updatePreview() {
        let filename = filenameInput.value.trim() || 'screenshot';
        if (includeTimestamp.checked) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            filename += `-${timestamp}`;
        }
        filename += '.png';
        finalFilename.textContent = filename;
        return filename;
    }

    function setStatus(message, type = '') {
        status.textContent = message;
        status.className = 'status ' + type;
    }

    function setCapturing(isCapturing) {
        captureBtn.disabled = isCapturing;
        captureVisibleBtn.disabled = isCapturing;
        if (isCapturing) {
            captureBtn.classList.add('capturing');
            captureVisibleBtn.classList.add('capturing');
            setStatus('Capturing screenshot...');
        } else {
            captureBtn.classList.remove('capturing');
            captureVisibleBtn.classList.remove('capturing');
        }
    }

    filenameInput.addEventListener('input', updatePreview);
    includeTimestamp.addEventListener('change', updatePreview);

    async function captureScreenshot(fullPage = true) {
        try {
            setCapturing(true);
            
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs[0]) {
                throw new Error('No active tab found');
            }

            const filename = updatePreview();
            
            await chrome.runtime.sendMessage({
                action: 'captureScreenshot',
                tabId: tabs[0].id,
                fullPage: fullPage,
                filename: filename
            });

            setStatus('Screenshot saved!', 'success');
        } catch (error) {
            setStatus('Failed to capture screenshot', 'error');
            console.error('Screenshot capture failed:', error);
        } finally {
            setCapturing(false);
        }
    }

    captureBtn.addEventListener('click', () => captureScreenshot(true));
    captureVisibleBtn.addEventListener('click', () => captureScreenshot(false));

    // Initialize preview
    updatePreview();
});