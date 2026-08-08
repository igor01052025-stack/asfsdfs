const express = require('express');
const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        if (!userPrompt) {
            return res.status(400).json({ error: 'Prompt is missing' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        // Прямой запрос к официальному API Gemini через встроенный fetch
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await apiResponse.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const replyText = data.candidates[0].content.parts[0].text;
            res.json({ reply: replyText });
        } else {
            res.status(500).json({ error: 'Invalid response from Gemini API', details: data });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running on port ' + PORT));
