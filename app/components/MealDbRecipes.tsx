import Link from "next/link"; // Asegúrate de importar Link

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

export default async function MealDbRecipes() {
  let meals: Meal[] = [];
  let errorMsg = '';

  try {
    const res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken',
      {
        next: { revalidate: 3600 }
      }
    );

    if (!res.ok) {
      throw new Error('Falló la respuesta de la API de TheMealDB');
    }

    const data = await res.json();
    meals = data.meals ? data.meals.slice(0, 3) : [];
  } catch (err) {
    errorMsg = 'No se pudieron cargar las recetas inspiracionales de la API en este momento.';
  }

  return (
    <section className="my-8 p-6 bg-slate-900 rounded-xl border border-slate-800 text-white">
      <h3 className="text-xl font-bold mb-2">
        Recetas Destacadas del Mundo (Vía TheMealDB API)
      </h3>
      <p className="text-slate-400 text-sm mb-4">
        Inspiración culinaria obtenida en tiempo real desde una API REST externa.
      </p>

      {errorMsg ? (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meals.map((meal) => (
            // Convertimos la tarjeta en un Link interactivo hacia la vista de detalles de la API
            <Link
              key={meal.idMeal}
              href={`/api-recetas/${meal.idMeal}`}
              className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center text-center gap-3 hover:border-amber-500/50 transition-all group"
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-24 h-24 object-cover rounded-md group-hover:scale-105 transition-transform"
              />
              <div>
                <h4 className="font-semibold text-amber-400 group-hover:text-amber-300">{meal.strMeal}</h4>
                <p className="text-xs text-slate-300">
                  {meal.strCategory} • {meal.strArea}
                </p>
              </div>
              <span className="text-xs text-amber-500 font-semibold mt-1">
                Ver receta completa &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}