import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecetaDetallePage({ params }: PageProps) {
  const resolvedParams = await params;
  const recetaId = resolvedParams.id;

  const supabase = await createClient();

  // Consultar la receta en la base de datos
  const { data: receta, error } = await supabase
    .from("recetas")
    .select("*")
    .eq("id", recetaId)
    .single();

  if (error || !receta) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-emerald-400 hover:underline"
          >
            &larr; Volver al dashboard
          </Link>
        </div>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl">
          <h1 className="text-3xl font-extrabold text-white mb-4">
            {receta.titulo}
          </h1>

          {receta.imagen_url && (
            <div className="mb-6 overflow-hidden rounded-lg border border-slate-800 h-72">
              <img
                src={receta.imagen_url}
                alt={receta.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-slate-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Ingredientes
              </h3>
              <p className="whitespace-pre-line bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm">
                {receta.ingredientes}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Instrucciones / Preparación
              </h3>
              <p className="whitespace-pre-line bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm">
                {receta.instrucciones}
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
