const express = require('express');
const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API Key not configured" });

    try {
        const userPrompt = req.body.prompt;
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: userPrompt }] }] })
        });
        
        const data = await apiResponse.json();
        if (data.candidates && data.candidates[0].content) {
            res.json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: JSON.stringify(data) });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Render сам назначает порт через process.env.PORT, используем его обязательно!
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
