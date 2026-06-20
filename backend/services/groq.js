// ── GROQ: genera el brief en JSON ──
// Llama a la API de Groq (llama-3.3-70b-versatile) con un system prompt y user prompt,
// y devuelve el contenido como string JSON.
async function generateBriefGroq(systemPrompt, userPrompt) {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gemini-3.1-flash-lite",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.8,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

module.exports = { generateBriefGroq };
