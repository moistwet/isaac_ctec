
const apiKey = '9hHwRqpiZo6DxJ0tm5gac2hG5KR3QLMw49V2lmH8';
const url = 'https://ntsp8gbdf2.execute-api.us-east-1.amazonaws.com/this/notelibrary';







// Function to fetch all notes from the API
async function fetchAllNotes() {
    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': apiKey,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        console.log('Notes data:', data);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function renderNotesList(notes) {
    profile = sessionStorage.getItem('userData');
    profile = JSON.parse(profile);
    console.log(profile);
    profile_id = profile.profile;
    console.log(profile_id)
    console.log("render", notes)
    const notesListDiv = document.getElementById('note-full-container');
    //const notesListDiv = document.querySelector('.scroll-container');
    notesListDiv.innerHTML = ''; // Clear the previous content
    var notes = notes.filter(function (note) {
        return note.profile_fk_to_text == profile_id || note.profile_fk_to_text == 1;
    });
    console.log(notes);
    const searchInput = document.getElementById('searchbig');






    if (!notes || notes.length === 0) {
        // Handle error or no data scenario
        notesListDiv.innerHTML = '<p>No notes found.</p>';
        return;
    }

    for (let note of notes) {
        // console.log(note)
        let text, note_text, note_image;
        try {
            text = Array.isArray(eval(note.text)) ? eval(note.text) : note.text;
        } catch (error) {
            text = note.text;
        }
        if (typeof text === 'string') {
            note_text = text;
            note_image = '';
        }
        else {
            note_image = text[0];
            note_text = text[1];
        }

        // var notes_text = note.text
        // const note_texting = note.text.replace(/"/g, '').split(',');
        // const note_image = note_texting[0].slice(1);

        // const note_text = note_texting.length > 1 ? note_texting[1].slice(0, -1) : '';

        // Truncate the note text if needed
        // const maxLength = 30;
        // const truncatedNoteText = note_text.length > maxLength ? note_text.substring(0, maxLength) + '...' : note_text;

        const noteHTML = `
        <div class="col-md-4 single-note-item all-category notepad-note">
        <div class="card card-body notepad-card">
            <!-- Side Stick -->
            <span class="side-stick"></span>
    
            <!-- Note Title -->
            <h5 class="note-title text-truncate w-75 mb-0 notepad-title" data-noteHeading="${note.title}">
                ${note.title}<i class="point fa fa-circle ml-1 font-10"></i>
            </h5>
    
            <!-- Note Content -->
            <div class="note-content">
                <img src="${note_image}" alt="Note Image" class="notepad-image"  width="300">
                <p class="note-inner-content text-muted" data-noteContent="${note_text}">
                    ${note_text}
                </p>
            </div>
    
          
            
    
                <!-- Edit and Delete Buttons -->
                <div class="ml-auto edit-delete-buttons">
                    <span class="edit-button" onclick="openUpdateNoteModal('${note.id}','${note.title}','${note_text}','${note_image}')" data-noteId="${note.id}">
                        <i class="fa fa-edit"></i> Edit
                    </span>
                    <span class="delete-button" onclick="deleteNote(${note.id})" data-noteId="${note.id}">
                        <i class="fa fa-trash"></i> Delete
                    </span>
                </div>
            </div>
        </div>
    </div>

    
        `;

        notesListDiv.insertAdjacentHTML('beforeend', noteHTML);
    }
}



function renderNotesListsearch(notes) {
    profile = sessionStorage.getItem('userData');
    profile = JSON.parse(profile);
    console.log(profile);
    profile_id = profile.profile;
    console.log(profile_id)
    console.log("render", notes)
    const notesListDiv = document.getElementById('note-full-container');
    //const notesListDiv = document.querySelector('.scroll-container');
    notesListDiv.innerHTML = ''; // Clear the previous content
    var notes = notes.filter(function (note) {
        return note.profile_fk_to_text == profile_id;
    });
    console.log(notes)
    const searchInput = document.getElementById('searchbig');
    //get value
    const searchQuery = searchInput.value;
    //filter from text
    var notes = notes.filter(function (note) {
        return note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.text.toLowerCase().includes(searchQuery.toLowerCase());
    });






    if (!notes || notes.length === 0) {
        // Handle error or no data scenario
        notesListDiv.innerHTML = '<p>No notes found.</p>';
        return;
    }

    for (let note of notes) {
        // console.log(note)
        let text, note_text, note_image;
        try {
            text = Array.isArray(eval(note.text)) ? eval(note.text) : note.text;
        } catch (error) {
            text = note.text;
        }
        if (typeof text === 'string') {
            note_text = text;
            note_image = '';
        }
        else {
            note_image = text[0];
            note_text = text[1];
        }

        // var notes_text = note.text
        // const note_texting = note.text.replace(/"/g, '').split(',');
        // const note_image = note_texting[0].slice(1);

        // const note_text = note_texting.length > 1 ? note_texting[1].slice(0, -1) : '';

        // Truncate the note text if needed
        // const maxLength = 30;
        // const truncatedNoteText = note_text.length > maxLength ? note_text.substring(0, maxLength) + '...' : note_text;

        const noteHTML = `
        <div class="col-md-4 single-note-item all-category notepad-note">
        <div class="card card-body notepad-card">
            <!-- Side Stick -->
            <span class="side-stick"></span>
    
            <!-- Note Title -->
            <h5 class="note-title text-truncate w-75 mb-0 notepad-title" data-noteHeading="${note.title}">
                ${note.title}<i class="point fa fa-circle ml-1 font-10"></i>
            </h5>
    
            <!-- Note Content -->
            <div class="note-content">
                <img src="${note_image}" alt="Note Image" class="notepad-image"  width="300">
                <p class="note-inner-content text-muted" data-noteContent="${note_text}">
                    ${note_text}
                </p>
            </div>
    
          
            
    
                <!-- Edit and Delete Buttons -->
                <div class="ml-auto edit-delete-buttons">
                    <span class="edit-button" onclick="openUpdateNoteModal('${note.id}','${note.title}','${note_text}','${note_image}')" data-noteId="${note.id}">
                        <i class="fa fa-edit"></i> Edit
                    </span>
                    <span class="delete-button" onclick="deleteNote(${note.id})" data-noteId="${note.id}">
                        <i class="fa fa-trash"></i> Delete
                    </span>
                </div>
            </div>
        </div>
    </div>

    
        `;

        notesListDiv.insertAdjacentHTML('beforeend', noteHTML);
    }
}


// Entry point function
async function initialize() {
    const notes = await fetchAllNotes();
    renderNotesList(notes);
}

async function initializesearch() {
    const notes = await fetchAllNotes();
    renderNotesListsearch(notes);
}


// Call the initialize function when the page loads
window.onload = initialize;

// Hide the add-note-modal on page load
document.addEventListener('DOMContentLoaded', function () {
    const addNoteModal = document.getElementById('add-note-modal');
    addNoteModal.style.display = 'none';
    initialize();
});

document.addEventListener('DOMContentLoaded', function () {
    const btnAddNote = document.getElementById('btn-add-note');
    const modal = document.getElementById('add-note-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const addNoteForm = document.getElementById('add-note-form');



    // Show the modal when the "Add Note" button is clicked
    btnAddNote.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    // Hide the modal when the close button or outside the modal is clicked
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission for adding a new note
    // Handle form submission for adding a new note
    addNoteForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const noteTitle = document.getElementById('note-title').value;
        const noteText = document.getElementById('note-text').value;
        const storedFileImageName = localStorage.getItem('file_name');
        console.log('Stored file image name:', storedFileImageName);
        profile = sessionStorage.getItem('userData');
        profile = JSON.parse(profile);
        console.log(profile);
        profile_id = profile.profile;
        console.log(profile_id)


        const imageFileBase64 = localStorage.getItem('file_base64');
        try {
            const imagelink = await uploadfiletos3(storedFileImageName, imageFileBase64);
            console.log('Stored file image Base64:', imagelink);
            const noteTotal = JSON.stringify([imagelink, noteText]);

            // Construct the request body as a JSON object
            const requestBody = {
                title: noteTitle,
                text: noteTotal,
                profile_fk_to_text: profile_id // Replace with the actual profile ID
            };

            // Send a POST request to your API endpoint
            const response = await fetch('https://ntsp8gbdf2.execute-api.us-east-1.amazonaws.com/this/notelibrary/?note=add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            // Handle the response from the API
            // For example, you can update the notes list on the page or show a success message
            console.log('Note added successfully:', data);
            // Assuming you have a function to render the updated notes list
            // renderNotesList(data);

            // After successfully adding the note, you can update the notes list on the page, show a success message, etc.
            // For now, let's just hide the modal after form submission.
            modal.style.display = 'none';
            initialize();
        } catch (error) {
            console.error('Error adding note:', error.message);
            // Show an error message to the user, etc.
            initialize();
            //set add-notemodal to hidden
            modal.style.display = 'none';
        }
    });

});

async function callRekognitionAPI(base64String) {
    const apiEndpoint = "https://4zq50fzfkj.execute-api.us-east-1.amazonaws.com/test1/image";
    const payload = JSON.stringify({
        body: base64String,
    });

    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: payload,
    });

    const data = await response.json();
    if (response.status === 200) {
        return {
            labels: data.body.labels,
            text: data.body.text,
        };
    } else {
        throw new Error(`API endpoint returned an error: ${JSON.stringify(data)}`);
    }
}

function clearResultTable() {
    const resultTableBody = document.getElementById("result-table-body");
    resultTableBody.innerHTML = "";
}

function displayrecResult(imageParticulars) {
    const resultTableBody = document.getElementById("result-table-body");
    resultTableBody.innerHTML = "";

    const labelsArray = imageParticulars.labels.split(" ");
    const textArray = imageParticulars.text.split(" ");

    const numRows = Math.max(labelsArray.length, textArray.length);

    for (let i = 0; i < numRows; i++) {
        const label = labelsArray[i] || "";
        const text = textArray[i] || "";

        const row = document.createElement("tr");
        row.className = "result-table-row"; // Add class to style using flexbox

        const labelCell = document.createElement("td");
        const textCell = document.createElement("td");

        labelCell.textContent = label;
        textCell.textContent = text;

        row.appendChild(labelCell);
        row.appendChild(textCell);

        resultTableBody.appendChild(row);
    }
}


document.getElementById('image-file').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        clearResultTable();
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgInput = document.getElementById('image-file');
            const imgOutput = document.getElementById('image-output');
            const imageFile = imgInput.files[0];
            const imageFileBase64 = e.target.result.split(',')[1]; // Get the Base64 data from the reader
            const fileName = imageFile.name; // Get the file name

            console.log('Image file Base64:', imageFileBase64);
            console.log('File Name:', fileName);

            localStorage.setItem('file_base64', imageFileBase64); // Save the Base64 data in local storage
            localStorage.setItem('file_name', fileName); // Save the file name in local storage

            // Call the function to get the image particulars and handle the resolved value
            callRekognitionAPI(imageFileBase64)
                .then(imageParticulars => {
                    console.log("Image Labels:", imageParticulars.labels);
                    console.log("Detected Text:", imageParticulars.text);
                    displayrecResult(imageParticulars);
                    sessionStorage.setItem('imageParticulars', JSON.stringify(imageParticulars));


                    // Optionally, you can use the labels and text as needed
                })
                .catch(error => {
                    console.error("Error recognizing image:", error);
                    // Show an error message to the user, etc.
                });

            // Optionally, you can set the image source to display the selected image
            imgOutput.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


async function uploadfiletos3(fileName, base64String) {
    // Your API endpoint URL
    const apiEndpoint = "https://o04hsqsfab.execute-api.us-east-1.amazonaws.com/prod/image";

    // Create a JSON payload with the base64 string and file name
    const payload = JSON.stringify({
        base64_string: base64String,
        file_name: fileName
    });

    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: payload
        });

        const data = await response.json();

        if (response.status === 200) {
            const fileUrl = data.body;
            return fileUrl; // Return the file URL
        } else {
            throw new Error(`API endpoint returned an error: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        throw new Error(`Error calling API endpoint: ${error.message}`);
    }
}


document.getElementById('translate-button').addEventListener('click', function () {
    // Replace this with your code for text translation using AWS Translate or any other translation service.
    // For example, you can use AWS SDK for JavaScript to make a call to the AWS Translate API.

    // For demo purposes, let's just display a sample translated text.
    const translatedText = 'This is a translated text.';
    const translatedTextOutput = document.getElementById('translated-text-output');
    translatedTextOutput.textContent = translatedText;
});

document.addEventListener("DOMContentLoaded", function () {
    // Get the chat icon and modal elements
    const chatIcon = document.getElementById("chat-icon");
    const chatModal = document.getElementById("chat-modal");

    // Get the close button in the modal
    const closeButton = chatModal.querySelector(".close");

    // Function to close the chat modal
    function closeChatModal() {
        chatModal.style.display = "none";
    }

    // Event listener for the chat icon click
    chatIcon.addEventListener("click", showChatModal);

    // Event listener for the close button click
    closeButton.addEventListener("click", closeChatModal);
});

// Function to open the update note modal and populate the form fields with existing note data
function openUpdateNoteModal(noteId, noteTitle, noteText, note_image) {
    const updateNoteModal = document.getElementById('updateNoteModal');
    updateNoteModal.style.display = 'block';

    const updateNoteTitleInput = document.getElementById('updateNoteTitle');
    const updateNoteTextInput = document.getElementById('updateNoteText');
    const submitUpdateButton = document.getElementById('submit_update');

    // Set the input values to the current note data
    updateNoteTitleInput.value = noteTitle;
    updateNoteTextInput.value = noteText;

    // Add event listener to the "Update Note" button
    submitUpdateButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        updateNote(noteId, note_image);
    });
}


// Rest of your code remains unchanged

// Function to handle the form submission when the "Update" button is clicked
async function updateNote(noteId, note_image) {

    const updateNoteIdInput = noteId;
    const updateNoteTitleInput = document.getElementById('updateNoteTitle').value;
    const updateNoteTextInput = document.getElementById('updateNoteText').value;
    console.log(updateNoteIdInput, updateNoteTitleInput, updateNoteTextInput);
    var noting = JSON.stringify([note_image, updateNoteTextInput]);

    const apiUrl = 'https://ntsp8gbdf2.execute-api.us-east-1.amazonaws.com/this/notelibrary';

    const requestBody = {
        notelibrary_pk: updateNoteIdInput,
        title: updateNoteTitleInput,
        text: noting
    };
    console.log(requestBody); // Check the requestBody object in the console

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            console.error('Note update failed:', response.status, response.statusText);
            return;
        }

        // If the note was updated successfully, close the modal and refresh the notes list
        const updateNoteModal = document.getElementById('updateNoteModal');
        updateNoteModal.style.display = 'none';

        initialize(); // Refresh the notes list
    } catch (error) {
        console.error('Error during note update:', error);
    }
}



async function deleteNote(noteId) {
    const apiUrl = 'https://ntsp8gbdf2.execute-api.us-east-1.amazonaws.com/this/notelibrary/?notelibrary_pk=' + noteId;

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },

        });

        if (!response.ok) {
            console.error('Note deletion failed:', response.status, response.statusText);
            return;
        }

        // Note deleted successfully, you can handle any further actions or UI updates here

        // For example, if you want to refresh the notes list after deletion, you can call initialize()
        initialize();
    } catch (error) {
        console.error('Error during note deletion:', error);
    }
}




// Move the translateText function outside of the translate function and define it in the global scope.
function translateText(inputText, targetLang) {
    // Create the request body in the format expected by the API
    const requestBody = {
        text: inputText,
        lang_code: targetLang
    };

    // Send the request to your AWS Lambda API
    return fetch('https://y8k59vju2d.execute-api.us-east-1.amazonaws.com/test/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API endpoint returned an error: ${response.status} - ${response.statusText}`);
            }
            return response.text(); // Return the response body as text
        })
        .catch(error => {
            throw new Error(`Error occurred during translation: ${error.message}`);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem("userData") !== null) {
        document.getElementById("everythingnote").style.display = "block";
        initialize();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registrationForm");
    registrationForm.addEventListener("submit", handleRegistration);
});

function registerUser() {
    const apiUrl = "https://l8ctzu3mnb.execute-api.us-east-1.amazonaws.com/test/face";
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const imageInput = document.getElementById("imageInput");

    const imageFile = imageInput.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
        const imageFileBase64 = e.target.result.split(",")[1];

        const requestBody = {
            httpMethod: "POST", // Include the httpMethod field
            body: JSON.stringify({
                username: username,
                password: password,
                face: imageFileBase64,
            }),
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => response.json())
            .then((data) => {
                // Process the API response here if needed
                console.log("Registration response:", data);
                // You can redirect to a success page or show a success message here
            })
            .catch((error) => {
                // Handle any errors that occurred during the API call
                console.error("Error during registration:", error);
                // You can display an error message here or handle the error as you prefer
            });
    };

    fileReader.readAsDataURL(imageFile); // Read and load the selected image as base64
}


const logoutButton = document.getElementById('logout');

function logout() {
    // Clear the user data from session storage
    sessionStorage.clear();
    //hide logout button based on id
    document.getElementById('Logout').style.display = 'none';
    document.getElementById('everythingnote').style.display = 'none';
}

async function copyToClipboard(event) {
    if (event) {
        event.preventDefault();
    }
    const textbox = sessionStorage.getItem('imageParticulars');
    const text = JSON.parse(textbox).text;
    const latest = document.getElementById('note-text');
    if (latest.value == '') {
        document.getElementById('note-text').value = text;
        //set value in id
    } else {
        document.getElementById('note-text').value = latest.value + text;
    }
}