import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { eliminarReceta } from "@/app/actions/receta-actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Verificar si el usuario está autenticado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Obtener la información del perfil (Rol y Nombre)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "lector";

  // Variables de datos tipadas o asignadas según el rol
  let misRecetas: any[] = [];
  let misFavoritos: any[] = [];
  let totalRecetasGlobal = 0;
  let totalFavoritosGlobal = 0;

  // 3. Consultas a la base de datos según el rol
  if (role === "chef") {
    // Si es Chef: obtiene las recetas que él mismo ha publicado
    const { data: recetas } = await supabase
      .from("recetas")
      .select("*")
      .eq("chef_id", user.id)
      .order("created_at", { ascending: false });

    misRecetas = recetas || [];
  } else if (role === "administrador") {
    // Si es Administrador: contadores globales
    const totalRecetasRes = await supabase.from("recetas").select("*", { count: "exact", head: true });
    const totalFavRes = await supabase.from("favoritos").select("*", { count: "exact", head: true });

    totalRecetasGlobal = totalRecetasRes.count || 0;
    totalFavoritosGlobal = totalFavRes.count || 0;
  } else {
    // Si es Lector: obtiene la lista de sus recetas guardadas en favoritos
    const { data: favoritos } = await supabase
      .from("favoritos")
      .select(`
        id,
        nota_personal,
        created_at,
        recetas (
          id,
          titulo,
          categoria,
          tiempo_preparacion,
          imagen_url,
          profiles:chef_id (full_name)
        )
      `)
      .eq("lector_id", user.id)
      .order("created_at", { ascending: false });

    misFavoritos = favoritos || [];
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-6xl mx-auto space-y-8">
      
      {/* Header del Perfil */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hola, {profile?.full_name || "Usuario"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Rol en la cocina:{" "}
            <span className="font-semibold text-amber-400 uppercase">
              {role}
            </span>
          </p>
        </div>

        {role === "chef" && (
          <Link
            href="/dashboard/nueva-receta"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors text-sm"
          >
            + Publicar Nueva Receta
          </Link>
        )}
      </div>

      {/* VISTA PARA CHEF */}
      {role === "chef" && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Mis Recetas Publicadas</h2>
          {misRecetas.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              Aún no has publicado ninguna receta. ¡Comparte tu primer platillo!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {misRecetas.map((r) => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  
                  {/* Imagen de la Receta (si existe) */}
                  {r.imagen_url && (
                    <div className="w-full h-48 overflow-hidden bg-slate-800">
                      <img 
                        src={r.imagen_url} 
                        alt={r.titulo} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5 flex flex-col justify-between space-y-4 flex-1">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                          {r.categoria}
                        </span>
                        <span className="text-xs text-slate-400">
                          {r.tiempo_preparacion} min
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-white">{r.titulo}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mt-1">
                        {r.descripcion}
                      </p>
                    </div>

                    {/* Acciones CRUD exclusivas del Chef creador */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <Link
                        href={`/dashboard/editar-receta/${r.id}`}
                        className="text-xs text-amber-400 hover:underline font-medium"
                      >
                        Editar
                      </Link>
                      <form action={async () => {
                        'use server'
                        await eliminarReceta(r.id);
                      }}>
                        <button
                          type="submit"
                          className="text-xs text-red-400 hover:underline font-medium"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VISTA PARA LECTOR */}
      {role === "lector" && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Mis Recetas Favoritas</h2>
          {misFavoritos.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              Aún no has guardado ninguna receta en tu libro de favoritos.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {misFavoritos.map((fav) => (
                <div key={fav.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  
                  {/* Imagen de la Receta Favorita (si existe) */}
                  {fav.recetas?.imagen_url && (
                    <div className="w-full h-48 overflow-hidden bg-slate-800">
                      <img 
                        src={fav.recetas.imagen_url} 
                        alt={fav.recetas?.titulo} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5 flex flex-col justify-between space-y-3 flex-1">
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                        {fav.recetas?.categoria}
                      </span>
                      <h3 className="font-bold text-lg text-white mt-2">
                        {fav.recetas?.titulo}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Chef: {fav.recetas?.profiles?.full_name || "Anónimo"}
                      </p>
                      {fav.nota_personal && (
                        <p className="text-xs text-slate-300 italic mt-2 bg-slate-800/50 p-2 rounded border border-slate-800">
                          Nota: "{fav.nota_personal}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/recetas/${fav.recetas?.id}`}
                        className="text-xs text-amber-400 hover:underline font-semibold"
                      >
                        Ver receta completa &rarr;
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VISTA PARA ADMINISTRADOR */}
      {role === "administrador" && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white">Métricas de la Plataforma Culinaria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <p className="text-xs uppercase font-semibold text-slate-400">Total Recetas Creadas</p>
              <p className="text-4xl font-extrabold text-amber-500 mt-2">{totalRecetasGlobal}</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <p className="text-xs uppercase font-semibold text-slate-400">Total Guardados en Favoritos</p>
              <p className="text-4xl font-extrabold text-emerald-400 mt-2">{totalFavoritosGlobal}</p>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}