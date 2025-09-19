

// bot.js (Node.js backend)
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/message', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
            sender: 'user',
            message: userMessage
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error communicating with Rasa server');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// script.js (Frontend JavaScript)
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage("You", message);
    userInput.value = "";

    fetch("/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message })
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(msg => appendMessage("Bot", msg.text));
        })
        .catch(error => console.error("Error:", error));
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = `${sender}: ${text}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
