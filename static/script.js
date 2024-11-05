document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggle-switch');
    const currentTheme = localStorage.getItem('theme');

    // Set the initial theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleSwitch.checked = true;
    }

    // Add event listener to switch toggle
    toggleSwitch.addEventListener('change', function () {
        if (toggleSwitch.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
});

function toggleTheme() {
    const chatContainer = document.getElementById('chat-container');
    const themeToggle = document.getElementById('theme-toggle');

    // Toggle between light and dark themes
    if (chatContainer.classList.contains('light-theme')) {
        chatContainer.classList.remove('light-theme');
        chatContainer.classList.add('dark-theme');
        themeToggle.textContent = '☀️';  // Change icon to sun
    } else {
        chatContainer.classList.remove('dark-theme');
        chatContainer.classList.add('light-theme');
        themeToggle.textContent = '🌙';  // Change icon to moon
    }
}


// Array to hold user messages and bot responses
let conversationHistory = [];

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        const timestamp = new Date().toLocaleString();
        addMessage('user', message);
        conversationHistory.push({ type: 'user', text: message });
        input.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Send messages to the server
        sendMessagesToServer(conversationHistory);
    }
}

function sendMessagesToServer(conversationHistory) {
    fetch('/bot_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            conversation_history: conversationHistory
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        if (data.bot_message) {
            // Remove typing indicator and add bot message
            removeTypingIndicator();
            addMessage('bot', data.bot_message);
            conversationHistory.push({ type: 'bot', text: data.bot_message });
        }
    })
    .catch(error => console.error('Error sending messages to server:', error));
}

function addMessage(sender, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.innerHTML = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing dots indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'bot-message', 'typing');
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    messagesContainer.appendChild(typingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remove typing dots indicator
function removeTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}

// Allow sending message with Enter key
document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


// document.addEventListener('DOMContentLoaded', function () {
//     const toggleSwitch = document.getElementById('toggle-switch');
//     const currentTheme = localStorage.getItem('theme');

//     // Set the initial theme
//     if (currentTheme === 'dark') {
//         document.body.classList.add('dark-mode');
//         toggleSwitch.checked = true;
//     }

//     // Add event listener to switch toggle
//     toggleSwitch.addEventListener('change', function () {
//         if (toggleSwitch.checked) {
//             document.body.classList.add('dark-mode');
//             localStorage.setItem('theme', 'dark');
//         } else {
//             document.body.classList.remove('dark-mode');
//             localStorage.setItem('theme', 'light');
//         }
//     });
// });

// function toggleTheme() {
//     const chatContainer = document.getElementById('chat-container');
//     const themeToggle = document.getElementById('theme-toggle');

//     // Toggle between light and dark themes
//     if (chatContainer.classList.contains('light-theme')) {
//         chatContainer.classList.remove('light-theme');
//         chatContainer.classList.add('dark-theme');
//         themeToggle.textContent = '☀️';  // Change icon to sun
//     } else {
//         chatContainer.classList.remove('dark-theme');
//         chatContainer.classList.add('light-theme');
//         themeToggle.textContent = '🌙';  // Change icon to moon
//     }
// }

// // Array to hold user messages and bot responses
// let conversationHistory = [];

// function sendMessage() {
//     const input = document.getElementById('message-input');
//     const message = input.value.trim();
//     if (message) {
//         addMessage('user', message);
//         conversationHistory.push({ type: 'user', text: message });
//         input.value = '';

//         // Show typing indicator
//         showTypingIndicator();

//         // Send messages to the server and handle streaming
//         streamMessagesFromServer(conversationHistory);
//     }
// }

// function streamMessagesFromServer(conversationHistory) {
//     // Open a new connection to receive streaming response
//     fetch('/bot_response', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             conversation_history: conversationHistory
//         })
//     })
//     .then(response => {
//         // Check if response is readable as a stream
//         const reader = response.body.getReader();
//         const decoder = new TextDecoder();
//         let botMessage = '';

//         // Function to read the stream chunk by chunk
//         function readStream() {
//             reader.read().then(({ done, value }) => {
//                 if (done) {
//                     // Stream complete, finalize the message
//                     removeTypingIndicator();
//                     addMessage('bot', botMessage);
//                     conversationHistory.push({ type: 'bot', text: botMessage });
//                     return;
//                 }
                
//                 // Decode the chunk and add it to the bot's message progressively
//                 const chunk = decoder.decode(value, { stream: true });
//                 botMessage += chunk;
                
//                 // Update the bot message display with the latest chunk
//                 updateTypingMessage(botMessage);
                
//                 // Continue reading the stream
//                 readStream();
//             });
//         }

//         // Start reading the stream
//         readStream();
//     })
//     .catch(error => {
//         console.error('Error receiving streaming response from server:', error);
//         removeTypingIndicator();
//     });
// }

// function addMessage(sender, text) {
//     const messagesContainer = document.getElementById('chat-messages');
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message', `${sender}-message`);
//     messageElement.innerHTML = text;
//     messagesContainer.appendChild(messageElement);
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;
// }

// // Show typing dots indicator
// function showTypingIndicator() {
//     const messagesContainer = document.getElementById('chat-messages');
//     const typingElement = document.createElement('div');
//     typingElement.classList.add('message', 'bot-message', 'typing');
//     typingElement.id = 'typing-indicator';
//     messagesContainer.appendChild(typingElement);
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;
// }

// // Update typing indicator with the streamed message content
// // function updateTypingMessage(text) {
// //     const typingElement = document.getElementById('typing-indicator');
// //     if (typingElement) {
// //         typingElement.innerHTML = text;
// //     }
// // }

// // Store the last received chunk to avoid duplication
// let lastDisplayedContent = "";

// function updateTypingMessage(text) {
//     let typingElement = document.getElementById('typing-indicator');
    
//     // If the typing element does not exist, create it
//     if (!typingElement) {
//         const messagesContainer = document.getElementById('chat-messages');
//         typingElement = document.createElement('div');
//         typingElement.classList.add('message', 'bot-message', 'typing');
//         typingElement.id = 'typing-indicator';
//         messagesContainer.appendChild(typingElement);
//     }
    
//     // Only update the typing element with new content
//     const newText = text.slice(lastDisplayedContent.length);
//     typingElement.innerHTML += newText;
    
//     // Update lastDisplayedContent with the latest text received
//     lastDisplayedContent = text;

//     // Ensure the messages container scrolls to the latest content
//     const messagesContainer = document.getElementById('chat-messages');
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;
// }

// // Remove typing dots indicator
// function removeTypingIndicator() {
//     const typingElement = document.getElementById('typing-indicator');
//     if (typingElement) {
//         typingElement.remove();
//     }
// }

// // Allow sending message with Enter key
// document.getElementById('message-input').addEventListener('keypress', function(e) {
//     if (e.key === 'Enter') {
//         sendMessage();
//     }
// });

// function sendMessagesToServer(conversationHistory) {
//     const eventSource = new EventSource('/bot_response');
    
//     // Show typing indicator
//     showTypingIndicator();
    
//     // Listen to streamed responses
//     eventSource.onmessage = function(event) {
//         const chunk = event.data;
        
//         // Update the typing indicator with the latest chunk
//         updateTypingMessage(chunk);
//     };
    
//     eventSource.onerror = function() {
//         console.error("Error in receiving response from server.");
//         removeTypingIndicator();
//         eventSource.close();
//     };

//     eventSource.onclose = function() {
//         // Finalize the message
//         removeTypingIndicator();
//         addMessage('bot', lastDisplayedContent);  // Add the accumulated message as final bot response
//         conversationHistory.push({ type: 'bot', text: lastDisplayedContent });
//         eventSource.close();
//     };
// }

