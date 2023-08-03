async function login(event) {
    const apiUrl = 'https://ntsp8gbdf2.execute-api.us-east-1.amazonaws.com/this/notelibrary/?profilelogin=1'; // Replace with your API endpoint URL
    const username = document.getElementById('username_login').value;
    const password = document.getElementById('password_login').value;

    // Construct the request body as a JSON object
    const requestBody = {
        username: username,
        password: password
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            // Handle the case where login is unsuccessful
            console.error('Login failed:', response.status, response.statusText);
            // Display error message or take appropriate action
            return { statusCode: response.status, body: 'Login failed.' };
        }

        // Login was successful, handle the response
        const responseData = await response.json();
        console.log('Login successful:', responseData);

        // Store the response data in the session storage
        sessionStorage.setItem('userData', JSON.stringify(responseData));

        // Return the response as-is
        return response;
    } catch (error) {
        // Handle any errors that occur during the API call
        console.error('Error during login:', error);
        // Display error message or take appropriate action
        return { statusCode: 500, body: 'An error occurred during login.' };
    }
}
