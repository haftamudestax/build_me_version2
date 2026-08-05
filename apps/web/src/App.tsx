import { useCallback, useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

interface FunFact {
  icon: string;
  text: string;
}

function App() {
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("fun_facts")
        .select("icon, text")
        .order("position");

      if (error) {
        throw error;
      }

      setFunFacts(data ?? []);
    } catch (err) {
      console.error("Error fetching fun facts:", err);
      setError("Failed to load fun facts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-sky-400">About Me</h1>
      <h2>For test Purpose</h2>

      {loading && <p className="mt-4">Loading...</p>}

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {!loading && !error && (
        <ul className="mt-6 space-y-4">
          {funFacts.map((fact) => (
            <li
              key={`${fact.icon}-${fact.text}`}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">{fact.icon}</span>
              <span>{fact.text}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
