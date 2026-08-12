import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

interface FunFact {
  icon: string;
  text: string;
}

function App() {
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadFunFacts = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from("fun_facts")
          .select("icon, text")
          .order("position");

        if (supabaseError) {
          throw supabaseError;
        }

        if (!cancelled) {
          setFunFacts(data ?? []);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching fun facts:", err);

        if (!cancelled) {
          setError("Failed to load fun facts.");
          setFunFacts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFunFacts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <header>
          <h1 className="text-3xl font-bold text-sky-400">About Me</h1>

          <h2 className="mt-2 text-xl font-semibold text-slate-800">
            For Test Purpose
          </h2>
        </header>

        {loading && (
          <div className="mt-6">
            <p className="text-slate-600">Loading...</p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <p className="font-medium text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && funFacts.length === 0 && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-slate-600">No fun facts available.</p>
          </div>
        )}

        {!loading && !error && funFacts.length > 0 && (
          <ul className="mt-6 space-y-4">
            {funFacts.map((fact) => (
              <li
                key={`${fact.icon}-${fact.text}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span aria-hidden="true" className="text-2xl">
                  {fact.icon}
                </span>

                <span className="text-slate-700">{fact.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default App;
