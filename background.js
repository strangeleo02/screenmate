async function captureVisibleArea(tabId, filename) {
    try {
        const screenshot = await chrome.tabs.captureVisibleTab(null, {
            format: 'png',
            quality: 100
        });

        const response = await fetch(screenshot);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                chrome.downloads.download({
                    url: reader.result,
                    filename: filename,
                    saveAs: true
                }, resolve);
            };
            reader.onerror = reject;
        });
    } catch (error) {
        console.error('Error capturing visible area:', error);
        throw error;
    }
}

async function captureFullPage(tabId, filename) {
    try {
        // Inject content script
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });

        // Wait a moment for content script to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get page dimensions
        const dimensions = await new Promise((resolve) => {
            chrome.tabs.sendMessage(tabId, { action: 'getDimensions' }, resolve);
        });

        if (!dimensions || !dimensions.width || !dimensions.height) {
            throw new Error('Failed to get page dimensions');
        }

        const viewportWidth = dimensions.width;
        const viewportHeight = dimensions.height;
        
        // Get browser viewport size
        const tab = await chrome.tabs.get(tabId);
        const browserViewport = await chrome.windows.get(tab.windowId);
        const browserHeight = browserViewport.height - 150; // Account for browser chrome
        
        // Calculate number of segments needed
        const segments = Math.ceil(viewportHeight / browserHeight);
        const screenshots = [];
        
        // Capture screenshots segment by segment
        for (let i = 0; i < segments; i++) {
            await new Promise((resolve) => {
                chrome.tabs.sendMessage(tabId, {
                    action: 'scrollTo',
                    x: 0,
                    y: i * browserHeight
                }, resolve);
            });
            
            // Wait for scroll and reflow
            await new Promise(resolve => setTimeout(resolve, 250));
            
            const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, {
                format: 'png'
            });
            
            screenshots.push(screenshot);
        }

        // Restore original scroll position
        await new Promise((resolve) => {
            chrome.tabs.sendMessage(tabId, { action: 'restoreScroll' }, resolve);
        });

        // Create canvas with the correct dimensions
        const canvas = new OffscreenCanvas(viewportWidth, viewportHeight);
        const ctx = canvas.getContext('2d');

        // Combine screenshots
        for (let i = 0; i < screenshots.length; i++) {
            const response = await fetch(screenshots[i]);
            const blob = await response.blob();
            const img = await createImageBitmap(blob);
            ctx.drawImage(img, 0, i * browserHeight);
        }

        // Convert canvas to blob
        const blob = await canvas.convertToBlob({ type: 'image/png' });
        
        // Convert blob to data URL and download
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                chrome.downloads.download({
                    url: reader.result,
                    filename: filename,
                    saveAs: true
                }, resolve);
            };
            reader.onerror = reject;
        });

    } catch (error) {
        console.error('Error capturing full page:', error);
        throw error;
    }
}

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'captureScreenshot' && message.tabId) {
        const capturePromise = message.fullPage ? 
            captureFullPage(message.tabId, message.filename) : 
            captureVisibleArea(message.tabId, message.filename);
            
        capturePromise
            .then(() => {
                console.log('Screenshot captured successfully');
            })
            .catch(error => {
                console.error('Screenshot capture failed:', error);
            });
            
        // Return true to indicate we'll send a response asynchronously
        return true;
    }
});