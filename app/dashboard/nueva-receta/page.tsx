import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { crearReceta } from "@/app/actions/receta-actions";

export default async function NuevaRecetaPage() {
  const supabase = await createClient();

  // 1. Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Verificar rol (Solo Chefs y Administradores pueden acceder)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "chef" && profile?.role !== "administrador") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Botón Volver */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          &larr; Volver al Dashboard
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Publicar Nueva Receta</h1>
            <p className="text-sm text-slate-400 mt-1">
              Completa la información sobre tu platillo para compartirlo con la comunidad.
            </p>
          </div>

          <form action={crearReceta} className="space-y-5">
            {/* Título de la Receta */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-slate-300 mb-1">
                Título del Platillo
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                required
                placeholder="Ej. Lasaña Clásica a la Boloñesa"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* URL de la Imagen */}
            <div>
              <label htmlFor="imagen_url" className="block text-sm font-medium text-slate-300 mb-1">
                URL de la Imagen del Platillo
              </label>
              <input
                type="url"
                id="imagen_url"
                name="imagen_url"
                required
                placeholder="https://ejemplo.com/tu-receta.jpg"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Categoría y Tiempo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-slate-300 mb-1">
                  Categoría
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Plato Principal">Plato Principal</option>
                  <option value="Postres">Postres</option>
                  <option value="Entradas">Entradas</option>
                  <option value="Sopas y Cremas">Sopas y Cremas</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Vegetariana / Vegana">Vegetariana / Vegana</option>
                </select>
              </div>

              <div>
                <label htmlFor="tiempo_preparacion" className="block text-sm font-medium text-slate-300 mb-1">
                  Tiempo de Preparación (Minutos)
                </label>
                <input
                  type="number"
                  id="tiempo_preparacion"
                  name="tiempo_preparacion"
                  min="1"
                  required
                  placeholder="Ej. 45"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Descripción Breve */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-slate-300 mb-1">
                Resumen / Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={2}
                required
                placeholder="Una breve introducción que antoje a los lectores..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Lista de Ingredientes */}
            <div>
              <label htmlFor="ingredientes" className="block text-sm font-medium text-slate-300 mb-1">
                Ingredientes (Uno por línea)
              </label>
              <textarea
                id="ingredientes"
                name="ingredientes"
                rows={4}
                required
                placeholder="- 500g de carne molida&#10;- 1 cebolla picada&#10;- 2 dientes de ajo&#10;- Queso parmesano"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Pasos / Instrucciones */}
            <div>
              <label htmlFor="instrucciones" className="block text-sm font-medium text-slate-300 mb-1">
                Pasos de Preparación
              </label>
              <textarea
                id="instrucciones"
                name="instrucciones"
                rows={5}
                required
                placeholder="1. Sofreír la cebolla y el ajo...&#10;2. Agregar la carne y dorar...&#10;3. Hornear a 180°C durante 30 minutos."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-xl transition-colors font-semibold"
            >
              Publicar Receta
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}