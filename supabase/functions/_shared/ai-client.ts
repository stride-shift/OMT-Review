// AI Client for Battle Pack Generator
// Supports OpenAI and Google Gemini models

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequestConfig {
  model: string;
  messages: AIMessage[];
  max_tokens?: number;
  temperature?: number;
}

export interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  config: AIRequestConfig,
  apiKey: string,
  signal?: AbortSignal
): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: config.messages,
      max_tokens: config.max_tokens || 4096,
      temperature: config.temperature || 0.7,
    }),
    signal,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Call Google Gemini API
 */
async function callGemini(
  config: AIRequestConfig,
  apiKey: string,
  signal?: AbortSignal
): Promise<AIResponse> {
  // Convert messages to Gemini format
  const contents = config.messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Add system instruction if present
  const systemMessage = config.messages.find(m => m.role === 'system');
  const systemInstruction = systemMessage
    ? { parts: [{ text: systemMessage.content }] }
    : undefined;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: {
          maxOutputTokens: config.max_tokens || 4096,
          temperature: config.temperature || 0.7,
        },
      }),
      signal,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  // Convert to OpenAI format
  return {
    choices: [{
      message: {
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      },
    }],
  };
}

/**
 * Call Gemini Image Generation API
 * Uses gemini-3-pro-image-preview model for slide generation
 * Matches the exact configuration from the working Next.js version
 */
export async function callGeminiImageGeneration(
  prompt: string,
  apiKey: string,
  logoBase64?: string,
  signal?: AbortSignal
): Promise<string> {
  // Build parts array - include logo image if provided
  const parts: any[] = [];

  if (logoBase64) {
    parts.push({
      inline_data: {
        mime_type: 'image/png',
        data: logoBase64
      }
    });
    parts.push({
      text: `LOGO REFERENCE: The image above shows the logo. You MUST use this EXACT logo image pixel-for-pixel in the generated slide. DO NOT recreate, redraw, or modify the logo in any way - copy it exactly as shown.

LOGO PLACEMENT: Position the logo exactly in the top-left corner (20px from top edge, 40px from left edge). Maintain the logo's original aspect ratio and colors.

CRITICAL: This is a reference image for you to copy exactly, not to interpret or recreate. Treat it like pasting the exact logo image into the slide.

${prompt}`
    });
  } else {
    parts.push({ text: prompt });
  }

  // Use exact same model and config as the working Next.js version
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.7,
          response_modalities: ['IMAGE'],
          image_config: {
            aspect_ratio: '16:9',
            image_size: '2K'
          }
        }
      }),
      signal,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini Image API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  // Extract image from response - check both camelCase and snake_case formats
  const parts_response = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts_response.find((p: any) =>
    p.inlineData?.data || p.inline_data?.data
  );

  const imageData = imagePart?.inlineData?.data || imagePart?.inline_data?.data;

  if (!imageData) {
    throw new Error('No image generated');
  }

  return `data:image/png;base64,${imageData}`;
}

/**
 * Unified AI call function
 */
export async function callAI(
  config: AIRequestConfig,
  signal?: AbortSignal
): Promise<AIResponse> {
  const isGemini = config.model.startsWith('gemini');

  if (isGemini) {
    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY not configured');
    }
    return callGemini(config, apiKey, signal);
  } else {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    return callOpenAI(config, apiKey, signal);
  }
}
