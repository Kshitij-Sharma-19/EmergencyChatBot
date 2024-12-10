const express = require("express");
const axios = require("axios");
const app = express();

require("dotenv").config(); // Load environment variables from .env file

app.use(express.json());

const path = require("path");
// const knowledgeBase = require("./knowledgeBase.json");

app.use(express.static(path.join(__dirname, "../frontend")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/// Load knowledge base and transform triggers into regex patterns in place
const fs = require('fs');
let knowledgeBase = JSON.parse(fs.readFileSync('./backend/knowledgeBase.json', 'utf-8'));



knowledgeBase = knowledgeBase.map(entry => {
    if (entry.trigger) {
        // Define keywords by splitting on spaces, matching core terms only
        const keywords = entry.trigger.split(/\s+/).map(word => `\\b${word}\\b`).join('|');
        return {
            ...entry,
            regex: new RegExp(keywords, "i") // Create regex to match any keyword in the trigger
        };
    }
    return entry;
});

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message || '';

    if (!userMessage) {
        return res.status(400).json({ reply: "Message cannot be empty." });
    }

    // Check the local knowledge base for a response
    const standardAnswer = knowledgeBase.find(entry => entry.regex && entry.regex.test(userMessage));

    if (standardAnswer) {
        return res.json({ reply: standardAnswer.response });
    }

    // If no match is found, send the user message to the Python Flask server
    try {
        const response = await axios.post("http://127.0.0.1:5000/api/chat", {
            message: userMessage
        });

        const botReply = response.data.reply;

        // Return the bot's reply back to the frontend
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error calling Python API:", error.message);
        res.status(500).json({ reply: "Sorry, I couldn't understand that." });
    }
});


// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
