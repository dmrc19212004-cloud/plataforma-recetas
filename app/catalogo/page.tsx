import Link from "next/link";

async function getAllMealDbRecipes() {
  try {
    const res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=',
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error("Error al obtener el catálogo de la API");
    }

    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export default async function CatalogPage() {
  const meals = await getAllMealDbRecipes();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabecera y botón de retorno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Catálogo Completo - <span className="text-amber-500">TheMealDB API</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Explora todas las recetas internacionales disponibles en tiempo real.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            &larr; Volver al inicio
          </Link>
        </div>

        {/* Cuadrícula de recetas */}
        {meals.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
            No se encontraron recetas en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <Link
                key={meal.idMeal}
                href={`/api-recetas/${meal.idMeal}`}
                className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-md"
              >
                <div>
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-semibold rounded-full border border-amber-500/20">
                        {meal.strCategory || "General"}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-semibold rounded-full border border-slate-700">
                        {meal.strArea || "Mundial"}
                      </span>
                    </div>
                    <h2 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-1">
                      {meal.strMeal}
                    </h2>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-amber-500 font-semibold">
                  <span>Ver receta completa</span>
                  <span>&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}