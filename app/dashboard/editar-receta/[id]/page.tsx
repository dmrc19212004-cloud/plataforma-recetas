import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { actualizarReceta } from "@/app/actions/receta-actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarRecetaPage({ params }: PageProps) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const supabase = await createClient();

  // 1. Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Obtener la receta a editar
  const { data: receta, error } = await supabase
    .from("recetas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !receta) {
    notFound();
  }

  // 3. Verificar que el usuario sea el Chef creador o Administrador
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const esAutor = receta.chef_id === user.id;
  const esAdmin = profile?.role === "administrador";

  if (!esAutor && !esAdmin) {
    redirect("/dashboard");
  }

  // Bind del id de la receta para el Server Action
  const actualizarRecetaConId = actualizarReceta.bind(null, receta.id);

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
            <h1 className="text-2xl font-bold text-white">Editar Receta</h1>
            <p className="text-sm text-slate-400 mt-1">
              Modifica los campos necesarios de tu platillo.
            </p>
          </div>

          <form action={actualizarRecetaConId} className="space-y-5">
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-slate-300 mb-1">
                Título del Platillo
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                defaultValue={receta.titulo}
                required
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
                defaultValue={receta.imagen_url || ""}
                placeholder="https://ejemplo.com/imagen.jpg"
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
                  defaultValue={receta.categoria}
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
                  defaultValue={receta.tiempo_preparacion}
                  min="1"
                  required
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
                defaultValue={receta.descripcion}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Ingredientes */}
            <div>
              <label htmlFor="ingredientes" className="block text-sm font-medium text-slate-300 mb-1">
                Ingredientes
              </label>
              <textarea
                id="ingredientes"
                name="ingredientes"
                rows={4}
                defaultValue={receta.ingredientes}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Instrucciones */}
            <div>
              <label htmlFor="instrucciones" className="block text-sm font-medium text-slate-300 mb-1">
                Pasos de Preparación
              </label>
              <textarea
                id="instrucciones"
                name="instrucciones"
                rows={5}
                defaultValue={receta.instrucciones}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Guardar Cambios
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}