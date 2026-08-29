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
    // Consumo de API REST Externa con fetch + async/await (Server Component)
    // Obtenemos recetas destacadas/inspiracionales de la API pública de TheMealDB
    const res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken',
      {
        next: { revalidate: 3600 } // Caché eficiente de 1 hora en el servidor
      }
    );

    if (!res.ok) {
      throw new Error('Falló la respuesta de la API de TheMealDB');
    }

    const data = await res.json();
    // Tomamos solo las primeras 3 recetas para la vista de la landing
    meals = data.meals ? data.meals.slice(0, 3) : [];
  } catch (err) {
    // Manejo de errores si la API falla o tarda en responder
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
            <div
              key={meal.idMeal}
              className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center text-center gap-3"
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div>
                <h4 className="font-semibold text-amber-400">{meal.strMeal}</h4>
                <p className="text-xs text-slate-300">
                  {meal.strCategory} • {meal.strArea}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}