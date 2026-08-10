// lib/ai/openrouter.ts

export async function callOpenRouter({
  messages,
  model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
  temperature = 0.7,
  max_tokens = 1000,
}: {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn('OPENROUTER_API_KEY not set, falling back to Hugging Face.');
    return callHuggingFace({ messages, temperature, max_tokens });
  }

  const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'Tech Current',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Fallback using Hugging Face
export async function callHuggingFace({
  messages,
  model = 'mistralai/Mistral-7B-Instruct-v0.1',
  temperature = 0.7,
  max_tokens = 500,
}: {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('No AI API key available. Set OPENROUTER_API_KEY or HUGGINGFACE_API_KEY.');
  }

  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      inputs: messages.map(m => m.content).join('\n'),
      parameters: {
        temperature,
        max_new_tokens: max_tokens,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data[0]?.generated_text || 'No response generated.';
}