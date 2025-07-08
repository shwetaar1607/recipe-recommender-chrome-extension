// content.js
// This script runs on every page that matches the "matches" pattern in manifest.json

// Listen for messages from the extension (e.g., from popup.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getRecipeTitle") {
        // Try to find a common recipe title element
        let recipeTitle = null;

        // Common selectors for recipe titles
        const selectors = [
            'h1.recipe-title',          // Common on many recipe sites
            'h1[itemprop="name"]',      // Schema.org itemprop
            'h1.entry-title',           // WordPress style
            'h1.recipe-header__title',  // Another common pattern
            'h1',                       // Fallback to any h1
            'title'                     // Fallback to page title
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                recipeTitle = element.textContent.trim();
                break; // Found a title, stop searching
            }
        }

        // If no specific recipe title found, use the page title as a fallback
        if (!recipeTitle) {
            recipeTitle = document.title.replace(/ - Recipe.*$| \| .*$/, '').trim(); // Clean up common suffixes
        }

        sendResponse({ recipeTitle: recipeTitle });
        return true; // Indicate that the response will be sent asynchronously
    }
});
