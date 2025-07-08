# Recipe Recommender Chrome Extension

## Project Overview

The Recipe Recommender is a lightweight Chrome Extension designed to provide instant culinary inspiration. Leveraging the power of the Google Gemini API, this extension offers creative variations, healthy ingredient substitutions, or complementary side dish suggestions for any recipe.

**Key Features:**

-   **Manual Input:** Enter a recipe name or a list of ingredients directly into the extension's popup.
-   **Page Context (Automatic):** If the input field is left empty, the extension attempts to automatically extract the recipe title from the currently active webpage (useful for recipe blogs or cooking sites).
-   **AI-Powered Suggestions:** The Gemini API generates intelligent and practical culinary ideas based on your request.
-   **Modern UI:** Built with HTML, CSS, and styled using Tailwind CSS for a clean and responsive user interface.

## How It Works

1.  **User Interaction:**
    -   The user opens the extension popup.
    -   They can type a recipe/ingredients into the input field or leave it blank.
    -   Clicking "Get Recommendation" triggers the process.

2.  **Recipe Title Extraction (if input is empty):**
    -   The `popup.js` script sends a message to `content.js` (which runs on the active tab).
    -   `content.js` attempts to find common HTML elements that typically contain a recipe title (e.g., `h1.recipe-title`, `h1[itemprop="name"]`).
    -   If no specific element is found, it falls back to cleaning and using the page's `<title>` tag.
    -   The extracted title is sent back to `popup.js`.

3.  **Gemini API Integration:**
    -   `popup.js` constructs a prompt using the user-provided or extracted recipe title.
    -   It makes a `fetch` request to the Google Gemini API (`gemini-2.0-flash` model) with the culinary request.
    -   A loading indicator is displayed while the API call is in progress.

4.  **Display Results:**
    -   The API's text response (the recipe recommendation) is displayed in the `responseArea` of the popup.
    -   Error handling is included to manage API issues or unexpected responses.

## Files Structure

-   `manifest.json`: The manifest file for the Chrome Extension, defining its properties, permissions, and scripts.
-   `popup.html`: The HTML structure for the extension's popup window.
-   `popup.css`: Custom CSS for the popup, primarily for scrollbar styling. Tailwind CSS handles most of the design.
-   `popup.js`: The main JavaScript logic for the popup, handling user input, API calls, and displaying results.
-   `content.js`: A content script that runs on webpages to extract the recipe title.
-   `tailwind.min.js`: A minified version of the Tailwind CSS framework for styling.
-   `icons/`: Directory containing extension icons (`icon16.png`, `icon48.png`, `icon128.png`).

## Setup and Installation

To use this Chrome Extension:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YourGitHubUsername/recipe-recommender-chrome-extension.git](https://github.com/YourGitHubUsername/recipe-recommender-chrome-extension.git)
    cd recipe-recommender-chrome-extension
    ```
    **Note:** Ensure Git LFS is installed and configured before cloning, as it will handle the icon image files automatically.

2.  **Configure Gemini API Key:**
    **IMPORTANT:** Your API key should **NOT** be committed directly to version control in a public repository.
    -   Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to generate your Gemini API key.
    -   Open `popup.js`. Locate the line:
        ```javascript
        const apiKey = "AIzaSyDbowP62OL1-zhFE5OgtQLyObp_nBvFyJs"; // IMPORTANT: Replace with your actual API key
        ```
    -   **Replace the placeholder API key** with your actual Gemini API key.
        *For a production extension, you would typically use a backend server to handle API calls to keep your API key secure.*

3.  **Load the Extension in Chrome:**
    * Open Chrome and navigate to `chrome://extensions`.
    * Enable "Developer mode" by toggling the switch in the top right corner.
    * Click "Load unpacked" and select the cloned `recipe-recommender-chrome-extension` directory.
    * The extension should now appear in your list of extensions. You might need to pin it to your toolbar for easy access.

## Usage

1.  **Navigate to a Recipe Page:** Go to any website with a recipe (e.g., a food blog, a cooking site).
2.  **Click the Extension Icon:** Click the "Recipe Recommender" icon in your Chrome toolbar.
3.  **Get Recommendation:**
    * **Automatic:** Leave the input field empty and click "Get Recommendation". The extension will try to fetch the recipe title from the current page.
    * **Manual:** Type a recipe name (e.g., "Spaghetti Carbonara") or ingredients (e.g., "Chicken, broccoli, rice") into the input field and click "Get Recommendation".
4.  **View Suggestions:** The AI-powered recommendations will appear in the response area.

## Contributing

Contributions are welcome! If you have suggestions for improving recipe title extraction, enhancing AI prompts, adding new features (e.g., saving recipes, more interaction types), or improving the UI, please feel free to:
-   Open an issue to discuss.
-   Fork the repository and submit a pull request.