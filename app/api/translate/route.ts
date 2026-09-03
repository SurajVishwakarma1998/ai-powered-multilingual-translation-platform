import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
    try {
        const { text, targetLang } = await req?.json()
        if (!text) {
            return NextResponse.json({ error: "Text field is required" }, { status: 400 })
        }
        const response = await client?.chat?.completions?.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Translate into ${targetLang} accurately.`,
                },

                {
                    role: "user",
                    content: text
                }
            ]
        })
        return NextResponse.json({
            translated: response.choices[0].message.content,
        }, { status: 200 });
    } catch (error) {
        console.error("Translate API error:", error)
        return NextResponse.json({ error: error instanceof Error ? error.message : "Network error" }, { status: 500 })
    }

}