// Store scroll position in a way that avoids redeclaration
let savedScrollPos = null;

function initScrollPos() {
  if (savedScrollPos === null) {
    savedScrollPos = {
      x: window.scrollX,
      y: window.scrollY
    };
  }
}

function getFullPageDimensions() {
  return new Promise((resolve) => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const body = document.body;
      const html = document.documentElement;

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      const width = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      );

      resolve({ width, height });
    });
  });
}

// Initialize scroll position when script loads
initScrollPos();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getDimensions') {
    getFullPageDimensions().then(dimensions => {
      sendResponse(dimensions);
    });
    return true; // Keep channel open for async response
  } 
  
  if (request.action === 'scrollTo') {
    window.scrollTo(request.x, request.y);
    // Wait for any lazy-loaded content and reflow
    setTimeout(() => {
      sendResponse({ scrolled: true });
    }, 250); // Increased delay for better reliability
    return true;
  }
  
  if (request.action === 'restoreScroll') {
    window.scrollTo(savedScrollPos.x, savedScrollPos.y);
    sendResponse({ restored: true });
    return true;
  }
});