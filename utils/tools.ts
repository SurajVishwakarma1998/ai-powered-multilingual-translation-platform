// Calculator — DO NOT use raw eval(). Use a safe math parser.
import { evaluate } from "mathjs";

async function calculator({ expression }: { expression: string }) {
  try {
    console.log("calculator")
    return { result: evaluate(expression) };
  } catch {
    return { error: "Invalid expression" };
  }
}

// Weather — Open-Meteo needs no API key
async function getWeather({ city }: { city: string }) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geo = await geoRes.json();
    if (!geo.results?.length) return { error: "City not found" };
    const { latitude, longitude, name, country } = geo.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    console.log("weather")
    const weather = await weatherRes.json();
    return {
      city: `${name}, ${country}`,
      temperature: weather.current_weather?.temperature,
      windspeed: weather.current_weather?.windspeed,
      unit: "celsius",
    };
  } catch {
    return { error: "Failed to fetch weather" };
  }
}

// Code execution — Piston API (public, free, no key)
async function runCode({ language, code }: { language: string; code: string }) {
  try {
    const res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "*",
        files: [{ content: code }],
      }),
    });
    const data = await res.json();
    console.log("runCode")
    return {
      stdout: data.run?.stdout,
      stderr: data.run?.stderr,
      exitCode: data.run?.code,
    };
  } catch {
    return { error: "Code execution failed" };
  }
}

export const toolImplementations: Record<string, (args: any) => Promise<any>> = {
  calculator,
  getWeather,
  runCode,
};