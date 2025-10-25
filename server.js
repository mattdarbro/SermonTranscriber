require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/api/generate-metadata', async (req, res) => {
  const { transcription } = req.body;

  if (!transcription) {
    return res.status(400).json({ error: 'Transcription is required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: `Based on this one-minute sermon transcription, generate YouTube metadata in JSON format:

Transcription: "${transcription}"

Generate:
1. A compelling, SEO-friendly title (under 60 characters)
2. A detailed description (2-3 paragraphs, include key themes and takeaways)
3. 8-10 relevant tags
4. A brief summary (1-2 sentences)

Respond ONLY with valid JSON in this exact format:
{
  "title": "string",
  "description": "string",
  "tags": ["tag1", "tag2", ...],
  "summary": "string"
}

DO NOT include any markdown, backticks, or text outside the JSON object.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return res.status(response.status).json({ 
        error: `API error: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    const data = await response.json();
    let responseText = data.content[0].text.trim();
    
    // Clean up any markdown formatting
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const metadataJson = JSON.parse(responseText);
    res.json(metadataJson);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

