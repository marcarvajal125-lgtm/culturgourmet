import type { Plato, Etiqueta } from '../types/index';

const API = 'https://www.themealdb.com/api/json/v1/1';

// Cada cultura de Culturgourmet con su región en TheMealDB
export const areasPorCultura: Record<string, string> = {
  'México': 'Mexican',
  'Italia': 'Italian',
  'Asia': 'Japanese',
  'Francia': 'French',
  'Turquía': 'Turkish',
  'América': 'American',
};

const culturaPorArea: Record<string, string> = Object.fromEntries(
  Object.entries(areasPorCultura).map(([cultura, area]) => [area, cultura])
);

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  [clave: string]: string | null;
}

interface MealResumen {
  idMeal: string;
}

const pedir = async <T>(ruta: string): Promise<T[]> => {
  const respuesta = await fetch(API + '/' + ruta);
  if (!respuesta.ok) throw new Error('No se pudo conectar con la API');
  const datos = await respuesta.json();
  return datos.meals ?? [];
};

const contiene = (ingredientes: string[], palabras: string[]) =>
  ingredientes.some((ing) => palabras.some((p) => ing.toLowerCase().includes(p)));

// Convierte un plato de la API al formato de Culturgourmet
const convertir = (meal: Meal, pais: string): Plato => {
  const ingredientes: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingrediente = meal['strIngredient' + i]?.trim();
    if (ingrediente) ingredientes.push(ingrediente);
  }

  const etiquetas: Etiqueta[] = [];
  const categoria = meal.strCategory ?? 'Especial';
  if (categoria === 'Vegetarian' || categoria === 'Vegan') etiquetas.push('Vegetariano');
  if (['Beef', 'Chicken', 'Pork', 'Lamb', 'Goat', 'Seafood'].includes(categoria)) etiquetas.push('Con carne');
  if (contiene(ingredientes, ['chilli', 'chili', 'jalapeno', 'cayenne'])) etiquetas.push('Picante');
  if (contiene(ingredientes, ['cheese', 'milk', 'cream', 'butter'])) etiquetas.push('Con lácteos');

  const texto = meal.strInstructions ?? 'Una deliciosa preparación gastronómica.';

  return {
    id: Number(meal.idMeal),
    nombre: meal.strMeal,
    pais,
    categoria,
    descripcion: texto.length > 110 ? texto.substring(0, 110) + '...' : texto,
    precio: 18000 + (Number(meal.idMeal) % 18) * 1000,
    imagen: meal.strMealThumb,
    porcion: 'Porción individual',
    ingredientes,
    etiquetas,
  };
};

const obtenerDetalle = async (id: string): Promise<Meal | null> => {
  const resultado = await pedir<Meal>('lookup.php?i=' + id);
  return resultado[0] ?? null;
};

// Trae algunos platos de una cultura
export const platosPorCultura = async (cultura: string, cantidad = 3): Promise<Plato[]> => {
  const area = areasPorCultura[cultura];
  if (!area) return [];

  const resumen = await pedir<MealResumen>('filter.php?a=' + area);
  const detalles = await Promise.all(
    resumen.slice(0, cantidad).map((m) => obtenerDetalle(m.idMeal))
  );

  return detalles
    .filter((m): m is Meal => m !== null)
    .map((m) => convertir(m, cultura));
};

// Carga el menú inicial con platos de todas las culturas
export const cargarMenu = async (): Promise<Plato[]> => {
  const grupos = await Promise.all(
    Object.keys(areasPorCultura).map((cultura) => platosPorCultura(cultura))
  );
  return grupos.flat();
};

// Busca platos por nombre en la API
export const buscarEnApi = async (texto: string): Promise<Plato[]> => {
  const resultados = await pedir<Meal>('search.php?s=' + encodeURIComponent(texto));
  return resultados.map((m) =>
    convertir(m, culturaPorArea[m.strArea ?? ''] ?? m.strArea ?? 'Internacional')
  );
};

// Convierte un plato de la API (lo usa el botón Plato sorpresa)
export const convertirPlatoApi = (meal: Meal): Plato =>
  convertir(meal, culturaPorArea[meal.strArea ?? ''] ?? meal.strArea ?? 'Internacional');