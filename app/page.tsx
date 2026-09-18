import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center text-center px-6 py-16 gap-12">

      {/* 🔥 Hero Section */}
      <section className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Build Smart <span className="text-blue-600">AI Agents</span> for
          Real-World Tasks
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Automate workflows, integrate APIs, and create intelligent agents
          that think, act, and deliver results.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <Link
            href="/agents"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Explore Agents
          </Link>

          <Link
            href="/docs"
            className="border px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Documentation
          </Link>
        </div>
      </section>

      {/* ⚡ Features Section */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">

        <div className="p-6 border rounded-xl shadow-sm">
          <h3 className="font-semibold text-xl mb-2">🤖 Autonomous Agents</h3>
          <p className="text-gray-600">
            Build agents that can make decisions, execute tasks, and learn
            from data.
          </p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm">
          <h3 className="font-semibold text-xl mb-2">🔗 API Integration</h3>
          <p className="text-gray-600">
            Connect your AI agents with external APIs, databases, and services.
          </p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm">
          <h3 className="font-semibold text-xl mb-2">⚡ Real-time Actions</h3>
          <p className="text-gray-600">
            Trigger actions instantly based on user input or system events.
          </p>
        </div>

      </section>

      {/* 🚀 CTA Section */}
      <section className="bg-blue-600 text-white p-10 rounded-xl w-full max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold">
          Start Building Your First AI Agent Today
        </h2>

        <p className="mt-3">
          No complex setup. Just plug, play, and scale your intelligence.
        </p>

        <Link
          href="/agents"
          className="inline-block mt-5 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Get Started
        </Link>
      </section>

    </main>
  );
}