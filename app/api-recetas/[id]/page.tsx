import Link from "next/link";

async function getMealDetails(id) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error("No se pudo obtener la receta de la API");
    }

    const data = await res.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Error al cargar la receta de la API:", error);
    return null;
  }
}

export default async function MealDetailPage({ params }) {
  const { id } = await params;
  const meal = await getMealDetails(id);

  if (!meal) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center space-y-4 bg-slate-900 p-8 rounded-xl border border-slate-800">
          <h1 className="text-2xl font-bold text-red-400">Receta no encontrada</h1>
          <p className="text-slate-400 text-sm">No pudimos cargar los detalles de esta receta del mundo.</p>
          <Link
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  // Extraer ingredientes y medidas dinámicamente de la estructura de TheMealDB
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient,
        measure: measure ? measure.trim() : "",
      });
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Botón de retorno */}
        <div>
          <Link
            href="/"
            className="text-amber-400 hover:text-amber-300 font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            &larr; Volver al inicio
          </Link>
        </div>

        {/* Cabecera de la receta */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 items-center">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-72 sm:h-80 object-cover rounded-xl shadow-md border border-slate-700/60"
          />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
                {meal.strCategory || "Sin Categoría"}
              </span>
              <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-full border border-slate-700">
                {meal.strArea || "Internacional"}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {meal.strMeal}
            </h1>

            {meal.strTags && (
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Etiquetas:</span> {meal.strTags.split(',').join(', ')}
              </p>
            )}

            {meal.strYoutube && (
              <div className="pt-2">
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Ver Video Tutorial &rarr;
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Ingredientes e Instrucciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Ingredientes */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 md:col-span-1">
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
              Ingredientes
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {ingredients.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-1 border-b border-slate-800/50">
                  <span className="font-medium text-slate-200">{item.ingredient}</span>
                  <span className="text-amber-400 text-xs">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparación */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 md:col-span-2">
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
              Instrucciones de Preparación
            </h2>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {meal.strInstructions}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}