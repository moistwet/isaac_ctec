function translateText(text, targetLang) {
    const eventData = {
        text: text,
        target_lang: targetLang
    };

    return fetch("https://y8k59vju2d.execute-api.us-east-1.amazonaws.com/test/translate", {
        method: "POST",
        body: JSON.stringify(eventData)
    })
        .then(response => response.json())
        .then(data => {
            const unescapedText = JSON.parse(data.body);
            const translatedText = unescapeUnicode(unescapedText);
            return translatedText;
        });
}

// Function to unescape Unicode characters
function unescapeUnicode(str) {
    return str.replace(/\\u([a-fA-F0-9]{4})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
}

// Get references to HTML elements
const translateButton = document.getElementById("translate-button");
const translatedTextOutput = document.getElementById("translated-text-output");
const noteTitleInput = document.getElementById("note-title");
const noteTextInput = document.getElementById("note-text");

// Add event listener to the "Translate" button
translateButton.addEventListener("click", () => {
    // Get the input text and target language (in this case, "zh" for Chinese)
    const inputText = noteTextInput.value;
    const targetLang = "zh";

    // Call the AWS Translate API and update the translated text output
    translateText(inputText, targetLang)
        .then(translatedText => {
            translatedTextOutput.textContent = translatedText;
            console.log("Translation:", translatedText);
        })
        .catch(error => {
            console.error("Error:", error);
        });
});