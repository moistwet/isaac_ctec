
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
    const notesListDiv = document.getElementById('note-full-container');
    notesListDiv.innerHTML = ''; // Clear the previous content

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
            <div class="col-md-4 single-note-item all-category">
                <div class="card card-body">
                    <span class="side-stick"></span>
                    <h5 class="note-title text-truncate w-75 mb-0" data-noteHeading="${note.title}">${note.title}<i class="point fa fa-circle ml-1 font-10"></i></h5>
                    <div class="note-content">
                        <img src="${note_image}" alt="Note Image">
                        <p class="note-inner-content text-muted" data-noteContent="${note_text}">${note_text}</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="mr-1"><i class="fa fa-star favourite-note"></i></span>
                        <span class="mr-1"><i class="fa fa-trash remove-note"></i></span>
                        <div class="ml-auto edit-delete-buttons">
                            <span class="edit-button" onclick="openUpdateNoteModal('${note.id}','${note.title}','${note_text}')" data-noteId="${note.id}"><i class="fa fa-edit"></i> Edit</span>
                            <span class="delete-button" onclick="deleteNote(${note.id})" data-noteId="${note.id}"><i class="fa fa-trash"></i> Delete</span>
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

// Call the initialize function when the page loads
window.onload = initialize;

// Hide the add-note-modal on page load
document.addEventListener('DOMContentLoaded', function () {
    const addNoteModal = document.getElementById('add-note-modal');
    addNoteModal.style.display = 'none';
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
    addNoteForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const noteTitle = document.getElementById('note-title').value;
        const noteText = document.getElementById('note-text').value;
        const storedFileImageName = localStorage.getItem('file_image_name');
        console.log('Stored file image name:', storedFileImageName);
        const noteTotal = JSON.stringify([storedFileImageName, noteText]);

        // Construct the request body as a JSON object
        const requestBody = {
            title: noteTitle,
            text: noteTotal,
            profile_fk_to_text: 1 // Replace with the actual profile ID
        };

        // Send a POST request to your API endpoint
        fetch('https://ntsp8gbdf2.execute-api.us-east-1.amazonaws.com/this/notelibrary/?note=add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the API
                // For example, you can update the notes list on the page or show a success message
                console.log('Note added successfully:', data);
                // Assuming you have a function to render the updated notes list
                // renderNotesList(data);
            })
            .catch(error => {
                // Handle any errors that occur during the API call
                console.error('Error adding note:', error);
                // Show an error message to the user, etc.
            });

        // After successfully adding the note, you can update the notes list on the page, show a success message, etc.
        // For now, let's just hide the modal after form submission.
        modal.style.display = 'none';
        initialize();

    });
});
// JavaScript code for handling image file input and translation

document.getElementById('image-file').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgOutput = document.getElementById('image-output');
            imgOutput.textContent = 'Image uploaded: ' + file.name;
            const file_image_name = file.name;
            localStorage.setItem('file_image_name', file_image_name);

        };
        reader.readAsDataURL(file);
    }
});

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
function openUpdateNoteModal(noteId, noteTitle, noteText) {
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
        updateNote(noteId);
    });
}


// Rest of your code remains unchanged

// Function to handle the form submission when the "Update" button is clicked
async function updateNote(noteId) {

    const updateNoteIdInput = noteId;
    const updateNoteTitleInput = document.getElementById('updateNoteTitle').value;
    const updateNoteTextInput = document.getElementById('updateNoteText').value;
    console.log(updateNoteIdInput, updateNoteTitleInput, updateNoteTextInput);

    const apiUrl = 'https://ntsp8gbdf2.execute-api.us-east-1.amazonaws.com/this/notelibrary';

    const requestBody = {
        notelibrary_pk: updateNoteIdInput,
        title: updateNoteTitleInput,
        text: updateNoteTextInput
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
    const apiUrl = 'https://ntsp8gbdf2.execute-api.us-east-1.amazonaws.com/this/notelibrary/?notelibrary_pk=' + noteId ;

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




