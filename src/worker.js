const jsonResponse = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/weather") {
      return jsonResponse({ error: "Not found." }, 404);
    }

    if (request.method !== "GET") {
      return new Response(null, {
        status: 405,
        headers: { Allow: "GET" },
      });
    }

    const city = url.searchParams.get("city")?.trim();
    if (!city || city.length > 100) {
      return jsonResponse({ error: "Enter a valid city name." }, 400);
    }

    if (!env.OPENWEATHER_API_KEY) {
      return jsonResponse(
        { error: "Weather API is not configured. Add the OPENWEATHER_API_KEY Worker secret." },
        503,
      );
    }

    const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
    weatherUrl.searchParams.set("q", city);
    weatherUrl.searchParams.set("appid", env.OPENWEATHER_API_KEY);
    weatherUrl.searchParams.set("units", "metric");

    try {
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        const status = weatherResponse.status === 404 ? 404 : 502;
        const error =
          weatherResponse.status === 404
            ? "City not found."
            : "Weather service is temporarily unavailable.";
        return jsonResponse({ error }, status);
      }

      const weather = await weatherResponse.json();
      return jsonResponse(weather, 200);
    } catch {
      return jsonResponse(
        { error: "Weather service is temporarily unavailable." },
        502,
      );
    }
  },
};
