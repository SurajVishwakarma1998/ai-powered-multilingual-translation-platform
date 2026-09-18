"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
    id: number;
    text: string;
    sender: "user" | "bot";
};

export default function SupportChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! 👋 I am your AI Customer Support Agent. How can I help you today?",
            sender: "bot",
        },
    ]);

    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);

    // 🔽 Auto scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    // 🔽 Handle send
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: messages.length + 1,
            text: input,
            sender: "user",
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const history = updatedMessages
                .filter((m) => m.id !== 1) // optional: skip the canned greeting
                .map((m) => ({
                    role: m.sender === "user" ? "user" : "model",
                    text: m.text,
                }));
            const res = await fetch('/api/customer-support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input, history: history.slice(0, -1) }), // still uses the captured `input`, not state
            });
            const message = await res.json();
            // console.log(message);
            setMessages((prev) => [
                ...prev,
                message.response
                    ? { id: prev.length + 1, text: message.response, sender: "bot" }
                    : { id: prev.length + 1, text: "Sorry, I can only assist with CCTV and security-related queries.", sender: "bot" },
            ]);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto h-[550px] flex flex-col border border-blue-800 rounded-xl shadow-lg">

            {/* 🔝 Header */}
            <div className="p-4  bg-black text-white rounded-t-xl">
                <h2 className="font-semibold text-lg">CCTV AI Support Agent</h2>
                <p className="text-sm text-gray-500">Online • Usually replies instantly</p>
            </div>

            {/* 💬 Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${msg.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-black border"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* ⌨️ Input */}
            <div className="p-3  flex gap-2 bg-gray-800 rounded-b-xl">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Send
                </button>
            </div>

        </div>
    );
}