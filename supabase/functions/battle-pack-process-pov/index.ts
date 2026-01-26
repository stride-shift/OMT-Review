// Battle Pack POV Processing Edge Function
// Analyzes POV report and generates slide descriptions

import { callAI } from '../_shared/ai-client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessPovRequest {
  povText: string;
  companyUrl?: string;
  ciGuidelines?: string;
  battlepackType: 'external' | 'internal';
  language: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { povText, companyUrl, ciGuidelines, battlepackType, language }: ProcessPovRequest = await req.json();

    if (!povText) {
      throw new Error('POV text is required');
    }

    console.log(`Processing POV for ${battlepackType} battlepack in ${language}`);

    // Build the prompt
    const systemPrompt = buildSystemPrompt(battlepackType, language);
    const userPrompt = buildUserPrompt(povText, companyUrl, ciGuidelines, battlepackType);

    // Call AI to generate slide descriptions
    const response = await callAI({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 8000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    // Parse the JSON response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse slide descriptions from AI response');
    }

    console.log(`Generated ${result.slides?.length || 0} slide descriptions`);

    return new Response(
      JSON.stringify({
        customer_name: result.customer_name || 'Customer',
        slides: result.slides || [],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Process POV error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function buildSystemPrompt(battlepackType: string, language: string): string {
  const languageInstruction = language !== 'en'
    ? `Generate ALL content in ${getLanguageName(language)}. This includes slide titles, descriptions, and all text.`
    : '';

  if (battlepackType === 'internal') {
    return `You are a sales enablement expert creating an internal pre-discovery battlepack.
This document is for internal sales team use to prepare for customer meetings.

${languageInstruction}

Generate a JSON response with this structure:
{
  "customer_name": "Company Name extracted from POV",
  "slides": [
    {
      "number": 1,
      "title": "Slide title",
      "layout": "Layout description (title slide, content slide, etc.)",
      "nano_banana_prompt": "Detailed prompt for image generation describing the visual layout, colors, text placement, and content"
    }
  ]
}

Create 8-10 slides covering:
1. Title slide with customer name
2. Discovery objectives
3. Key unknowns to explore
4. Stakeholder mapping
5. Potential pain points
6. Solution alignment areas
7. Competitive positioning
8. Next steps and meeting agenda`;
  }

  return `You are a sales enablement expert creating a customer-facing battlepack presentation.
This is a polished, professional deck for external use.

${languageInstruction}

Generate a JSON response with this structure:
{
  "customer_name": "Company Name extracted from POV",
  "slides": [
    {
      "number": 1,
      "title": "Slide title",
      "layout": "Layout description",
      "nano_banana_prompt": "Detailed prompt for image generation describing the visual layout, colors, text placement, and content"
    }
  ]
}

Create 10-12 slides covering:
1. Title slide with customer name and value proposition
2. Understanding their challenges
3. Market context and trends
4. Our solution overview
5. Key capabilities (2-3 slides)
6. Customer success stories
7. Implementation approach
8. ROI and business outcomes
9. Why choose us
10. Next steps and call to action`;
}

function buildUserPrompt(
  povText: string,
  companyUrl?: string,
  ciGuidelines?: string,
  battlepackType?: string
): string {
  let prompt = `Analyze this POV report and create slide descriptions for a ${battlepackType || 'external'} battlepack:\n\n`;
  prompt += `POV REPORT:\n${povText}\n\n`;

  if (companyUrl) {
    prompt += `COMPANY URL: ${companyUrl}\n\n`;
  }

  if (ciGuidelines) {
    prompt += `BRAND/CI GUIDELINES:\n${ciGuidelines}\n\nIncorporate these brand guidelines into the slide designs.\n\n`;
  }

  prompt += `For each slide, create a detailed "nano_banana_prompt" that describes:
- The visual layout and composition
- Color scheme (use brand colors if provided)
- Text content and placement
- Any charts, icons, or graphics to include
- Professional business presentation style

Return ONLY valid JSON with no additional text.`;

  return prompt;
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    de: 'German',
    nl: 'Dutch',
    es: 'Spanish',
    fr: 'French',
  };
  return languages[code] || 'English';
}
