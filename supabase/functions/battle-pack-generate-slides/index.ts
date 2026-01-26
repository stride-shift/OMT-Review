// Battle Pack Slide Generation Edge Function
// Generates slide images using AI image generation

import { callGeminiImageGeneration } from '../_shared/ai-client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SlideDescription {
  number: number;
  title: string;
  layout?: string;
  nano_banana_prompt: string;
  include_logo?: boolean;
}

interface GenerateSlidesRequest {
  slides: SlideDescription[];
  companyUrl?: string;
  ciGuidelines?: string;
  logo_base64?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slides, companyUrl, ciGuidelines, logo_base64 }: GenerateSlidesRequest = await req.json();

    if (!slides || slides.length === 0) {
      throw new Error('No slides to generate');
    }

    console.log(`Generating ${slides.length} slide images...`);

    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY not configured');
    }

    // Generate slides with staggered requests to avoid rate limiting
    const images: (string | null)[] = [];
    const errors: string[] = [];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      console.log(`Generating slide ${slide.number}: ${slide.title}`);

      try {
        // Build enhanced prompt with CI guidelines
        const prompt = buildSlidePrompt(slide, ciGuidelines);

        // Only pass logo for slides that need it
        const slideLogoBase64 = slide.include_logo ? logo_base64 : undefined;

        // Add delay between requests to avoid rate limiting
        if (i > 0) {
          await delay(500);
        }

        // Generate with retry
        const imageUrl = await generateWithRetry(prompt, apiKey, slideLogoBase64, 2);
        images.push(imageUrl);
        console.log(`✓ Slide ${slide.number} generated`);
      } catch (error: any) {
        console.error(`✗ Slide ${slide.number} failed:`, error.message);
        errors.push(`Slide ${slide.number}: ${error.message}`);
        images.push(null);
      }
    }

    const successCount = images.filter(Boolean).length;
    console.log(`Generated ${successCount}/${slides.length} slides`);

    return new Response(
      JSON.stringify({
        images,
        errors: errors.length > 0 ? errors : undefined,
        success: successCount,
        total: slides.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Generate slides error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function buildSlidePrompt(slide: SlideDescription, ciGuidelines?: string): string {
  let prompt = `Generate a professional business presentation slide image.

SLIDE DETAILS:
- Title: ${slide.title}
- Layout: ${slide.layout}
- Slide Number: ${slide.number}

DESIGN REQUIREMENTS:
${slide.nano_banana_prompt}

STYLE GUIDELINES:
- Professional corporate presentation style
- Clean, modern design with clear hierarchy
- 16:9 aspect ratio (widescreen)
- High contrast for readability
- Minimal text, impactful visuals
`;

  if (ciGuidelines) {
    prompt += `
BRAND GUIDELINES:
${ciGuidelines}

Apply these brand colors and styling to the slide design.
`;
  }

  prompt += `
Generate a polished, presentation-ready slide image.`;

  return prompt;
}

async function generateWithRetry(
  prompt: string,
  apiKey: string,
  logoBase64: string | undefined,
  maxRetries: number
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff
        await delay(1000 * Math.pow(2, attempt - 1));
        console.log(`Retry attempt ${attempt}...`);
      }

      return await callGeminiImageGeneration(prompt, apiKey, logoBase64);
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error.message);

      // Don't retry on certain errors
      if (error.message.includes('quota') || error.message.includes('billing')) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Failed to generate image');
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
