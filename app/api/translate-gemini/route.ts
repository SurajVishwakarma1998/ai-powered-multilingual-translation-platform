import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export async function POST(req: NextRequest) {
    try {
        const { text, targetLang } = await req?.json();
        if (!text) {
            return NextResponse.json({ error: "Text field is required" }, { status: 400 });
        }
        if (!targetLang) {
            return NextResponse.json({ error: "Target language is required" }, { status: 400 });
        }
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `Translate the following text 
        into ${targetLang}. Only return the translated text, nothing else.\n\nText: ${text}`,
        })
        const translated = response?.text;
        if (!translated) {
            return NextResponse.json({ error: "No translation returned" }, { status: 502 });
        }
        return NextResponse.json({ translated }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Network error" },
            { status: 500 });
    }
}