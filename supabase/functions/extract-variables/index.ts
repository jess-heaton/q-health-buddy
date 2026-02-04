import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const EXTRACTION_PROMPT = `You extract and NORMALISE clinical variables for QDiabetes risk assessment.

Rules:
- Convert all units to canonical units.
- Infer values if explicitly stated (e.g. BMI from height + weight).
- If unknown or not mentioned, return null.
- Return ONLY valid JSON, no explanations.

Canonical units:
- weight: kg
- height: cm (NOT metres)
- bmi: kg/m²

Ethnicity mapping (return the number):
1 = White or not stated
2 = Indian
3 = Pakistani
4 = Bangladeshi
5 = Other Asian
6 = Black Caribbean
7 = Black African
8 = Chinese
9 = Other ethnic group

Smoking categories (return the number):
0 = non-smoker
1 = ex-smoker
2 = light smoker (less than 10/day)
3 = moderate smoker (10-19/day)
4 = heavy smoker (20+/day)

Sex mapping:
"male" or "female" (lowercase string)

Schema (return exactly this structure):
{
  "age": number|null,
  "sex": "male"|"female"|null,
  "weight": number|null,
  "height": number|null,
  "ethnicity": number|null,
  "smoking": number|null,
  "familyHistoryDiabetes": boolean|null,
  "cardiovascularDisease": boolean|null,
  "treatedHypertension": boolean|null,
  "learningDisabilities": boolean|null,
  "mentalIllness": boolean|null,
  "corticosteroids": boolean|null,
  "statins": boolean|null,
  "atypicalAntipsychotics": boolean|null,
  "polycysticOvaries": boolean|null,
  "gestationalDiabetes": boolean|null,
  "fastingBloodGlucose": number|null,
  "hba1c": number|null,
  "townsendScore": number|null
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transcript } = await req.json();
    
    if (!transcript || typeof transcript !== 'string') {
      return new Response(JSON.stringify({ error: 'Transcript is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Extracting variables from transcript:', transcript.substring(0, 100) + '...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        temperature: 0,
        messages: [
          { role: 'system', content: EXTRACTION_PROMPT },
          { role: 'user', content: transcript }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in AI response');
      throw new Error('No content in AI response');
    }

    console.log('AI response:', content);

    // Parse the JSON from the response
    let variables;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        variables = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Failed to parse extracted variables');
    }

    console.log('Extracted variables:', variables);

    return new Response(JSON.stringify({ variables }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-variables function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
