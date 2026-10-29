import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenDoor — Accessibility-Aware Cultural Discovery Agent",
  description: "Discover cultural places matching your taste, verified with independent physical accessibility evidence. Powered by Qloo for Hackathon 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl" aria-hidden="true">
                OD
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">OpenDoor</h1>
                <p className="text-xs text-slate-500 font-medium">
                  Accessibility-Aware Cultural Discovery Agent • Qloo Hackathon 2026
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-300">
                Grounded Provenance
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
                Deterministic Agent
              </span>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 space-y-2">
            <p>
              <strong>Critical Disclosure:</strong> Qloo cultural affinity recommendations are not evidence of wheelchair accessibility.
              Physical access evidence is independently compiled from official venue access statements. Always confirm critical requirements with the venue.
            </p>
            <p className="text-slate-400">
              OpenDoor is open-source under the MIT License • Built with strict $0 budget for Qloo Agentic Hackathon 2026
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
