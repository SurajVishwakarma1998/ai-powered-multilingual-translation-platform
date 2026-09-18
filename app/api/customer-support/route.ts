import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
type ChatMessage = { role: "user" | "bot"; text: string };

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();
        if (!message) {
            return NextResponse.json({ error: "Message field is required" }, { status: 400 });
        }
        const contents = [
            ...(history ?? []).map((m: ChatMessage) => ({
                role: m.role,
                parts: [{ text: m.text }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: contents,
            config: {
                systemInstruction: `
                 ROLE:
                        You are an AI Customer Support Agent for a CCTV and security camera company.

                        TASK:
                        Assist customers with CCTV-related queries including installation, troubleshooting, configuration, and general support.

                        BEHAVIOR:
                        - Be polite, professional, and helpful.
                        - Provide clear and direct guidance.
                        - If needed, ask a short follow-up question.

                        CONSTRAINTS:
                        - Only respond to CCTV, security camera, or customer support related queries.
                        - Do NOT answer unrelated questions.
                        - Do NOT mention that you are an AI model.

                        RESPONSE RULES:
                        - Keep every response within a maximum of 1 sentence.
                        - If the query is outside the scope, respond exactly with:
                        "Sorry, I can only assist with CCTV and security-related queries."
                                    `,
            },
        });

        const text =
            response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        return NextResponse.json({ response: text }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "An error occurred while processing the request" }, { status: 500 });
    }
}