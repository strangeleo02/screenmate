# Screenmate

A simple Chrome extension that allows you to capture full-page screenshots of web pages, including content that's not visible on your screen.

## Features

*   **Capture Full Page:** Take a screenshot of the entire webpage, not just the visible viewport.
*   **Easy to Use:** Single-click extension icon to initiate the screenshot process.
*   **Downloadable Image:** The screenshot is automatically downloaded as a PNG image to your default downloads folder.
*   **No Setup Required:** Works out-of-the-box with minimal fuss.

## How to Install

1.  **Download the Extension:** 
    *   If you're using the packaged extension (.crx file), you can drag and drop the file into your chrome extensions page.
    *  If you have the extension code locally, go to `chrome://extensions/` in your browser and enable "Developer mode" in the top right corner. Then click "Load unpacked" and select the folder where the extension code resides.
2.  **Enable the Extension:** Once installed, the extension icon (usually a camera or screen icon) will appear in your browser toolbar.

## How to Use

1.  **Navigate to the Page:** Go to the web page you want to capture a screenshot of.
2.  **Click the Extension Icon:** Click the Full Page Screenshot extension icon in your browser toolbar.
3.  **Wait for the Screenshot:** The extension will automatically scroll through the page and create the screenshot.
4.  **Download the Image:** The full-page screenshot will be downloaded as a PNG file to your default downloads folder. The file name will be generated using the current date and the title of the page.

##  Permissions

This extension requires the following permissions:
* `activeTab`: To access the current active tab.
* `downloads`: To download the screenshot image.
* `<all_urls>`: To work on any webpage 


## Troubleshooting

*   **Blank Screenshots:** If you get a blank screenshot, it might be due to complex website structures or infinite scrolling. Reload the page and try again.
*   **Slow Capture:** On very long pages, the screenshot process might take some time. Be patient.

##  Future Improvements (Optional)

*   Add settings/options to customize the screenshot behavior.
*   Implement better handling of complex website layouts.
*  Add support for capturing specific page elements.
*   Improve performance on slow-loading pages.

## Contributing

If you would like to contribute to this project, please feel free to fork this repository, make changes, and submit a pull request.

## Contact

If you have any questions or issues, please feel free to contact amaljerry02@gmail.com.
