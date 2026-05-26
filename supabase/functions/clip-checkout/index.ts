const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.ricardorenteria.pro",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getClipAuthToken() {
  const directToken = Deno.env.get("CLIP_AUTH_TOKEN");
  if (directToken) return directToken;

  const apiKey = Deno.env.get("CLIP_API_KEY");
  const secretKey = Deno.env.get("CLIP_SECRET_KEY");
  if (!apiKey || !secretKey) return "";

  return `Basic ${btoa(`${apiKey}:${secretKey}`)}`;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const clipAuthToken = getClipAuthToken();
  if (!clipAuthToken) return jsonResponse({ error: "Clip credentials are not configured" }, 500);

  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const concept = String(body.concept || "").trim().slice(0, 250);
    const name = String(body.name || "Cliente Ricardo Renteria").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 160);

    if (!Number.isFinite(amount) || amount < 1 || !concept) {
      return jsonResponse({ error: "Amount and concept are required" }, 400);
    }

    const siteUrl = Deno.env.get("SITE_URL") || "https://www.ricardorenteria.pro";
    const reference = `RR-${Date.now()}`;
    const payload = {
      amount: Math.round(amount * 100) / 100,
      currency: "MXN",
      purchase_description: concept,
      redirection_url: {
        success: `${siteUrl}/?payment=success&reference=${reference}#payments`,
        error: `${siteUrl}/?payment=error&reference=${reference}#payments`,
        default: `${siteUrl}/?payment=cancelled&reference=${reference}#payments`,
      },
      metadata: {
        me_reference_id: reference,
        customer_info: { name, email },
        source: "ricardorenteria.pro",
      },
    };

    const clipResponse = await fetch("https://api.payclip.com/v2/checkout", {
      method: "POST",
      headers: {
        "Authorization": clipAuthToken,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const clipBody = await clipResponse.json().catch(() => ({}));
    if (!clipResponse.ok) return jsonResponse({ error: "Clip checkout error", detail: clipBody }, clipResponse.status);

    return jsonResponse({
      paymentUrl: clipBody.payment_request_url || clipBody.checkout_url || clipBody.url,
      paymentRequestId: clipBody.payment_request_id,
      raw: clipBody,
    });
  } catch (error) {
    return jsonResponse({ error: "Unexpected checkout error" }, 500);
  }
});
