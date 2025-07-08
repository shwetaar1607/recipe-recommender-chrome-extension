// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const recipeInput = document.getElementById('recipeInput');
    const recommendButton = document.getElementById('recommendButton');
    const responseArea = document.getElementById('responseArea');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const messageBoxClose = document.getElementById('messageBoxClose');

    // Function to display custom message box
    function showMessageBox(message) {
        messageText.textContent = message;
        messageBox.classList.remove('hidden');
        messageBox.setAttribute('aria-hidden', 'false');
    }

    // Function to hide custom message box
    function hideMessageBox() {
        messageBox.classList.add('hidden');
        messageBox.setAttribute('aria-hidden', 'true');
    }

    // Event listener for message box close button
    messageBoxClose.addEventListener('click', hideMessageBox);

    recommendButton.addEventListener('click', async () => {
        let userRecipe = recipeInput.value.trim();
        responseArea.innerHTML = '<p class="text-gray-600">Your recommendations will appear here.</p>'; // Clear previous response
        loadingIndicator.classList.remove('hidden'); // Show loading indicator
        loadingIndicator.setAttribute('aria-hidden', 'false');
        responseArea.setAttribute('aria-busy', 'true'); // Indicate that the area is busy

        if (!userRecipe) {
            // If user input is empty, try to get recipe title from the active tab
            try {
                // Query for the active tab in the current window
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

                if (tab && tab.id) { // Ensure tab and tab.id exist
                    // Execute a script in the active tab to get its title directly.
                    // The function passed to executeScript runs in the content script's isolated world
                    // and its return value is directly passed back to the result of executeScript.
                    const result = await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: () => {
                            let pageRecipeTitle = null;
                            const selectors = [
                                'h1.recipe-title',
                                'h1[itemprop="name"]',
                                'h1.entry-title',
                                'h1.recipe-header__title',
                                'h1',
                                'title'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element && element.textContent.trim()) {
                                    pageRecipeTitle = element.textContent.trim();
                                    break;
                                }
                            }

                            if (!pageRecipeTitle) {
                                pageRecipeTitle = document.title.replace(/ - Recipe.*$| \| .*$/, '').trim();
                            }
                            return pageRecipeTitle; // Directly return the found title
                        }
                    });
                    // The result is an array of results (one per frame, usually one main frame)
                    userRecipe = result[0].result; // Get the actual return value from the executed script
                }
            } catch (error) {
                console.error("Error getting recipe from tab:", error);
                showMessageBox("Could not get recipe from the current page. Please enter it manually.");
            }
        }

        if (!userRecipe) {
            loadingIndicator.classList.add('hidden');
            loadingIndicator.setAttribute('aria-hidden', 'true');
            responseArea.setAttribute('aria-busy', 'false');
            showMessageBox("Please enter a recipe or navigate to a recipe page.");
            return;
        }

        const prompt = `Given the recipe or ingredients: "${userRecipe}", suggest a creative variation, a healthy substitution for one ingredient, or a complementary side dish. Focus on providing practical and interesting culinary ideas. Format your response clearly.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        const payload = {
            contents: chatHistory
        };

        const apiKey = "GEMINI_API_KEY"; // IMPORTANT: Replace with your actual API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                responseArea.innerHTML = `<p class="text-gray-800 whitespace-pre-wrap">${text}</p>`;
            } else {
                responseArea.innerHTML = '<p class="text-red-600">No recommendation found. Please try again with a different input.</p>';
                console.warn("Unexpected API response structure:", result);
            }
        } catch (error) {
            console.error("Error fetching recommendation:", error);
            responseArea.innerHTML = `<p class="text-red-600">Error: ${error.message}. Could not get recommendation. Please check your input or try again later.</p>`;
        } finally {
            loadingIndicator.classList.add('hidden'); // Hide loading indicator
            loadingIndicator.setAttribute('aria-hidden', 'true');
            responseArea.setAttribute('aria-busy', 'false');
        }
    });
});
