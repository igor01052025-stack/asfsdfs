const express = require('express');
const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: req.body.prompt }] }] })
        });
        const data = await response.json();
        res.json({ reply: data.candidates[0].content.parts[0].text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000);
