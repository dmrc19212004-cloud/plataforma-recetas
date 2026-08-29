import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import MealDbRecipes from "./components/MealDbRecipes";

export default async function Home() {
  const supabase = await createClient();

  // Consulta de recetas desde Supabase
  const { data: recetas, error } = await supabase
    .from("recetas")
    .select("*, profiles:chef_id(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando recetas:", error.message);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Seccion Hero */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Descubre y Comparte las Mejores{" "}
            <span className="text-amber-500">Recetas de Cocina</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Aprende de chefs experimentados, guarda tus platos favoritos y
            publica tus propias creaciones culinarias.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Comenzar Ahora
            </Link>
            <Link
              href="#recetas"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-6 py-3 rounded-lg border border-slate-700 transition-colors"
            >
              Explorar Recetas
            </Link>
          </div>
        </section>

        {/* COMPONENTE DE API REST EXTERNA (TheMealDB) */}
        <MealDbRecipes />

        {/* Sección de Recetas Recientes (Supabase DB) */}
        <section id="recetas" className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white">Recetas de la Comunidad</h2>
            <p className="text-sm text-slate-400">
              Explora las últimas preparaciones compartidas por nuestros Chefs.
            </p>
          </div>

          {!recetas || recetas.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              No hay recetas publicadas en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recetas.map((r) => (
                <div
                  key={r.id}
                  className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
                      {r.categoria} • {r.tiempo_preparacion} min
                    </span>
                    <h3 className="text-xl font-bold text-white">{r.titulo}</h3>
                    <p className="text-slate-400 text-sm line-clamp-3">
                      {r.descripcion}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Chef: {r.profiles?.full_name || "Chef Anónimo"}
                    </span>
                    <Link
                      href={`/recetas/${r.id}`}
                      className="text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      Ver receta &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}