// Edge function: generates calm yoga music via ElevenLabs Music API
// Returns raw MP3 bytes that the client plays via a native <audio> element (PWA-safe)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PRESETS: Record<string, { prompt: string; duration: number }> = {
  calm: {
    prompt:
      "Calm, soft instrumental yoga music. Gentle piano, warm pads, soft flute, slow tempo around 60 BPM. Spacious, healing, meditative atmosphere. No vocals, no lyrics, no drums.",
    duration: 180,
  },
  morning: {
    prompt:
      "Bright morning yoga flow music. Soft acoustic guitar, light strings, peaceful and uplifting, 70 BPM. Inspires gentle movement and breath. No vocals, no lyrics.",
    duration: 180,
  },
  deep: {
    prompt:
      "Deep relaxation ambient music tuned to 432 Hz feeling. Warm pads, soft singing bowls, very slow and spacious, 50 BPM. Healing meditation. No vocals, no lyrics, no percussion.",
    duration: 180,
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { preset = "calm" } = await req.json().catch(() => ({}));
    const config = PRESETS[preset] ?? PRESETS.calm;

    const response = await fetch("https://api.elevenlabs.io/v1/music", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: config.prompt,
        music_length_ms: config.duration * 1000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: `ElevenLabs error: ${response.status}`, details: errText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error("generate-yoga-music error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
