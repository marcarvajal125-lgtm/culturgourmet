export interface MetricaProyecto {
  id: number;
  titulo: string;
  valor: string;
  estado: 'Óptimo' | 'Alto' | 'Estable' | 'Crítico';
}

export type Etiqueta = 'Con carne' | 'Picante' | 'Con lácteos' | 'Vegetariano';

export interface Plato {
  id: number;
  nombre: string;
  pais: string;
  categoria: string;
  descripcion: string;
  precio: number;
  imagen: string;
  porcion: string;
  ingredientes: string[];
  etiquetas: Etiqueta[];
}

export interface ItemCarrito {
  plato: Plato;
  cantidad: number;
}

export interface Cultura {
  nombre: string;
  bandera: string;
}

export type MetodoEntrega = 'domicilio' | 'restaurante';
export interface Opinion {
  id: number;
  nombre: string;
  comentario: string;
  calificacion: number;
}