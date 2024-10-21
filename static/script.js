// Array to hold user messages and bot responses
let conversationHistory = [];

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
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
    messageElement.textContent = text;
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
