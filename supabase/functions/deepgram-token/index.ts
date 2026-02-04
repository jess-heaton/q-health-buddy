import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const DEEPGRAM_API_KEY = Deno.env.get('DEEPGRAM_API_KEY');
    if (!DEEPGRAM_API_KEY) {
      console.error('DEEPGRAM_API_KEY not configured');
      throw new Error('DEEPGRAM_API_KEY is not configured');
    }

    console.log('Creating Deepgram temporary token...');

    // Create a temporary key that expires in 10 seconds
    const response = await fetch('https://api.deepgram.com/v1/projects', {
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get projects:', response.status, errorText);
      throw new Error(`Failed to get Deepgram projects: ${response.status}`);
    }

    const projectsData = await response.json();
    const projectId = projectsData.projects?.[0]?.project_id;

    if (!projectId) {
      console.error('No Deepgram project found');
      throw new Error('No Deepgram project found');
    }

    console.log('Got project ID, creating temporary key...');

    // Create a temporary key
    const keyResponse = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: 'Temporary key for voice input',
        scopes: ['usage:write'],
        time_to_live_in_seconds: 30,
      }),
    });

    if (!keyResponse.ok) {
      const errorText = await keyResponse.text();
      console.error('Failed to create temp key:', keyResponse.status, errorText);
      throw new Error(`Failed to create temporary key: ${keyResponse.status}`);
    }

    const keyData = await keyResponse.json();
    console.log('Temporary key created successfully');

    return new Response(JSON.stringify({ 
      key: keyData.key,
      expiresIn: 30 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in deepgram-token function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
