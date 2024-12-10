// async function sendMessage() {
//     const userInput = document.getElementById("user-input").value;
//     const chatBox = document.getElementById("chat-box");

//     // Append user message to chat
//     chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

//     // Send the message to the backend
//     const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userInput })
//     });

//     const data = await response.json();

//     // Append bot reply to chat
//     chatBox.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;

//     // Clear the input field
//     document.getElementById("user-input").value = "";
// }
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatBox = document.getElementById("chat-box");

    // Check if input is not empty
    if (userInput.trim() === '') return; // Do nothing if input is empty

    // Append user message to chat
    chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    // Clear the input field
    document.getElementById("user-input").value = "";

    // Send the message to the backend
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Append bot reply to chat
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('There was a problem with the fetch operation:', error);
        chatBox.innerHTML += `<p><strong>Bot:</strong> Sorry, something went wrong!</p>`;
    }
    


    // Scroll to the bottom of the chat
    chatBox.scrollTop = chatBox.scrollHeight; 
}

// Event listener for the "Send" button
document.getElementById('send-button').addEventListener('click', sendMessage);

// Event listener for the "Enter" key in the input field
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default action (like adding a newline)
        sendMessage(); // Call sendMessage function
    }
});


// Event listener for the file upload button to trigger file input
document.getElementById('attach-file-button').addEventListener('click', function() {
    document.getElementById('file-upload').click(); // Programmatically click the hidden file input
});

// Optional: Display selected file name in chat (you can enhance this as needed)
document.getElementById('file-upload').addEventListener('change', function() {
    const fileName = this.files.length > 0 ? this.files[0].name : '';
    if (fileName) {
        const chatBox = document.getElementById("chat-box");
        chatBox.innerHTML += `<p><strong>You:</strong> Attached file: ${fileName}</p>`;
    }
});
