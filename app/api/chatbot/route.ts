import { toolImplementations } from "@/utils/tools";
import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Match Gemini's actual role vocabulary
type ChatMessage = { role: "user" | "model"; text: string };

const calculatorDeclaration = {
    name: "calculator",
    description: "Evaluates a basic math expression (add, subtract, multiply, divide, exponents, parentheses).",
    parameters: {
        type: Type.OBJECT,
        properties: {
            expression: {
                type: Type.STRING,
                description: "A math expression, e.g. '(12 + 8) * 3 / 4'",
            },
        },
        required: ["expression"],
    },
};

const weatherDeclaration = {
    name: "getWeather",
    description: "Gets current weather for a city.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            city: { type: Type.STRING, description: "City name, e.g. 'Mumbai'" },
        },
        required: ["city"],
    },
};

const codeExecDeclaration = {
    name: "runCode",
    description: "Compiles and runs a short code snippet, returns stdout/stderr.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            language: {
                type: Type.STRING,
                description: "Language name, e.g. 'python', 'javascript', 'java', 'cpp'",
            },
            code: { type: Type.STRING, description: "Full source code to run" },
        },
        required: ["language", "code"],
    },
};

const tools = [
    {
        functionDeclarations: [calculatorDeclaration, weatherDeclaration, codeExecDeclaration],
    },
];

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();
        if (!message) {
            return NextResponse.json({ error: "Message field is required" }, { status: 400 });
        }

        const contents: any[] = [
            ...(history ?? []).map((m: ChatMessage) => ({
                role: m.role,
                parts: [{ text: m.text }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];

        const config = {
            systemInstruction: `
        You are an AI Customer Support Agent for a SaaS product.
        Be polite, professional, and concise.
        Use the calculator, getWeather, or runCode tools when a request needs them.
        If a request needs more than one tool, call all of the ones you need.
        Otherwise answer directly.
        Keep responses short — max 2-3 sentences unless code output is being shown.
      `,
            tools,
        };

        let response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents,
            config,
        });

        let iterations = 0;
        while (response.functionCalls?.length && iterations < 5) {
            const calls = response.functionCalls;

            // Execute every tool call the model asked for this turn
            const results = await Promise.all(
                calls.map(async (call) => {
                    const name = call.name;
                    if (!name) {
                        return { name: "unknown", result: { error: "Missing function name" } };
                    }
                    const impl = toolImplementations[name];
                    const result = impl
                        ? await impl(call.args ?? {})
                        : { error: `Unknown tool: ${name}` };
                    return { name, result };
                })
            );

            // IMPORTANT: push the model's actual response content (preserves thoughtSignature),
            // don't reconstruct the functionCall parts yourself
            const modelContent = response.candidates?.[0]?.content;
            if (modelContent) {
                contents.push(modelContent);
            }

            // Then push our function results, matched by name/order
            contents.push({
                role: "user",
                parts: results.map((r) => ({
                    functionResponse: { name: r.name, response: r.result },
                })),
            });

            response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents,
                config,
            });
            iterations++;
        }

        const text = response.text || "No response";
        return NextResponse.json({ response: text }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while processing the request" }, { status: 500 });
    }
}