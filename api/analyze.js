export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'La clé OPENAI_API_KEY n’est pas configurée sur le serveur.' });

  const { imageData } = req.body || {};
  if (!imageData || typeof imageData !== 'string' || !imageData.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Image manquante ou invalide.' });
  }
  if (imageData.length > 8_000_000) return res.status(413).json({ error: 'Image trop volumineuse.' });

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            estimated_grams: { type: 'number' },
            calories: { type: 'number' },
            protein_g: { type: 'number' }
          },
          required: ['name','estimated_grams','calories','protein_g']
        }
      },
      total_calories: { type: 'number' },
      total_protein_g: { type: 'number' },
      confidence: { type: 'string', enum: ['faible','moyenne','bonne'] },
      notes: { type: 'string' }
    },
    required: ['items','total_calories','total_protein_g','confidence','notes']
  };

  const prompt = `Analyse cette photo de repas pour une application personnelle de suivi nutritionnel.
Identifie les aliments visibles et estime pour chacun la portion en grammes, les calories et les protéines en grammes.
Puis calcule les totaux.
Reste prudent : les huiles, sauces, ingrédients cachés et portions sont difficiles à déduire d'une photo.
N'invente pas de précision excessive. Si quelque chose est incertain, explique-le brièvement dans notes.
Le résultat est une estimation nutritionnelle, pas un avis médical.`;

  try {
    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5.6-luna',
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: imageData, detail: 'high' }
          ]
        }],
        text: {
          format: {
            type: 'json_schema',
            name: 'meal_analysis',
            strict: true,
            schema
          }
        },
        max_output_tokens: 1200
      })
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      console.error(data);
      return res.status(apiResponse.status).json({ error: data?.error?.message || 'Erreur du service d’analyse.' });
    }
    const outputText = data.output_text || data.output?.flatMap(item => item.content || []).find(c => c.type === 'output_text')?.text;
    if (!outputText) return res.status(502).json({ error: 'Réponse IA vide.' });
    const parsed = JSON.parse(outputText);
    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Analyse impossible pour le moment.' });
  }
}
