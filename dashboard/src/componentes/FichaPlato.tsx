import { useState } from 'react';
import type { Plato } from '../types/index';
import styles from './FichaPlato.module.css';

interface FichaPlatoProps {
  plato: Plato;
  onCerrar: () => void;
  onAgregar: (plato: Plato, cantidad: number) => void;
}

export const FichaPlato = ({ plato, onCerrar, onAgregar }: FichaPlatoProps) => {
  const [cantidad, setCantidad] = useState(1);

  const agregar = () => {
    onAgregar(plato, cantidad);
    onCerrar();
  };

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <div className={styles.ficha} onClick={(e) => e.stopPropagation()}>
        <button className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">✕</button>

        <img className={styles.foto} src={plato.imagen} alt={plato.nombre} />

        <div className={styles.info}>
          <span className={styles.ruta}>Inicio › {plato.pais} › {plato.categoria}</span>
          <h2>{plato.nombre}</h2>
          <p className={styles.descripcion}>{plato.descripcion}</p>

          <div className={styles.datos}>
            <span>País: {plato.pais}</span>
            <span>Porción: {plato.porcion}</span>
          </div>

          <h3>Ingredientes</h3>
          <ul className={styles.ingredientes}>
            {plato.ingredientes.map((ingrediente) => (
              <li key={ingrediente}>{ingrediente}</li>
            ))}
          </ul>

          <div className={styles.compra}>
            <span className={styles.precio}>
              ${(plato.precio * cantidad).toLocaleString('es-CO')}
            </span>

            <div className={styles.cantidad}>
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)}>+</button>
            </div>

            <button className={styles.agregar} onClick={agregar}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};