// Search function
function performSearch() {
  const searchQuery = document.getElementById("search-input").value;
  const endpointUrl =
    "https://aw0vadazs5.execute-api.us-east-1.amazonaws.com/test/search";

  // Make the HTTP request to your API using Fetch API
  fetch(`${endpointUrl}?q=${encodeURIComponent(searchQuery)}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the search results data and update the UI
      displayResults(data);
    })
    .catch((error) => {
      console.error("Error performing search:", error);
      // Handle any errors that occurred during the search
    });
}





function displayResults(results) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = ""; // Clear existing results

  // Check if there are search results
  if (results.length === 0) {
    // Show a message when there are no search results
    resultsContainer.style.display = "block"; // Show the results container
    resultsContainer.innerHTML =
      "<p class='no-results-message'>No search results found.</p>";
  } else {
    // Show the results container and populate the results
    resultsContainer.style.display = "block";

    // Create a container to hold the search result items
    const resultItemsContainer = document.createElement("div");
    resultItemsContainer.className = "result-items-container";

    // Iterate through the search results (which are text extracts) and display them
    for (const textExtract of results) {
      // Create a div element to hold the information of each text extract
      const textExtractDiv = document.createElement("div");
      textExtractDiv.className = "result-item";

      // Customize the display of each text extract
      const textElement = document.createElement("p");
      textElement.textContent = textExtract;

      // Append the textElement to the textExtractDiv container
      textExtractDiv.appendChild(textElement);

      // Append the textExtractDiv container to the main resultItemsContainer
      resultItemsContainer.appendChild(textExtractDiv);
    }

    // Append the main resultItemsContainer to the resultsContainer
    resultsContainer.appendChild(resultItemsContainer);
  }
}




